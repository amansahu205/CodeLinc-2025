import json
import os
from services.benefits_knowledge import get_explanation, BENEFITS_KNOWLEDGE

class AIService:
    def __init__(self):
        self.bedrock = None
        try:
            import boto3
            self.bedrock = boto3.client(
                'bedrock-runtime',
                region_name=os.getenv('AWS_REGION', 'us-east-1'),
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            print("✓ Bedrock initialized")
        except Exception as e:
            print(f"Bedrock not available, using local knowledge base: {e}")
            self.bedrock = None
    
    def get_chat_response(self, message, user_id):
        # Get user profile from DB for context
        from database.db import get_db_connection
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT age, salary, dependents FROM users WHERE id=%s', (user_id,))
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        # Parse message for questionnaire responses
        try:
            data = json.loads(message)
            if 'responses' in data:
                return self._generate_recommendations(data['user'], data['responses'])
        except:
            pass
        
        # Detect life events and generate recommendations
        recommendations = self._detect_life_events(message, user)
        
        # Try Bedrock first if available
        if self.bedrock:
            try:
                reply = self._get_bedrock_response(message, user)
                return {'reply': reply, 'recommendations': recommendations}
            except Exception as e:
                print(f"Bedrock error, falling back to local: {e}")
        
        # Fallback to local knowledge base
        explanation = get_explanation(message, user)
        if explanation and not explanation.startswith('I can explain'):
            return {'reply': explanation, 'recommendations': recommendations}
        
        reply = self._get_simple_answer(message, user)
        return {'reply': reply, 'recommendations': recommendations}
    
    def _generate_recommendations(self, user, responses):
        recommendations = []
        age = user.get('age', 30)
        salary = user.get('salary', 50000)
        dependents = user.get('dependents', 0)
        
        health = responses.get('healthStatus', '')
        family = responses.get('familyPlanning', '')
        debt = responses.get('debtLevel', '')
        emergency = responses.get('emergencyFund', '')
        risk = responses.get('riskTolerance', '')
        care = responses.get('dependentCareNeeds', '')
        education = responses.get('educationSavings', '')
        
        # Health Insurance
        if 'chronic' in health.lower() or 'medications' in health.lower():
            recommendations.append({'name': 'Health Insurance', 'level': 'Highly Recommended'})
        elif dependents > 0 or 'yes' in family.lower():
            recommendations.append({'name': 'Health Insurance', 'level': 'Highly Recommended'})
        else:
            recommendations.append({'name': 'Health Insurance', 'level': 'Recommended'})
        
        # Dental & Vision
        if dependents > 0:
            recommendations.append({'name': 'Dental Insurance', 'level': 'Highly Recommended'})
            recommendations.append({'name': 'Vision Insurance', 'level': 'Recommended'})
        else:
            recommendations.append({'name': 'Dental Insurance', 'level': 'Recommended'})
            recommendations.append({'name': 'Vision Insurance', 'level': 'Worth Considering'})
        
        # Disability
        if 'security' in risk.lower() or salary > 60000:
            recommendations.append({'name': 'Long-Term Disability', 'level': 'Highly Recommended'})
            recommendations.append({'name': 'Short-Term Disability', 'level': 'Recommended'})
        else:
            recommendations.append({'name': 'Long-Term Disability', 'level': 'Recommended'})
            recommendations.append({'name': 'Short-Term Disability', 'level': 'Worth Considering'})
        
        # EAP
        if 'high' in debt.lower() or 'no' in emergency.lower():
            recommendations.append({'name': 'Employee Assistance', 'level': 'Highly Recommended'})
        else:
            recommendations.append({'name': 'Employee Assistance', 'level': 'Worth Considering'})
        
        # Caregiver & Tutoring
        if 'yes' in care.lower() or 'both' in care.lower():
            recommendations.append({'name': 'Caregiver Resources', 'level': 'Highly Recommended'})
            recommendations.append({'name': 'Tutoring Support', 'level': 'Highly Recommended'})
        elif dependents > 0:
            recommendations.append({'name': 'Caregiver Resources', 'level': 'Worth Considering'})
            recommendations.append({'name': 'Tutoring Support', 'level': 'Worth Considering'})
        
        return {'reply': 'Recommendations generated', 'recommendations': recommendations}
    
    def _get_bedrock_response(self, message, user):
        """Get AI response from AWS Bedrock Amazon Titan"""
        age, salary, dependents = user
        
        prompt = f"""You are a friendly benefits advisor. User: {age} years old, ${salary:,} salary, {dependents} dependent(s).

Question: {message}

Provide a helpful, concise answer in 2-3 sentences using simple language."""
        
        body = json.dumps({
            "inputText": prompt,
            "textGenerationConfig": {
                "maxTokenCount": 300,
                "temperature": 0.7,
                "topP": 0.9
            }
        })
        
        response = self.bedrock.invoke_model(
            modelId='amazon.titan-text-express-v1',
            body=body
        )
        
        result = json.loads(response['body'].read())
        return result['results'][0]['outputText'].strip()
    
    def _get_simple_answer(self, message, user):
        """Provide simple, beginner-friendly answers"""
        msg_lower = message.lower()
        age, salary, dependents = user
        
        # What is questions
        if 'what is' in msg_lower or 'what are' in msg_lower or 'explain' in msg_lower:
            return get_explanation(message, user)
        
        # Why do I need
        if 'why' in msg_lower and 'need' in msg_lower:
            if 'health' in msg_lower:
                return "You need health insurance because medical bills can be extremely expensive. A single emergency room visit can cost $3,000-10,000. Insurance protects you from financial disaster and ensures you can get care when sick."
            elif 'dental' in msg_lower:
                return "Dental insurance keeps your teeth healthy and saves money. Without it, a root canal costs $1,000-1,500, and cleanings cost $100-200. With insurance, preventive care is free and major work is 50% covered."
            elif 'disability' in msg_lower:
                return "Disability insurance protects your income if you can't work due to injury or illness. If you're seriously hurt and can't work for months, how will you pay rent and bills? This ensures you still get 60% of your salary."
        
        # How much questions
        if 'how much' in msg_lower or 'cost' in msg_lower:
            return "Benefit costs vary by plan. Health insurance typically costs $100-200 per paycheck. Dental is $15-25. Vision is around $8. Disability is $8-12. The exact cost depends on which plan level you choose. I can show you specific plan costs if you'd like!"
        
        # Which plan questions
        if 'which plan' in msg_lower or 'what plan' in msg_lower or 'recommend' in msg_lower:
            if dependents > 0:
                return f"Since you have {dependents} dependent(s), I recommend comprehensive coverage: a mid-tier health plan, dental, and vision. These protect your family's health. Would you like me to compare specific plans?"
            elif salary > 60000:
                return "Based on your salary, I recommend a balanced approach: good health coverage, dental, and disability insurance to protect your income. Want to see plan options?"
            else:
                return "For your situation, I recommend starting with essential coverage: a basic health plan and dental. As your income grows, you can add more coverage. Want to compare plans?"
        
        # Difference between plans
        if 'difference' in msg_lower or 'compare' in msg_lower:
            return "Plans differ in 3 main ways: 1) **Cost per paycheck** (premium), 2) **Deductible** (what you pay before insurance kicks in), and 3) **Coverage level** (how much insurance pays). Higher premium = lower deductible = better coverage. Would you like to see specific plan comparisons?"
        
        # Default helpful response
        return "I'm here to explain benefits in simple terms! Ask me things like: 'What is health insurance?', 'Why do I need dental?', 'How much does it cost?', 'Which plan should I choose?', or 'What's a deductible?'"
    
    def _detect_life_events(self, message, user):
        """Detect life events in chat and return updated recommendations"""
        msg_lower = message.lower()
        recommendations = []
        age, salary, dependents = user
        
        # Pregnancy/Baby
        if any(word in msg_lower for word in ['pregnant', 'baby', 'expecting', 'maternity', 'newborn', 'child']):
            recommendations.extend([
                {'name': 'Health Insurance', 'level': 'Highly Recommended'},
                {'name': 'Short-Term Disability', 'level': 'Highly Recommended'},
                {'name': 'Dental Insurance', 'level': 'Recommended'},
                {'name': 'Vision Insurance', 'level': 'Recommended'}
            ])
        
        # Marriage/Family
        if any(word in msg_lower for word in ['married', 'spouse', 'partner', 'family']):
            recommendations.extend([
                {'name': 'Health Insurance', 'level': 'Highly Recommended'},
                {'name': 'Dental Insurance', 'level': 'Recommended'},
                {'name': 'Life Insurance', 'level': 'Recommended'}
            ])
        
        # Health Issues
        if any(word in msg_lower for word in ['sick', 'illness', 'disease', 'chronic', 'medication', 'surgery', 'hospital']):
            recommendations.extend([
                {'name': 'Health Insurance', 'level': 'Highly Recommended'},
                {'name': 'Short-Term Disability', 'level': 'Highly Recommended'},
                {'name': 'Long-Term Disability', 'level': 'Recommended'}
            ])
        
        # Financial Stress
        if any(word in msg_lower for word in ['debt', 'loan', 'financial', 'money', 'afford', 'expensive']):
            recommendations.extend([
                {'name': 'Employee Assistance', 'level': 'Highly Recommended'},
                {'name': 'Health Insurance', 'level': 'Recommended'}
            ])
        
        # Dental/Vision Issues
        if any(word in msg_lower for word in ['teeth', 'dental', 'dentist', 'cavity', 'braces']):
            recommendations.append({'name': 'Dental Insurance', 'level': 'Highly Recommended'})
        
        if any(word in msg_lower for word in ['glasses', 'vision', 'eyes', 'contacts', 'eyesight']):
            recommendations.append({'name': 'Vision Insurance', 'level': 'Highly Recommended'})
        
        # Caregiving
        if any(word in msg_lower for word in ['elderly', 'parent', 'caregiver', 'aging', 'senior']):
            recommendations.append({'name': 'Caregiver Resources', 'level': 'Highly Recommended'})
        
        # Education
        if any(word in msg_lower for word in ['college', 'education', 'school', 'tuition', 'student']):
            recommendations.append({'name': 'Tutoring Support', 'level': 'Recommended'})
        
        # Remove duplicates, keep highest priority
        unique_recs = {}
        priority = {'Highly Recommended': 3, 'Recommended': 2, 'Worth Considering': 1}
        for rec in recommendations:
            name = rec['name']
            if name not in unique_recs or priority[rec['level']] > priority[unique_recs[name]['level']]:
                unique_recs[name] = rec
        
        return list(unique_recs.values())
    
    def _parse_recommendations(self, reply, user):
        # AI-driven recommendations based on user profile
        recommendations = []
        age, salary, dependents = user
        
        # Highly Recommended (top priority)
        if dependents > 0:
            recommendations.append({'name': 'Health Insurance', 'level': 'Highly Recommended'})
            recommendations.append({'name': 'Dental Insurance', 'level': 'Highly Recommended'})
        elif salary > 60000:
            recommendations.append({'name': 'Health Insurance', 'level': 'Highly Recommended'})
        
        # Recommended (good fit)
        if age < 35:
            recommendations.append({'name': 'Short-Term Disability', 'level': 'Recommended'})
        if dependents > 0:
            recommendations.append({'name': 'Vision Insurance', 'level': 'Recommended'})
        if salary > 50000:
            recommendations.append({'name': 'Long-Term Disability', 'level': 'Recommended'})
        
        # Worth Considering (moderate fit)
        recommendations.append({'name': 'Employee Assistance', 'level': 'Worth Considering'})
        
        return recommendations
