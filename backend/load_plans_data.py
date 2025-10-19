"""
Production script to load benefit plans data into database.
Run this once after database initialization.
"""
import psycopg2
import os
from dotenv import load_dotenv
import re

load_dotenv()

def load_plans():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        database=os.getenv('DB_NAME', 'postgres'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD')
    )
    cur = conn.cursor()
    
    # Check current status
    cur.execute('SELECT COUNT(*) FROM benefits')
    benefit_count = cur.fetchone()[0]
    cur.execute('SELECT COUNT(*) FROM plans')
    plan_count = cur.fetchone()[0]
    
    print(f"Current status: {benefit_count} benefits, {plan_count} plans")
    
    if plan_count > 0:
        print("✅ Plans already loaded")
        cur.close()
        conn.close()
        return
    
    if benefit_count == 0:
        print("❌ No benefits found. Load benefits first.")
        cur.close()
        conn.close()
        return
    
    # Load plans
    print("📋 Loading plans data...")
    with open('database/add_plans_data.sql', 'r') as f:
        content = f.read()
    
    # Extract only INSERT INTO plans statements
    plan_inserts = re.findall(r"INSERT INTO plans.*?;", content, re.DOTALL)
    
    success = 0
    for insert in plan_inserts:
        try:
            cur.execute(insert)
            conn.commit()
            success += 1
        except Exception as e:
            print(f"❌ Error: {e}")
            conn.rollback()
            break
    
    cur.execute('SELECT COUNT(*) FROM plans')
    final_count = cur.fetchone()[0]
    print(f"✅ Loaded {final_count} plans successfully")
    
    cur.close()
    conn.close()

if __name__ == '__main__':
    load_plans()
