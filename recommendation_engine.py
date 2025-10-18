"""
AI-Powered Recommendation Engine for Benefits and Financial Wellness
"""
from user_profile import UserProfile
from typing import Dict, List
import json

class RecommendationEngine:
    """Generate personalized benefit and financial recommendations"""
    
    def __init__(self, chatbot=None):
        """Initialize with optional RAG chatbot for document-based recommendations"""
        self.chatbot = chatbot
    
    def generate_benefit_recommendations(self, profile: UserProfile) -> Dict:
        """Generate personalized benefit recommendations based on user profile"""
        recommendations = {
            'health_plan': self._recommend_health_plan(profile),
            'savings_accounts': self._recommend_savings_accounts(profile),
            'insurance': self._recommend_insurance(profile),
            'retirement': self._recommend_retirement(profile),
            'summary': ''
        }
        
        recommendations['summary'] = self._generate_summary(profile, recommendations)
        return recommendations
    
    def _recommend_health_plan(self, profile: UserProfile) -> Dict:
        """Recommend health insurance plan based on profile"""
        score_hdhp = 0  # High Deductible Health Plan
        score_ppo = 0   # PPO
        score_hmo = 0   # HMO
        
        # Frequency of medical visits
        if profile.expected_medical_visits == "Rarely (0-1 per year)":
            score_hdhp += 3
            score_ppo += 1
        elif profile.expected_medical_visits == "1-3 per year":
            score_hdhp += 2
            score_ppo += 2
            score_hmo += 1
        elif profile.expected_medical_visits == "4-6 per year":
            score_ppo += 3
            score_hmo += 2
        else:  # 7+ per year
            score_ppo += 3
            score_hmo += 3
        
        # Chronic conditions or regular medications
        if profile.regular_medications or len(profile.chronic_conditions) > 0:
            score_ppo += 3
            score_hmo += 2
            score_hdhp -= 1
        
        # Financial situation
        if profile.emergency_fund_months >= 3:
            score_hdhp += 2  # Can handle high deductible
        else:
            score_hmo += 2
            score_ppo += 1
        
        # Income level
        if profile.annual_income < 40000:
            score_hmo += 2  # Lower premiums
        elif profile.annual_income > 70000:
            score_hdhp += 1  # Can afford high deductible
        
        # Preferences
        if profile.prefers_low_premium:
            score_hdhp += 2
            score_hmo += 1
        if profile.prefers_low_deductible:
            score_ppo += 2
            score_hmo += 2
            score_hdhp -= 2
        if profile.values_flexibility:
            score_ppo += 2
        
        # Determine recommendation
        scores = {'HDHP': score_hdhp, 'PPO': score_ppo, 'HMO': score_hmo}
        recommended = max(scores, key=scores.get)
        
        reasons = []
        if recommended == 'HDHP':
            reasons.append("Lower monthly premiums save money")
            if profile.emergency_fund_months >= 3:
                reasons.append("You have emergency savings to cover high deductible")
            if profile.expected_medical_visits in ["Rarely (0-1 per year)", "1-3 per year"]:
                reasons.append("Your low medical usage makes HDHP cost-effective")
            reasons.append("Eligible for HSA with triple tax advantages")
        elif recommended == 'PPO':
            reasons.append("Flexibility to see any doctor without referrals")
            if profile.regular_medications or profile.chronic_conditions:
                reasons.append("Good coverage for frequent medical needs")
            reasons.append("Moderate premiums with reasonable out-of-pocket costs")
        else:  # HMO
            reasons.append("Lowest monthly premiums")
            reasons.append("Coordinated care through primary care physician")
            if profile.emergency_fund_months < 3:
                reasons.append("Lower out-of-pocket costs fit your budget")
        
        return {
            'recommended_plan': recommended,
            'confidence': 'High' if scores[recommended] >= 6 else 'Medium',
            'reasons': reasons,
            'scores': scores,
            'alternatives': [k for k, v in sorted(scores.items(), key=lambda x: x[1], reverse=True)[1:]]
        }
    
    def _recommend_savings_accounts(self, profile: UserProfile) -> Dict:
        """Recommend FSA/HSA based on profile"""
        recommendations = []
        
        # HSA recommendation
        if profile.interested_in_hsa or profile.prefers_low_premium:
            hsa_score = 0
            if profile.expected_medical_visits in ["Rarely (0-1 per year)", "1-3 per year"]:
                hsa_score += 2
            if profile.emergency_fund_months >= 2:
                hsa_score += 2
            if profile.annual_income > 45000:
                hsa_score += 1
            
            if hsa_score >= 3:
                recommendations.append({
                    'type': 'HSA',
                    'priority': 'High',
                    'contribution': min(4150 if profile.marital_status == "Single" else 8300, 
                                       profile.annual_income * 0.05),
                    'reasons': [
                        'Triple tax advantage: Deductible, tax-free growth, tax-free withdrawals',
                        'Funds roll over year to year',
                        'Can be invested for retirement healthcare'
                    ]
                })
        
        # Dependent Care FSA
        if profile.has_children or profile.dependents > 0:
            recommendations.append({
                'type': 'Dependent Care FSA',
                'priority': 'High',
                'contribution': 5000,  # Max for 2024
                'reasons': [
                    'Save on childcare or elder care expenses',
                    'Reduce taxable income',
                    'Use pre-tax dollars for eligible expenses'
                ]
            })
        
        # Healthcare FSA (if not HDHP/HSA)
        if not profile.interested_in_hsa and profile.regular_medications:
            recommendations.append({
                'type': 'Healthcare FSA',
                'priority': 'Medium',
                'contribution': 1500,
                'reasons': [
                    'Use pre-tax dollars for medical expenses',
                    'Good for predictable medical costs'
                ]
            })
        
        return {
            'recommended_accounts': recommendations,
            'total_tax_savings': sum(r.get('contribution', 0) for r in recommendations) * 0.22  # Assumed 22% tax bracket
        }
    
    def _recommend_insurance(self, profile: UserProfile) -> Dict:
        """Recommend supplemental insurance based on profile"""
        recommendations = []
        
        # Life Insurance
        if profile.dependents > 0 or profile.marital_status != "Single":
            coverage_needed = profile.annual_income * min(10, 15 - profile.age // 10)
            recommendations.append({
                'type': 'Life Insurance',
                'priority': 'High',
                'coverage': coverage_needed,
                'reasons': [
                    'Protect your family financially',
                    f'Recommended coverage: {coverage_needed:,.0f} (10x annual income)'
                ]
            })
        
        # Disability Insurance
        if profile.annual_income > 40000:
            recommendations.append({
                'type': 'Disability Insurance',
                'priority': 'High',
                'coverage': profile.annual_income * 0.6,
                'reasons': [
                    'Replace 60% of income if unable to work',
                    'Critical protection for your earning power'
                ]
            })
        
        # Dental & Vision
        if profile.has_children or profile.dependents > 0:
            recommendations.append({
                'type': 'Dental & Vision',
                'priority': 'Medium',
                'reasons': [
                    'Preventive care for whole family',
                    'Often pays for itself with regular checkups'
                ]
            })
        
        return {'recommended_coverage': recommendations}
    
    def _recommend_retirement(self, profile: UserProfile) -> Dict:
        """Recommend retirement savings strategy"""
        # Calculate recommended contribution rate
        age_factor = 1.0 + ((40 - profile.age) / 100)  # Earlier = higher target
        recommended_rate = min(15, 10 * age_factor) / 100
        recommended_monthly = profile.annual_income / 12 * recommended_rate
        
        recommendations = []
        
        # 401(k) match
        recommendations.append({
            'account': '401(k)',
            'priority': 'Critical',
            'contribution': recommended_monthly,
            'percentage': recommended_rate * 100,
            'reasons': [
                'Start with employer match (free money!)',
                f'Target {recommended_rate*100:.0f}% of income for retirement',
                'Tax-deferred growth compound over time'
            ]
        })
        
        # Roth IRA for young employees
        if profile.age < 35 and profile.annual_income < 125000:
            recommendations.append({
                'account': 'Roth IRA',
                'priority': 'High',
                'contribution': min(583, profile.annual_income / 12 * 0.05),  # $7000/year max in 2024
                'reasons': [
                    'Tax-free withdrawals in retirement',
                    'Perfect for early career - pay taxes now when rate is low',
                    'Flexibility to withdraw contributions'
                ]
            })
        
        return {
            'recommended_accounts': recommendations,
            'total_monthly_target': recommended_monthly,
            'retirement_readiness': 'On Track' if profile.retirement_contribution >= recommended_monthly else 'Needs Improvement'
        }
    
    def _generate_summary(self, profile: UserProfile, recommendations: Dict) -> str:
        """Generate a personalized summary"""
        health_plan = recommendations['health_plan']['recommended_plan']
        
        summary_parts = [
            f"Based on your profile, we recommend a **{health_plan} health plan**.",
        ]
        
        if recommendations['savings_accounts']['recommended_accounts']:
            accounts = [acc['type'] for acc in recommendations['savings_accounts']['recommended_accounts']]
            summary_parts.append(f"Consider opening: {', '.join(accounts)}.")
        
        if recommendations['retirement']['recommended_accounts']:
            ret_contribution = recommendations['retirement']['total_monthly_target']
            summary_parts.append(f"Target ${ret_contribution:.0f}/month for retirement savings.")
        
        # Add priority action
        priorities = profile.get_priority_recommendations()
        if priorities:
            top_priority = priorities[0]
            summary_parts.append(f"**Top Priority:** {top_priority['message']}")
        
        return " ".join(summary_parts)
    
    def generate_ai_recommendations(self, profile: UserProfile, question: str = None) -> str:
        """Use RAG chatbot to generate contextual recommendations from benefit documents"""
        if not self.chatbot or not hasattr(self.chatbot, 'conversation_chain'):
            return "AI recommendations require documents to be processed first."
        
        profile_context = profile.get_profile_summary()
        
        if question is None:
            question = f"""Based on my profile, what benefit options should I consider?

{profile_context}

Please provide specific recommendations for:
1. Health insurance plan selection
2. FSA/HSA accounts
3. Retirement savings
4. Other relevant benefits

Consider my medical needs, financial situation, and goals."""
        else:
            question = f"{question}\n\nMy Profile:\n{profile_context}"
        
        try:
            response = self.chatbot.chat(question)
            return response['answer']
        except Exception as e:
            return f"Error generating AI recommendations: {str(e)}"

