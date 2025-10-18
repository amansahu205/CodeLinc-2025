"""
Insurance-specific prompts and templates for the RAG chatbot
"""

INSURANCE_SYSTEM_PROMPT = """You are an AI-powered Benefits and Financial Wellness Advisor for employees. 
Your role is to help employees make informed decisions about their benefits and financial wellness.

EXPERTISE AREAS:
- Health insurance (PPO, HMO, HDHP, HSA compatibility)
- Dental and vision insurance options
- Life and disability insurance
- Retirement plans (401k, 403b, pension)
- FSA, HSA, and dependent care accounts
- Financial wellness (budgeting, debt management, emergency funds)
- Benefits enrollment and life event changes

GUIDELINES:
- Provide clear, actionable advice based on the context
- Explain insurance terms in simple language
- Consider cost vs. coverage trade-offs
- Suggest personalized recommendations when possible
- Always reference specific document sections when available
- If information isn't in the context, direct users to HR or benefits administrator

Context: {context}

Question: {question}

Answer:"""

BENEFITS_CATEGORIES = {
    "health": ["health insurance", "medical", "PPO", "HMO", "HDHP", "deductible", "copay", "coinsurance"],
    "dental": ["dental", "orthodontics", "preventive care", "dental plan"],
    "vision": ["vision", "eye care", "glasses", "contacts", "eye exam"],
    "retirement": ["401k", "403b", "pension", "retirement", "matching", "vesting"],
    "fsa_hsa": ["FSA", "HSA", "flexible spending", "health savings", "dependent care"],
    "life_disability": ["life insurance", "disability", "AD&D", "accidental death"],
    "wellness": ["wellness", "EAP", "employee assistance", "mental health", "fitness"]
}

SAMPLE_QUESTIONS = [
    "What's the difference between PPO and HMO health plans?",
    "How much should I contribute to my 401(k)?",
    "What expenses are eligible for FSA reimbursement?",
    "Which dental plan offers the best orthodontic coverage?",
    "What's the company match on retirement contributions?",
    "How do I enroll my spouse in health insurance?",
    "What happens to my benefits if I take unpaid leave?",
    "Should I choose a high-deductible health plan with HSA?",
    "What life insurance coverage do I need?",
    "How do I change my benefits during open enrollment?"
]

def get_category_prompt(category):
    """Get specialized prompt for specific benefits category"""
    prompts = {
        "health": "Focus on health insurance options, costs, networks, and coverage details.",
        "dental": "Explain dental plan options, coverage levels, and cost considerations.",
        "vision": "Describe vision insurance benefits, coverage for glasses/contacts, and providers.",
        "retirement": "Provide guidance on retirement planning, contribution strategies, and employer matching.",
        "fsa_hsa": "Explain FSA/HSA benefits, eligible expenses, and tax advantages.",
        "life_disability": "Describe life and disability insurance options and coverage amounts.",
        "wellness": "Highlight wellness programs, EAP services, and health resources."
    }
    return prompts.get(category, "Provide comprehensive benefits guidance.")