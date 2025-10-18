import streamlit as st
import tempfile
import os
from pathlib import Path
from dotenv import load_dotenv
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime

from rag_chatbot import InsuranceRAGChatbot
from deploy_streamlit import setup_streamlit_config, add_custom_css, add_footer
from user_profile import UserProfile
from financial_calculators import FinancialCalculators
from recommendation_engine import RecommendationEngine

# Load environment variables
load_dotenv()

# Setup Streamlit configuration
setup_streamlit_config()
add_custom_css()

def initialize_session_state():
    """Initialize session state variables"""
    if "chatbot" not in st.session_state:
        st.session_state.chatbot = None
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "documents_loaded" not in st.session_state:
        st.session_state.documents_loaded = False
    if "user_profile" not in st.session_state:
        st.session_state.user_profile = UserProfile()
    if "recommendations" not in st.session_state:
        st.session_state.recommendations = None

def save_uploaded_file(uploaded_file):
    """Save uploaded file to temporary directory"""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{uploaded_file.name.split('.')[-1]}") as tmp_file:
            tmp_file.write(uploaded_file.getvalue())
            return tmp_file.name
    except Exception as e:
        st.error(f"Error saving file: {str(e)}")
        return None

def render_sidebar():
    """Render sidebar with configuration"""
    with st.sidebar:
        st.header("⚙️ Configuration")
        
        # Show API status for both providers
        with st.expander("📊 API Status", expanded=False):
            openai_key = os.getenv("OPENAI_API_KEY")
            google_key = os.getenv("GOOGLE_API_KEY")
            
            if openai_key:
                st.success("✓ OpenAI configured")
            else:
                st.error("✗ OpenAI not configured")
            
            if google_key:
                st.success("✓ Google configured")
            else:
                st.error("✗ Google not configured")
        
        # LLM Provider selection
        llm_provider = st.selectbox(
            "AI Model Provider",
            ["openai", "google"],
            help="Choose your AI model for benefits guidance"
        )
        
        # Check if selected provider's API key is configured
        if llm_provider == "openai":
            api_key = os.getenv("OPENAI_API_KEY")
            if api_key:
                st.info("🤖 Using OpenAI GPT-3.5-turbo")
            else:
                st.error("⚠️ OpenAI API key not found")
        else:
            api_key = os.getenv("GOOGLE_API_KEY")
            if api_key:
                st.info("🤖 Using Google Gemini Pro")
            else:
                st.error("⚠️ Google API key not found")
        
        st.divider()
        
        # File upload section
        st.header("📋 Upload Documents")
        uploaded_files = st.file_uploader(
            "Benefits Documents",
            accept_multiple_files=True,
            type=['pdf', 'txt', 'csv'],
            help="Upload benefits guides, policies, or financial documents"
        )
        
        # Process documents button
        if st.button("Process Documents", disabled=not uploaded_files or not api_key):
            if not api_key:
                st.error("⚠️ API key not configured!")
            else:
                with st.spinner("Processing documents..."):
                    try:
                        st.session_state.chatbot = InsuranceRAGChatbot(llm_provider=llm_provider)
                        
                        file_paths = []
                        for uploaded_file in uploaded_files:
                            file_path = save_uploaded_file(uploaded_file)
                            if file_path:
                                file_paths.append(file_path)
                        
                        if file_paths:
                            documents = st.session_state.chatbot.load_documents(file_paths)
                            
                            if documents:
                                st.session_state.chatbot.create_vectorstore(documents)
                                st.session_state.chatbot.setup_conversation_chain()
                                st.session_state.documents_loaded = True
                                st.success(f"✅ Processed {len(documents)} documents!")
                            else:
                                st.error("No documents could be loaded.")
                        
                        # Clean up temp files
                        for file_path in file_paths:
                            try:
                                os.unlink(file_path)
                            except:
                                pass
                                
                    except Exception as e:
                        error_msg = str(e)
                        if "quota" in error_msg.lower() or "429" in error_msg:
                            st.error("⚠️ **API Quota Exceeded**")
                            st.warning(f"Try switching to {'OpenAI' if llm_provider == 'google' else 'Google'}")
                        else:
                            st.error(f"❌ Error: {error_msg}")
        
        return llm_provider

def render_dashboard():
    """Render personalized dashboard"""
    st.header("🎯 Your Personalized Dashboard")
    
    profile = st.session_state.user_profile
    
    if not profile.profile_completed:
        st.warning("👋 Complete your profile to get personalized recommendations!")
        if st.button("📝 Go to Profile Setup →", key="dashboard_to_profile"):
            st.session_state.active_tab = "Profile"
            st.rerun()
        return
    
    # Financial Health Score
    health_score = profile.calculate_financial_health_score()
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Financial Health Score", f"{health_score}/100",
                 delta="Good" if health_score >= 70 else "Needs Improvement")
    
    with col2:
        st.metric("Emergency Fund", f"{profile.emergency_fund_months:.1f} months",
                 delta="✓" if profile.emergency_fund_months >= 3 else "Build more")
    
    with col3:
        total_debt = profile.student_loan_debt + profile.credit_card_debt + profile.other_debt
        st.metric("Total Debt", f"${total_debt:,.0f}")
    
    st.divider()
    
    # Generate recommendations if not already done
    if st.session_state.recommendations is None:
        with st.spinner("Generating personalized recommendations..."):
            engine = RecommendationEngine(st.session_state.chatbot)
            st.session_state.recommendations = engine.generate_benefit_recommendations(profile)
    
    recommendations = st.session_state.recommendations
    
    # Display recommendations
    st.subheader("🎯 Your Personalized Recommendations")
    
    # Health Plan
    st.markdown("### 🏥 Health Insurance")
    health_rec = recommendations['health_plan']
    st.success(f"**Recommended:** {health_rec['recommended_plan']} (Confidence: {health_rec['confidence']})")
    
    st.markdown("**Why this plan:**")
    for reason in health_rec['reasons']:
        st.markdown(f"- {reason}")
    
    # Savings Accounts
    st.markdown("### 💰 Savings Accounts")
    savings_recs = recommendations['savings_accounts']['recommended_accounts']
    if savings_recs:
        for account in savings_recs:
            with st.expander(f"**{account['type']}** - Priority: {account['priority']}"):
                st.write(f"Recommended contribution: ${account.get('contribution', 0):,.0f}/year")
                for reason in account['reasons']:
                    st.markdown(f"- {reason}")
    else:
        st.info("No savings account recommendations at this time")
    
    # Retirement
    st.markdown("### 🏖️ Retirement Planning")
    ret_recs = recommendations['retirement']
    st.info(f"Monthly target: ${ret_recs['total_monthly_target']:,.0f} ({ret_recs['total_monthly_target']/profile.annual_income*1200:.1f}% of income)")
    
    for account in ret_recs['recommended_accounts']:
        with st.expander(f"**{account['account']}** - Priority: {account['priority']}"):
            for reason in account['reasons']:
                st.markdown(f"- {reason}")
    
    # Priority Actions
    st.divider()
    st.subheader("🎯 Top Priority Actions")
    priorities = profile.get_priority_recommendations()
    
    if priorities:
        for i, priority in enumerate(priorities[:3], 1):
            col1, col2 = st.columns([3, 1])
            with col1:
                st.markdown(f"**{i}. {priority['area']}** ({priority['priority']} Priority)")
                st.caption(priority['message'])
                st.caption(f"💡 {priority['action']}")
            with col2:
                if st.button("Learn More", key=f"priority_{i}"):
                    st.info("Navigate to calculators or chat to explore this topic!")
    else:
        st.success("🎉 Great job! No urgent financial priorities right now.")
    
    # AI-powered recommendations (if documents loaded)
    if st.session_state.documents_loaded:
        st.divider()
        st.subheader("🤖 AI-Powered Benefit Analysis")
        
        if st.button("Get Personalized Benefit Recommendations from Documents"):
            with st.spinner("Analyzing your profile against benefit documents..."):
                engine = RecommendationEngine(st.session_state.chatbot)
                ai_recs = engine.generate_ai_recommendations(profile)
                st.markdown(ai_recs)

def render_profile():
    """Render profile setup form"""
    st.header("👤 Your Profile")
    
    profile = st.session_state.user_profile
    
    with st.form("profile_form"):
        st.subheader("Personal Information")
        col1, col2 = st.columns(2)
        
        with col1:
            name = st.text_input("Name", value=profile.name)
            age = st.number_input("Age", min_value=18, max_value=100, value=profile.age)
            marital_status = st.selectbox("Marital Status", 
                                         ["Single", "Married", "Partnered", "Divorced", "Widowed"],
                                         index=["Single", "Married", "Partnered", "Divorced", "Widowed"].index(profile.marital_status))
        
        with col2:
            email = st.text_input("Email", value=profile.email)
            dependents = st.number_input("Number of Dependents", min_value=0, max_value=10, value=profile.dependents)
            has_children = st.checkbox("Do you have children?", value=profile.has_children)
        
        st.divider()
        st.subheader("Employment & Finances")
        
        col1, col2 = st.columns(2)
        
        with col1:
            annual_income = st.number_input("Annual Income ($)", min_value=0, value=int(profile.annual_income), step=5000)
            monthly_expenses = st.number_input("Monthly Expenses ($)", min_value=0, value=int(profile.monthly_expenses), step=100)
            current_savings = st.number_input("Current Savings ($)", min_value=0, value=int(profile.current_savings), step=1000)
        
        with col2:
            years_experience = st.number_input("Years of Work Experience", min_value=0, max_value=50, value=profile.years_of_experience)
            student_loan_debt = st.number_input("Student Loan Debt ($)", min_value=0, value=int(profile.student_loan_debt), step=1000)
            credit_card_debt = st.number_input("Credit Card Debt ($)", min_value=0, value=int(profile.credit_card_debt), step=500)
        
        st.divider()
        st.subheader("Health Information")
        
        col1, col2 = st.columns(2)
        
        with col1:
            health_status = st.selectbox("Overall Health", 
                                        ["Excellent", "Good", "Fair", "Poor"],
                                        index=["Excellent", "Good", "Fair", "Poor"].index(profile.health_status))
            regular_medications = st.checkbox("Do you take regular medications?", value=profile.regular_medications)
        
        with col2:
            expected_visits = st.selectbox("Expected Medical Visits per Year",
                                          ["Rarely (0-1 per year)", "1-3 per year", "4-6 per year", "7+ per year"],
                                          index=["Rarely (0-1 per year)", "1-3 per year", "4-6 per year", "7+ per year"].index(profile.expected_medical_visits))
        
        st.divider()
        st.subheader("Financial Goals & Preferences")
        
        col1, col2 = st.columns(2)
        
        with col1:
            primary_goal = st.selectbox("Primary Financial Goal",
                                       ["Build emergency fund", "Pay off debt", "Save for retirement", 
                                        "Buy a home", "Start investing", "Other"],
                                       index=["Build emergency fund", "Pay off debt", "Save for retirement", 
                                              "Buy a home", "Start investing", "Other"].index(profile.primary_financial_goal))
            risk_tolerance = st.selectbox("Risk Tolerance",
                                         ["Conservative", "Moderate", "Aggressive"],
                                         index=["Conservative", "Moderate", "Aggressive"].index(profile.risk_tolerance))
        
        with col2:
            retirement_contribution = st.number_input("Current Monthly Retirement Contribution ($)", 
                                                     min_value=0, value=int(profile.retirement_contribution), step=50)
            interested_in_hsa = st.checkbox("Interested in HSA?", value=profile.interested_in_hsa)
        
        st.divider()
        st.subheader("Benefit Preferences")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            prefers_low_premium = st.checkbox("Prefer lower premiums", value=profile.prefers_low_premium)
        with col2:
            prefers_low_deductible = st.checkbox("Prefer lower deductibles", value=profile.prefers_low_deductible)
        with col3:
            values_flexibility = st.checkbox("Value plan flexibility", value=profile.values_flexibility)
        
        submitted = st.form_submit_button("💾 Save Profile & Generate Recommendations", use_container_width=True)
        
        if submitted:
            # Update profile
            profile.name = name
            profile.age = age
            profile.email = email
            profile.annual_income = float(annual_income)
            profile.employment_status = "Full-time"
            profile.years_of_experience = years_experience
            profile.marital_status = marital_status
            profile.dependents = dependents
            profile.has_children = has_children
            profile.health_status = health_status
            profile.regular_medications = regular_medications
            profile.expected_medical_visits = expected_visits
            profile.monthly_expenses = float(monthly_expenses)
            profile.current_savings = float(current_savings)
            profile.emergency_fund_months = current_savings / monthly_expenses if monthly_expenses > 0 else 0
            profile.student_loan_debt = float(student_loan_debt)
            profile.credit_card_debt = float(credit_card_debt)
            profile.primary_financial_goal = primary_goal
            profile.retirement_contribution = float(retirement_contribution)
            profile.interested_in_hsa = interested_in_hsa
            profile.risk_tolerance = risk_tolerance
            profile.prefers_low_premium = prefers_low_premium
            profile.prefers_low_deductible = prefers_low_deductible
            profile.values_flexibility = values_flexibility
            profile.profile_completed = True
            profile.updated_at = datetime.now()
            
            st.session_state.user_profile = profile
            st.session_state.recommendations = None  # Reset recommendations
            
            st.success("✅ Profile saved successfully!")
            st.balloons()
            
            # Redirect to dashboard
            st.info("🎯 View your personalized dashboard to see recommendations!")
            if st.button("Go to Dashboard →"):
                st.rerun()

def render_calculators():
    """Render financial calculators"""
    st.header("🧮 Financial Wellness Calculators")
    
    calc = FinancialCalculators()
    
    calculator_type = st.selectbox(
        "Choose a Calculator",
        ["Budget Planner (50/30/20)", "Emergency Fund Goal", "Savings Timeline", 
         "Loan Payoff", "Retirement Savings", "HSA Benefits", "Debt Strategy"]
    )
    
    st.divider()
    
    if calculator_type == "Budget Planner (50/30/20)":
        st.subheader("💵 Budget Planner")
        st.caption("Based on the 50/30/20 rule: 50% Needs, 30% Wants, 20% Savings")
        
        monthly_income = st.number_input("Monthly Income ($)", min_value=0, value=4000, step=100)
        
        st.markdown("### Track Your Expenses")
        housing = st.number_input("Housing/Rent ($)", min_value=0, value=1200, step=50)
        utilities = st.number_input("Utilities ($)", min_value=0, value=150, step=10)
        groceries = st.number_input("Groceries ($)", min_value=0, value=400, step=50)
        transportation = st.number_input("Transportation ($)", min_value=0, value=200, step=50)
        insurance = st.number_input("Insurance ($)", min_value=0, value=200, step=50)
        entertainment = st.number_input("Entertainment ($)", min_value=0, value=300, step=50)
        other = st.number_input("Other Expenses ($)", min_value=0, value=250, step=50)
        
        expenses = {
            'Housing': housing,
            'Utilities': utilities,
            'Groceries': groceries,
            'Transportation': transportation,
            'Insurance': insurance,
            'Entertainment': entertainment,
            'Other': other
        }
        
        if st.button("Calculate Budget"):
            result = calc.calculate_budget_breakdown(monthly_income, expenses)
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown("### 📊 Recommended Allocation")
                fig = go.Figure(data=[go.Pie(labels=['Needs (50%)', 'Wants (30%)', 'Savings (20%)'],
                                            values=[result['recommended']['needs'], 
                                                   result['recommended']['wants'],
                                                   result['recommended']['savings']])])
                st.plotly_chart(fig, use_container_width=True)
                
                st.metric("Recommended Needs", f"${result['recommended']['needs']:,.0f}")
                st.metric("Recommended Wants", f"${result['recommended']['wants']:,.0f}")
                st.metric("Recommended Savings", f"${result['recommended']['savings']:,.0f}")
            
            with col2:
                st.markdown("### 💰 Your Current Spending")
                st.metric("Total Expenses", f"${result['actual']['total_expenses']:,.0f}")
                st.metric("Remaining", f"${result['actual']['remaining']:,.0f}",
                         delta="Good" if result['actual']['remaining'] > 0 else "Over budget")
                st.metric("Savings Rate", f"{result['savings_rate']:.1f}%")
                
                if result['savings_rate'] >= 20:
                    st.success("✅ Great job! You're meeting the 20% savings goal!")
                elif result['savings_rate'] >= 10:
                    st.warning("⚠️ Consider increasing savings to 20%")
                else:
                    st.error("❌ Try to save at least 10-20% of income")
    
    elif calculator_type == "Emergency Fund Goal":
        st.subheader("🏦 Emergency Fund Goal")
        monthly_expenses = st.number_input("Monthly Expenses ($)", min_value=0, value=2500, step=100)
        target_months = st.slider("Target Months of Expenses", min_value=1, max_value=12, value=6)
        
        if st.button("Calculate Goal"):
            result = calc.calculate_emergency_fund_goal(monthly_expenses, target_months)
            
            st.success(f"### Target: ${result['target_amount']:,.2f}")
            st.info(result['recommendation'])
            
            # Progress tracker if profile exists
            if st.session_state.user_profile.profile_completed:
                current = st.session_state.user_profile.current_savings
                progress = min(100, (current / result['target_amount']) * 100)
                st.progress(progress / 100)
                st.caption(f"Current: ${current:,.2f} ({progress:.0f}% of goal)")
    
    elif calculator_type == "Savings Timeline":
        st.subheader("📈 Savings Timeline Calculator")
        
        col1, col2 = st.columns(2)
        with col1:
            current_savings = st.number_input("Current Savings ($)", min_value=0, value=5000, step=1000)
            goal_amount = st.number_input("Goal Amount ($)", min_value=0, value=20000, step=1000)
        with col2:
            monthly_contribution = st.number_input("Monthly Contribution ($)", min_value=0, value=500, step=50)
            annual_return = st.slider("Expected Annual Return (%)", min_value=0.0, max_value=15.0, value=4.0, step=0.5)
        
        if st.button("Calculate Timeline"):
            result = calc.calculate_savings_timeline(current_savings, goal_amount, monthly_contribution, annual_return/100)
            
            if 'error' in result:
                st.error(result['error'])
            else:
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Time to Goal", f"{result['years_to_goal']} years")
                with col2:
                    st.metric("Total Contributed", f"${result['total_contributed']:,.0f}")
                with col3:
                    st.metric("Interest Earned", f"${result['interest_earned']:,.0f}")
                
                st.success(f"You'll reach ${goal_amount:,.0f} in {result['months_to_goal']} months!")
    
    elif calculator_type == "Loan Payoff":
        st.subheader("💳 Loan Payoff Calculator")
        
        col1, col2 = st.columns(2)
        with col1:
            principal = st.number_input("Loan Balance ($)", min_value=0, value=10000, step=1000)
            annual_rate = st.slider("Annual Interest Rate (%)", min_value=0.0, max_value=30.0, value=6.0, step=0.5)
        with col2:
            monthly_payment = st.number_input("Monthly Payment ($)", min_value=0, value=200, step=50)
            extra_payment = st.number_input("Extra Monthly Payment ($)", min_value=0, value=0, step=25)
        
        if st.button("Calculate Payoff"):
            result = calc.calculate_loan_payoff(principal, annual_rate/100, monthly_payment, extra_payment)
            
            if 'error' in result:
                st.error(result['error'])
            else:
                col1, col2 = st.columns(2)
                with col1:
                    st.metric("Payoff Time", f"{result['years_to_payoff']} years")
                    st.metric("Total Paid", f"${result['total_paid']:,.0f}")
                    st.metric("Total Interest", f"${result['total_interest']:,.0f}")
                with col2:
                    savings = result['total_interest']
                    st.success(f"🎯 Pay off in {result['months_to_payoff']} months")
                    if extra_payment > 0:
                        st.info(f"Extra ${extra_payment}/month saves time and interest!")
    
    elif calculator_type == "Retirement Savings":
        st.subheader("🏖️ Retirement Savings Projection")
        
        col1, col2 = st.columns(2)
        with col1:
            current_age = st.number_input("Current Age", min_value=18, max_value=100, value=25)
            retirement_age = st.number_input("Retirement Age", min_value=18, max_value=100, value=65)
            current_savings = st.number_input("Current Retirement Savings ($)", min_value=0, value=10000, step=5000)
        with col2:
            monthly_contribution = st.number_input("Monthly Contribution ($)", min_value=0, value=500, step=50)
            employer_match = st.slider("Employer Match (%)", min_value=0, max_value=100, value=50, step=5)
            annual_return = st.slider("Expected Annual Return (%)", min_value=0.0, max_value=15.0, value=7.0, step=0.5)
        
        if st.button("Project Retirement"):
            result = calc.calculate_retirement_savings(
                current_age, retirement_age, current_savings, monthly_contribution,
                annual_return/100, employer_match/100
            )
            
            if 'error' in result:
                st.error(result['error'])
            else:
                st.success(f"### Projected Retirement Balance: ${result['total_at_retirement']:,.0f}")
                
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Your Contributions", f"${result['your_contributions']:,.0f}")
                with col2:
                    st.metric("Employer Match", f"${result['employer_contributions']:,.0f}")
                with col3:
                    st.metric("Investment Gains", f"${result['investment_gains']:,.0f}")
                
                st.info(f"💰 Estimated monthly income in retirement: ${result['estimated_monthly_income']:,.0f} (4% rule)")
    
    elif calculator_type == "HSA Benefits":
        st.subheader("💊 HSA Tax Benefits Calculator")
        
        col1, col2 = st.columns(2)
        with col1:
            annual_contribution = st.number_input("Annual HSA Contribution ($)", min_value=0, value=3000, step=500)
            years = st.slider("Investment Timeline (years)", min_value=1, max_value=40, value=30)
        with col2:
            tax_rate = st.slider("Your Tax Rate (%)", min_value=0, max_value=50, value=22)
            annual_return = st.slider("Expected Return (%)", min_value=0.0, max_value=15.0, value=6.0, step=0.5)
        
        if st.button("Calculate HSA Benefits"):
            result = calc.calculate_hsa_benefits(annual_contribution, years, tax_rate/100, annual_return/100)
            
            st.success(f"### Future HSA Value: ${result['future_value']:,.0f}")
            
            col1, col2 = st.columns(2)
            with col1:
                st.metric("Total Contributed", f"${result['total_contributed']:,.0f}")
                st.metric("Investment Gains", f"${result['investment_gains']:,.0f}")
            with col2:
                st.metric("Tax Savings", f"${result['total_tax_savings']:,.0f}")
                st.metric("HSA Advantage", f"${result['hsa_advantage_over_taxable']:,.0f}")
            
            st.info("✨ HSA offers triple tax advantage: tax-deductible, tax-free growth, tax-free withdrawals for medical!")
    
    elif calculator_type == "Debt Strategy":
        st.subheader("📉 Debt Payoff Strategy")
        
        st.markdown("Compare **Avalanche** (highest rate first) vs **Snowball** (smallest balance first)")
        
        num_debts = st.number_input("Number of Debts", min_value=1, max_value=10, value=3)
        
        debts = []
        for i in range(num_debts):
            st.markdown(f"### Debt #{i+1}")
            col1, col2, col3 = st.columns(3)
            with col1:
                name = st.text_input(f"Debt Name", value=f"Debt {i+1}", key=f"debt_name_{i}")
            with col2:
                balance = st.number_input(f"Balance ($)", min_value=0, value=5000, step=500, key=f"debt_balance_{i}")
            with col3:
                rate = st.number_input(f"Interest Rate (%)", min_value=0.0, max_value=30.0, value=10.0, step=0.5, key=f"debt_rate_{i}")
            
            debts.append({'name': name, 'balance': balance, 'rate': rate, 'minimum': 100})
        
        if st.button("Compare Strategies"):
            result = calc.debt_avalanche_vs_snowball(debts)
            
            col1, col2 = st.columns(2)
            with col1:
                st.markdown("### 🔥 Avalanche Method")
                st.caption("Pay highest interest rate first")
                for i, debt in enumerate(result['avalanche_order'], 1):
                    st.write(f"{i}. {debt['name']} - ${debt['balance']:,.0f} @ {debt['rate']}%")
                st.success("Saves most money on interest")
            
            with col2:
                st.markdown("### ⛄ Snowball Method")
                st.caption("Pay smallest balance first")
                for i, debt in enumerate(result['snowball_order'], 1):
                    st.write(f"{i}. {debt['name']} - ${debt['balance']:,.0f} @ {debt['rate']}%")
                st.info("Provides psychological wins faster")
            
            st.markdown("---")
            st.markdown(f"**Recommendation:** {result['recommendation']}")

def render_chat():
    """Render chat interface"""
    st.header("💬 Benefits & Financial Chat")
    
    if not st.session_state.documents_loaded:
        st.warning("📋 Please upload and process benefit documents first!")
        st.info("Upload documents in the sidebar to enable AI-powered Q&A about your specific benefit plans.")
        
        st.markdown("### 💡 Example Questions:")
        st.markdown("""
        - "What's the difference between PPO and HMO plans?"
        - "How much should I contribute to my 401(k)?"
        - "What FSA expenses are eligible?"
        - "Should I choose an HSA-eligible plan?"
        """)
        return
    
    st.caption("Ask questions about your benefits or get financial advice")
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Ask about benefits or financial wellness..."):
        # Add user profile context if available
        if st.session_state.user_profile.profile_completed:
            profile_context = f"\n\nMy Profile: {st.session_state.user_profile.get_profile_summary()}"
            full_prompt = prompt + profile_context
        else:
            full_prompt = prompt
        
        # Add user message
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Get bot response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                try:
                    response = st.session_state.chatbot.chat(full_prompt)
                    answer = response["answer"]
                    source_docs = response.get("source_documents", [])
                    
                    st.markdown(answer)
                    
                    # Show sources if available
                    if source_docs:
                        with st.expander(f"📋 Sources ({len(source_docs)} documents)"):
                            for i, doc in enumerate(source_docs, 1):
                                st.markdown(f"**Source {i}:**")
                                content = doc.page_content[:300] + "..." if len(doc.page_content) > 300 else doc.page_content
                                st.markdown(content)
                                st.divider()
                    
                    st.session_state.messages.append({"role": "assistant", "content": answer})
                    
                except Exception as e:
                    error_msg = f"Error: {str(e)}"
                    st.error(error_msg)
                    st.session_state.messages.append({"role": "assistant", "content": error_msg})

def main():
    """Main application"""
    initialize_session_state()
    
    # Header
    st.markdown('<div class="main-header"><h1>🏥 AI Benefits & Financial Wellness Advisor</h1><p>Smart benefits selection and financial coaching for early-career employees</p></div>', unsafe_allow_html=True)
    
    # Render sidebar
    llm_provider = render_sidebar()
    
    # Main tabs
    tab1, tab2, tab3, tab4 = st.tabs(["🎯 Dashboard", "👤 My Profile", "🧮 Calculators", "💬 Chat"])
    
    with tab1:
        render_dashboard()
    
    with tab2:
        render_profile()
    
    with tab3:
        render_calculators()
    
    with tab4:
        render_chat()
    
    # Footer
    add_footer()

if __name__ == "__main__":
    main()

