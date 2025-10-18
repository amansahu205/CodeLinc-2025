"""
Financial Wellness Calculators
"""
import math
from typing import Dict, List, Tuple

class FinancialCalculators:
    """Collection of financial wellness calculators"""
    
    @staticmethod
    def calculate_budget_breakdown(monthly_income: float, 
                                   expenses: Dict[str, float] = None) -> Dict:
        """
        Calculate budget breakdown using 50/30/20 rule
        50% - Needs
        30% - Wants
        20% - Savings/Debt
        """
        if expenses is None:
            expenses = {}
        
        # Calculate recommended allocations
        needs_budget = monthly_income * 0.50
        wants_budget = monthly_income * 0.30
        savings_budget = monthly_income * 0.20
        
        # Calculate actual spending
        total_expenses = sum(expenses.values())
        remaining = monthly_income - total_expenses
        
        return {
            'monthly_income': monthly_income,
            'recommended': {
                'needs': needs_budget,
                'wants': wants_budget,
                'savings': savings_budget
            },
            'actual': {
                'total_expenses': total_expenses,
                'remaining': remaining
            },
            'breakdown': expenses,
            'savings_rate': (remaining / monthly_income * 100) if monthly_income > 0 else 0
        }
    
    @staticmethod
    def calculate_emergency_fund_goal(monthly_expenses: float, 
                                     target_months: int = 6) -> Dict:
        """Calculate emergency fund goal and progress"""
        target_amount = monthly_expenses * target_months
        
        return {
            'monthly_expenses': monthly_expenses,
            'target_months': target_months,
            'target_amount': target_amount,
            'recommendation': f"Aim to save ${target_amount:,.2f} (${monthly_expenses:,.2f} × {target_months} months)"
        }
    
    @staticmethod
    def calculate_savings_timeline(current_savings: float,
                                   goal_amount: float,
                                   monthly_contribution: float,
                                   annual_interest_rate: float = 0.04) -> Dict:
        """Calculate how long it takes to reach a savings goal"""
        if monthly_contribution <= 0:
            return {
                'error': 'Monthly contribution must be greater than 0',
                'months_to_goal': float('inf')
            }
        
        if goal_amount <= current_savings:
            return {
                'months_to_goal': 0,
                'total_contributed': 0,
                'interest_earned': 0,
                'message': 'You have already reached your goal!'
            }
        
        monthly_rate = annual_interest_rate / 12
        amount = current_savings
        months = 0
        total_contributed = 0
        
        # Calculate month by month
        while amount < goal_amount and months < 600:  # Cap at 50 years
            amount = amount * (1 + monthly_rate) + monthly_contribution
            total_contributed += monthly_contribution
            months += 1
        
        interest_earned = amount - current_savings - total_contributed
        
        return {
            'months_to_goal': months,
            'years_to_goal': round(months / 12, 1),
            'final_amount': amount,
            'total_contributed': total_contributed,
            'interest_earned': interest_earned,
            'starting_amount': current_savings,
            'monthly_contribution': monthly_contribution
        }
    
    @staticmethod
    def calculate_loan_payoff(principal: float,
                             annual_interest_rate: float,
                             monthly_payment: float,
                             extra_payment: float = 0) -> Dict:
        """Calculate loan payoff timeline and total interest"""
        if monthly_payment <= 0:
            return {
                'error': 'Monthly payment must be greater than 0'
            }
        
        monthly_rate = annual_interest_rate / 12
        balance = principal
        months = 0
        total_interest = 0
        total_paid = 0
        
        payment_schedule = []
        
        while balance > 0 and months < 600:  # Cap at 50 years
            interest_payment = balance * monthly_rate
            total_payment = monthly_payment + extra_payment
            principal_payment = total_payment - interest_payment
            
            if principal_payment <= 0:
                return {
                    'error': 'Monthly payment is less than monthly interest. Loan cannot be paid off.',
                    'minimum_payment_needed': interest_payment + 1
                }
            
            if balance < total_payment:
                total_payment = balance + interest_payment
                principal_payment = balance
            
            balance -= principal_payment
            total_interest += interest_payment
            total_paid += total_payment
            months += 1
            
            # Store every 12 months for schedule
            if months % 12 == 0 or balance <= 0:
                payment_schedule.append({
                    'month': months,
                    'balance': max(0, balance),
                    'total_paid': total_paid,
                    'total_interest': total_interest
                })
        
        return {
            'months_to_payoff': months,
            'years_to_payoff': round(months / 12, 1),
            'total_paid': total_paid,
            'total_interest': total_interest,
            'monthly_payment': monthly_payment,
            'extra_payment': extra_payment,
            'total_monthly_payment': monthly_payment + extra_payment,
            'payment_schedule': payment_schedule
        }
    
    @staticmethod
    def calculate_retirement_savings(current_age: int,
                                    retirement_age: int,
                                    current_savings: float,
                                    monthly_contribution: float,
                                    annual_return: float = 0.07,
                                    employer_match: float = 0.0) -> Dict:
        """Calculate retirement savings projection"""
        years_to_retirement = retirement_age - current_age
        if years_to_retirement <= 0:
            return {
                'error': 'Retirement age must be greater than current age'
            }
        
        months = years_to_retirement * 12
        monthly_rate = annual_return / 12
        
        # Include employer match
        total_monthly = monthly_contribution * (1 + employer_match)
        
        # Future value of current savings
        fv_current = current_savings * ((1 + monthly_rate) ** months)
        
        # Future value of monthly contributions
        if monthly_rate > 0:
            fv_contributions = total_monthly * (((1 + monthly_rate) ** months - 1) / monthly_rate)
        else:
            fv_contributions = total_monthly * months
        
        total_at_retirement = fv_current + fv_contributions
        total_contributed = current_savings + (monthly_contribution * months)
        employer_contributed = monthly_contribution * employer_match * months
        investment_gains = total_at_retirement - total_contributed - employer_contributed
        
        # Calculate safe withdrawal (4% rule)
        annual_withdrawal = total_at_retirement * 0.04
        monthly_income = annual_withdrawal / 12
        
        return {
            'current_age': current_age,
            'retirement_age': retirement_age,
            'years_to_retirement': years_to_retirement,
            'total_at_retirement': total_at_retirement,
            'your_contributions': total_contributed,
            'employer_contributions': employer_contributed,
            'investment_gains': investment_gains,
            'estimated_monthly_income': monthly_income,
            'monthly_contribution': monthly_contribution,
            'employer_match_rate': employer_match * 100
        }
    
    @staticmethod
    def calculate_hsa_benefits(annual_contribution: float,
                              years: int = 30,
                              tax_rate: float = 0.22,
                              annual_return: float = 0.06) -> Dict:
        """Calculate HSA tax benefits and growth"""
        monthly_contribution = annual_contribution / 12
        monthly_rate = annual_return / 12
        months = years * 12
        
        # Tax savings per year
        annual_tax_savings = annual_contribution * tax_rate
        total_tax_savings = annual_tax_savings * years
        
        # Investment growth (tax-free)
        if monthly_rate > 0:
            future_value = monthly_contribution * (((1 + monthly_rate) ** months - 1) / monthly_rate)
        else:
            future_value = monthly_contribution * months
        
        total_contributed = annual_contribution * years
        investment_gains = future_value - total_contributed
        
        # Compare to taxable account
        taxable_gains = investment_gains * (1 - tax_rate * 0.15)  # Capital gains
        hsa_advantage = investment_gains - taxable_gains + total_tax_savings
        
        return {
            'annual_contribution': annual_contribution,
            'years': years,
            'total_contributed': total_contributed,
            'annual_tax_savings': annual_tax_savings,
            'total_tax_savings': total_tax_savings,
            'future_value': future_value,
            'investment_gains': investment_gains,
            'hsa_advantage_over_taxable': hsa_advantage,
            'tax_rate_used': tax_rate * 100
        }
    
    @staticmethod
    def debt_avalanche_vs_snowball(debts: List[Dict]) -> Dict:
        """
        Compare debt payoff strategies
        debts: List of {'name': str, 'balance': float, 'rate': float, 'minimum': float}
        """
        if not debts:
            return {'error': 'No debts provided'}
        
        # Avalanche: Highest interest rate first
        avalanche_debts = sorted(debts, key=lambda x: x['rate'], reverse=True)
        
        # Snowball: Smallest balance first
        snowball_debts = sorted(debts, key=lambda x: x['balance'])
        
        return {
            'avalanche_order': [{'name': d['name'], 'balance': d['balance'], 'rate': d['rate']} for d in avalanche_debts],
            'snowball_order': [{'name': d['name'], 'balance': d['balance'], 'rate': d['rate']} for d in snowball_debts],
            'recommendation': 'Avalanche method saves more on interest. Snowball method provides psychological wins.'
        }

