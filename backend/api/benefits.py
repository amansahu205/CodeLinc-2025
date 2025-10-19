from database.db import get_db_connection

def get_all_benefits():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        SELECT b.id, b.name, b.description, b.icon,
               json_agg(json_build_object('id', p.id, 'name', p.name, 'cost', p.cost_per_paycheck, 'details', p.details))
        FROM benefits b
        LEFT JOIN plans p ON b.id = p.benefit_id
        GROUP BY b.id, b.name, b.description, b.icon
    ''')
    results = cur.fetchall()
    cur.close()
    conn.close()
    
    benefits = []
    for row in results:
        benefits.append({
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'icon': row[3],
            'plans': row[4] if row[4] else []
        })
    return benefits
