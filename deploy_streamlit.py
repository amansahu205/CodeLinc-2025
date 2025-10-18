"""
Streamlit deployment configuration and utilities
"""
import streamlit as st
import os

def setup_streamlit_config():
    """Configure Streamlit for production deployment"""
    
    # Set page config for insurance theme
    st.set_page_config(
        page_title="Insurance Benefits Advisor",
        page_icon="🏥",
        layout="wide",
        initial_sidebar_state="expanded",
        menu_items={
            'Get Help': 'mailto:support@yourcompany.com',
            'Report a bug': 'mailto:support@yourcompany.com',
            'About': """
            # Insurance Benefits & Financial Wellness Advisor
            
            This AI-powered assistant helps employees navigate their benefits 
            and make informed financial decisions.
            
            **Features:**
            - Benefits selection guidance
            - Financial wellness education  
            - Personalized recommendations
            - Document-based answers
            
            Built with LangChain and Streamlit.
            """
        }
    )

def add_custom_css():
    """Add custom CSS for insurance branding"""
    st.markdown("""
    <style>
    .main-header {
        background: linear-gradient(90deg, #1f4e79 0%, #2d5aa0 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .benefits-card {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #1f4e79;
        margin: 1rem 0;
    }
    
    .stButton > button {
        background-color: #1f4e79;
        color: white;
        border-radius: 5px;
        border: none;
        padding: 0.5rem 1rem;
    }
    
    .stButton > button:hover {
        background-color: #2d5aa0;
    }
    
    .chat-message {
        padding: 1rem;
        border-radius: 10px;
        margin: 0.5rem 0;
    }
    
    .user-message {
        background-color: #e3f2fd;
        border-left: 4px solid #2196f3;
    }
    
    .assistant-message {
        background-color: #f3e5f5;
        border-left: 4px solid #9c27b0;
    }
    </style>
    """, unsafe_allow_html=True)

def check_deployment_requirements():
    """Check if all requirements are met for deployment"""
    requirements = {
        "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
        "GOOGLE_API_KEY": os.getenv("GOOGLE_API_KEY")
    }
    
    missing = [key for key, value in requirements.items() if not value]
    
    if missing:
        st.error(f"⚠️ Missing environment variables: {', '.join(missing)}")
        st.info("💡 Add these to your Streamlit secrets or environment variables for deployment")
        return False
    
    return True

def display_deployment_info():
    """Display deployment information"""
    with st.expander("🚀 Deployment Information"):
        st.markdown("""
        ### Streamlit Cloud Deployment
        
        1. **Push to GitHub**: Ensure all files are in your repository
        2. **Add Secrets**: In Streamlit Cloud, add your API keys as secrets:
           - `OPENAI_API_KEY` = your_openai_key
           - `GOOGLE_API_KEY` = your_google_key
        3. **Deploy**: Connect your GitHub repo to Streamlit Cloud
        
        ### Required Files for Deployment:
        - `streamlit_app.py` (main app)
        - `rag_chatbot.py` (core logic)
        - `insurance_prompts.py` (domain prompts)
        - `requirements.txt` (dependencies)
        
        ### Environment Variables:
        ```
        OPENAI_API_KEY=sk-...
        GOOGLE_API_KEY=AI...
        ```
        """)

def add_footer():
    """Add footer with company information"""
    st.markdown("---")
    st.markdown("""
    <div style='text-align: center; color: #666; padding: 1rem;'>
        <p>🏥 Insurance Benefits & Financial Wellness Advisor</p>
        <p>Powered by AI • Built for Employee Success</p>
        <p><small>For technical support, contact your IT department</small></p>
    </div>
    """, unsafe_allow_html=True)