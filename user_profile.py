"""
User Profile Management for Benefits & Financial Wellness Advisor
"""
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class UserProfile:
    """User profile data class"""
    # Personal Information
    name: str = ""
    age: int = 25
    email: str = ""
    
    # Employment & Financial
    annual_income: float = 50000.0
    employment_status: str = "Full-time"
    years_of_experience: int = 0
    
    # Family & Dependents
    marital_status: str = "Single"
    dependents: int = 0
    has_children: bool = False
    
    # Health Information
    health_status: str = "Good"
    chronic_conditions: List[str] = None
    regular_medications: bool = False
    expected_medical_visits: str = "1-3 per year"
    
    # Financial Situation
    monthly_expenses: float = 2500.0
    current_savings: float = 5000.0
    emergency_fund_months: float = 2.0
    student_loan_debt: float = 0.0
    credit_card_debt: float = 0.0
    other_debt: float = 0.0
    
    # Financial Goals
    primary_financial_goal: str = "Build emergency fund"
    retirement_contribution: float = 0.0
    interested_in_hsa: bool = False
    risk_tolerance: str = "Moderate"
    
    # Preferences
    prefers_low_premium: bool = True
    prefers_low_deductible: bool = False
    values_flexibility: bool = True
    
    # Metadata
    profile_completed: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def __post_init__(self):
        if self.chronic_conditions is None:
            self.chronic_conditions = []
        if self.created_at is None:
            self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    def to_dict(self):
        """Convert profile to dictionary"""
        return {
            'name': self.name,
            'age': self.age,
            'email': self.email,
            'annual_income': self.annual_income,
            'employment_status': self.employment_status,
            'years_of_experience': self.years_of_experience,
            'marital_status': self.marital_status,
            'dependents': self.dependents,
            'has_children': self.has_children,
            'health_status': self.health_status,
            'chronic_conditions': self.chronic_conditions,
            'regular_medications': self.regular_medications,
            'expected_medical_visits': self.expected_medical_visits,
            'monthly_expenses': self.monthly_expenses,
            'current_savings': self.current_savings,
            'emergency_fund_months': self.emergency_fund_months,
            'student_loan_debt': self.student_loan_debt,
            'credit_card_debt': self.credit_card_debt,
            'other_debt': self.other_debt,
            'primary_financial_goal': self.primary_financial_goal,
            'retirement_contribution': self.retirement_contribution,
            'interested_in_hsa': bool(self.interested_in_hsa),
            'risk_tolerance': self.risk_tolerance,
            'prefers_low_premium': self.prefers_low_premium,
            'prefers_low_deductible': self.prefers_low_deductible,
            'values_flexibility': self.values_flexibility,
            'profile_completed': self.profile_completed
        }
    
    def get_profile_summary(self):
        """Generate a human-readable profile summary for AI context"""
        summary = f"""
User Profile Summary:
- Age: {self.age}, Income: ${self.annual_income:,.0f}/year
- Status: {self.marital_status} with {self.dependents} dependent(s)
- Health: {self.health_status}, Expected visits: {self.expected_medical_visits}
- Financial: ${self.current_savings:,.0f} savings, {self.emergency_fund_months:.1f} months emergency fund
- Debt: Student loans ${self.student_loan_debt:,.0f}, Credit card ${self.credit_card_debt:,.0f}
- Primary Goal: {self.primary_financial_goal}
- Preferences: {'Low premiums' if self.prefers_low_premium else 'Low deductibles'}, {'Flexible plans' if self.values_flexibility else 'Structured plans'}
- Risk Tolerance: {self.risk_tolerance}
"""
        return summary.strip()
    
    def calculate_financial_health_score(self):
        """Calculate a financial health score (0-100)"""
        score = 50  # Base score
        
        # Emergency fund (+20 points max)
        if self.emergency_fund_months >= 6:
            score += 20
        elif self.emergency_fund_months >= 3:
            score += 10
        elif self.emergency_fund_months >= 1:
            score += 5
        
        # Debt-to-income ratio (-20 points max)
        total_debt = self.student_loan_debt + self.credit_card_debt + self.other_debt
        debt_to_income = (total_debt / self.annual_income) if self.annual_income > 0 else 0
        if debt_to_income < 0.2:
            score += 15
        elif debt_to_income < 0.5:
            score += 5
        elif debt_to_income > 1.0:
            score -= 20
        elif debt_to_income > 0.7:
            score -= 10
        
        # Retirement contribution (+15 points max)
        retirement_rate = (self.retirement_contribution * 12 / self.annual_income) if self.annual_income > 0 else 0
        if retirement_rate >= 0.15:  # 15%+
            score += 15
        elif retirement_rate >= 0.10:  # 10-15%
            score += 10
        elif retirement_rate >= 0.05:  # 5-10%
            score += 5
        
        return min(100, max(0, score))
    
    def get_priority_recommendations(self):
        """Get priority areas for financial improvement"""
        priorities = []
        
        # Check emergency fund
        if self.emergency_fund_months < 3:
            priorities.append({
                'area': 'Emergency Fund',
                'priority': 'High',
                'message': f'Build emergency fund to at least 3 months of expenses (${self.monthly_expenses * 3:,.0f})',
                'action': 'Save consistently each month'
            })
        
        # Check high-interest debt
        if self.credit_card_debt > 1000:
            priorities.append({
                'area': 'Credit Card Debt',
                'priority': 'High',
                'message': f'Pay down ${self.credit_card_debt:,.0f} in credit card debt',
                'action': 'Focus on high-interest debt first'
            })
        
        # Check retirement savings
        if self.retirement_contribution < (self.annual_income / 12 * 0.10):
            priorities.append({
                'area': 'Retirement Savings',
                'priority': 'Medium',
                'message': 'Increase retirement contribution to at least 10% of income',
                'action': 'Start with employer match, then increase gradually'
            })
        
        # Health insurance optimization
        if self.regular_medications or self.expected_medical_visits in ["4-6 per year", "7+ per year"]:
            priorities.append({
                'area': 'Health Coverage',
                'priority': 'Medium',
                'message': 'Consider a plan with lower deductible due to frequent medical needs',
                'action': 'Compare total annual costs including premiums and expected out-of-pocket'
            })
        
        return priorities

