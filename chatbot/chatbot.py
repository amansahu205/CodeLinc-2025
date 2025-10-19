import boto3
import json

class FinancialChatbot:
    def __init__(self):
        self.bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')
        self.conversation_history = []
    
    def chat(self, user_message, user_profile=None):
        self.conversation_history.append({"role": "user", "content": user_message})
        
        context = f"User: age {user_profile.get('age')}, salary ${user_profile.get('salary')}, dependents {user_profile.get('dependents')}" if user_profile else ""
        response = self._get_ai_response(user_message, context)
        
        self.conversation_history.append({"role": "assistant", "content": response})
        return response
    
    def _get_ai_response(self, message, context):
        try:
            prompt = f"{context}\n\nUser: {message}\n\nAssistant:"
            response = self.bedrock.invoke_model(
                modelId='anthropic.claude-v2',
                contentType='application/json',
                body=json.dumps({
                    'prompt': f'\n\nHuman: {prompt}\n\nAssistant:',
                    'max_tokens_to_sample': 500
                })
            )
            result = json.loads(response['body'].read())
            return result.get('completion', 'I can help with benefit questions.')
        except:
            return "I'm here to help with your benefits. What would you like to know?"
    
    def reset(self):
        self.conversation_history = []
