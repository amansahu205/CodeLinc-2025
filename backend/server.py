from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from database.db import get_db_connection

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')



@app.route('/', methods=['GET'])
def home():
    return jsonify({'status': 'ok', 'message': 'Benefits API Running'})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/benefits', methods=['GET'])
def get_benefits():
    from api.benefits import get_all_benefits
    benefits = get_all_benefits()
    return jsonify({'benefits': benefits})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, name, age, salary, dependents, last_questionnaire_date FROM users WHERE email=%s AND password_hash=%s',
                (data['email'], data['password']))
    user = cur.fetchone()
    cur.close()
    conn.close()
    
    if user:
        token = jwt.encode({'user_id': user[0], 'exp': datetime.utcnow() + timedelta(days=1)},
                          app.config['SECRET_KEY'], algorithm='HS256')
        
        # Check if questionnaire needed (once per year)
        needs_questionnaire = True
        if user[5]:  # last_questionnaire_date
            last_date = user[5] if isinstance(user[5], datetime) else datetime.strptime(str(user[5]), '%Y-%m-%d')
            needs_questionnaire = (datetime.now() - last_date).days > 365
        
        return jsonify({
            'token': token, 
            'user': {
                'id': user[0], 
                'name': user[1], 
                'age': user[2], 
                'salary': user[3], 
                'dependents': user[4],
                'needsQuestionnaire': needs_questionnaire
            }
        })
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/selections', methods=['GET'])
def get_selections():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    try:
        user_id = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])['user_id']
        return jsonify({'selections': []})
    except:
        return jsonify({'error': 'Unauthorized'}), 401

@app.route('/api/selections', methods=['POST'])
def save_selection():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    try:
        user_id = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])['user_id']
        data = request.json
        return jsonify({'success': True})
    except:
        return jsonify({'error': 'Unauthorized'}), 401

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return '', 204
    
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    try:
        user_id = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])['user_id']
        data = request.json
        from services.ai_service import AIService
        ai = AIService()
        result = ai.get_chat_response(data['message'], user_id)
        
        # Update questionnaire date if responses provided
        try:
            import json as json_lib
            msg_data = json_lib.loads(data['message'])
            if 'responses' in msg_data:
                conn = get_db_connection()
                cur = conn.cursor()
                cur.execute('UPDATE users SET last_questionnaire_date = CURRENT_DATE WHERE id = %s', (user_id,))
                conn.commit()
                cur.close()
                conn.close()
        except:
            pass
        
        return jsonify(result)
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired', 'reply': 'Your session expired. Please login again.'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token', 'reply': 'Authentication failed. Please login again.'}), 401
    except Exception as e:
        return jsonify({'error': 'Chat failed', 'reply': 'Sorry, I encountered an error. Please try again.'}), 500

@app.route('/api/enroll', methods=['POST'])
def enroll():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    try:
        user_id = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])['user_id']
        return jsonify({'success': True, 'message': 'Enrollment summary sent'})
    except:
        return jsonify({'error': 'Unauthorized'}), 401



if __name__ == '__main__':
    app.run(debug=True, port=5000)
