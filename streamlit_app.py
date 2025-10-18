import streamlit as st
import tempfile
import os
from pathlib import Path
from dotenv import load_dotenv
from rag_chatbot import InsuranceRAGChatbot
from deploy_streamlit import setup_streamlit_config, add_custom_css, add_footer
from insurance_prompts import SAMPLE_QUESTIONS

# Load environment variables from .env file
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

def save_uploaded_file(uploaded_file):
    """Save uploaded file to temporary directory"""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{uploaded_file.name.split('.')[-1]}") as tmp_file:
            tmp_file.write(uploaded_file.getvalue())
            return tmp_file.name
    except Exception as e:
        st.error(f"Error saving file: {str(e)}")
        return None

def main():
    initialize_session_state()
    
    # Add custom styling
    st.markdown('<div class="main-header"><h1>🏥 Insurance Benefits & Financial Wellness Advisor</h1><p>AI-powered assistant for employee benefits and financial guidance</p></div>', unsafe_allow_html=True)
    
    # Insurance-specific info banner
    st.info("💡 **Get personalized help with:** Health insurance, dental & vision plans, retirement benefits, FSA/HSA accounts, financial planning, and wellness programs")
    
    # Sidebar for configuration
    with st.sidebar:
        st.header("Configuration")
        
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
            
            if not openai_key and not google_key:
                st.warning("⚠️ No API keys found! Please configure at least one in your .env file")
        
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
                st.caption("Set OPENAI_API_KEY in .env file")
        else:
            api_key = os.getenv("GOOGLE_API_KEY")
            if api_key:
                st.info("🤖 Using Google Gemini Pro")
            else:
                st.error("⚠️ Google API key not found")
                st.caption("Set GOOGLE_API_KEY in .env file")
        
        st.divider()
        
        # File upload
        st.header("📋 Upload Benefits Documents")
        st.caption("Upload your company's benefits guides, insurance policies, or financial wellness materials")
        uploaded_files = st.file_uploader(
            "Benefits Documents",
            accept_multiple_files=True,
            type=['pdf', 'txt', 'csv'],
            help="Upload benefits guides, insurance policies, SPDs, financial wellness documents"
        )
        
                        # Process documents button
        if st.button("Process Documents", disabled=not uploaded_files or not api_key):
            if not api_key:
                st.error("⚠️ API key not configured! Please set it in your .env file.")
            else:
                with st.spinner("Processing documents..."):
                    try:
                        # Initialize insurance chatbot
                        st.session_state.chatbot = InsuranceRAGChatbot(llm_provider=llm_provider)
                        
                        # Save uploaded files
                        file_paths = []
                        for uploaded_file in uploaded_files:
                            file_path = save_uploaded_file(uploaded_file)
                            if file_path:
                                file_paths.append(file_path)
                        
                        if file_paths:
                            # Load and process documents
                            documents = st.session_state.chatbot.load_documents(file_paths)
                            
                            if documents:
                                st.session_state.chatbot.create_vectorstore(documents)
                                st.session_state.chatbot.setup_conversation_chain()
                                st.session_state.documents_loaded = True
                                st.success(f"✅ Successfully processed {len(documents)} document chunks!")
                            else:
                                st.error("No documents could be loaded.")
                        else:
                            st.error("Failed to save uploaded files.")
                            
                        # Clean up temporary files
                        for file_path in file_paths:
                            try:
                                os.unlink(file_path)
                            except:
                                pass
                                
                    except Exception as e:
                        error_msg = str(e)
                        
                        # Provide helpful error messages based on error type
                        if "quota" in error_msg.lower() or "429" in error_msg:
                            st.error("⚠️ **API Quota Exceeded**")
                            st.warning(f"""
                            You've exceeded your {llm_provider.upper()} API quota limits.
                            
                            **Quick Fix:**
                            - Try switching to **{"OpenAI" if llm_provider == "google" else "Google"}** in the provider dropdown above
                            - Wait for your quota to reset (usually 24 hours)
                            - Upgrade your API plan for higher limits
                            
                            **Error Details:** {error_msg[:200]}...
                            """)
                        elif "api key" in error_msg.lower() or "unauthorized" in error_msg.lower():
                            st.error("⚠️ **Invalid API Key**")
                            st.info(f"Please check your {llm_provider.upper()}_API_KEY in the .env file")
                        else:
                            st.error(f"❌ Error processing documents: {error_msg}")
        
        # Reset conversation button
        if st.session_state.documents_loaded:
            if st.button("Reset Conversation"):
                st.session_state.chatbot.reset_conversation()
                st.session_state.messages = []
                st.success("Conversation reset!")
    
    # Main chat interface
    if st.session_state.documents_loaded:
        st.header("💬 Benefits & Financial Wellness Chat")
        st.caption("Ask questions about your benefits, insurance options, or financial planning")
        
        # Display chat messages
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
        
        # Chat input
        if prompt := st.chat_input("Ask about benefits, insurance, or financial wellness..."):
            # Add user message to chat history
            st.session_state.messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)
            
            # Get bot response
            with st.chat_message("assistant"):
                with st.spinner("Thinking..."):
                    try:
                        response = st.session_state.chatbot.chat(prompt)
                        answer = response["answer"]
                        source_docs = response.get("source_documents", [])
                        
                        st.markdown(answer)
                        
                        # Show sources if available
                        if source_docs:
                            with st.expander(f"📋 Reference Documents ({len(source_docs)} sources)"):
                                for i, doc in enumerate(source_docs, 1):
                                    st.markdown(f"**📄 Source {i}:**")
                                    st.markdown(doc.page_content[:300] + "..." if len(doc.page_content) > 300 else doc.page_content)
                                    if hasattr(doc, 'metadata') and doc.metadata:
                                        st.caption(f"📋 Document: {doc.metadata}")
                                    st.divider()
                        
                        # Add assistant response to chat history
                        st.session_state.messages.append({"role": "assistant", "content": answer})
                        
                    except Exception as e:
                        error_msg = f"Error: {str(e)}"
                        st.error(error_msg)
                        st.session_state.messages.append({"role": "assistant", "content": error_msg})
    
    else:
        
        # Insurance-specific features and examples
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("""
            ### 🏥 Benefits Selection Assistance
            - **Health Insurance**: Compare plans, deductibles, networks
            - **Dental & Vision**: Coverage options and costs
            - **Group Benefits**: Life insurance, disability, FSA/HSA
            - **Retirement Plans**: 401(k), matching, vesting schedules
            """)
        
        with col2:
            st.markdown("""
            ### 💰 Financial Wellness Education
            - **Budgeting Basics**: Emergency funds, expense tracking
            - **Debt Management**: Strategies and prioritization
            - **Long-term Planning**: Retirement, investments, goals
            - **Benefits Optimization**: Maximize your total compensation
            """)
        
        st.markdown("""
        ### 📋 How to Get Started:
        1. **Configure API Key**: Set your OpenAI or Google API key in the `.env` file
        2. **Select Provider**: Choose your AI model provider in the sidebar
        3. **Upload Benefits Documents**: Add your company's benefits guides, SPDs, or policies
        4. **Process Documents**: Click "Process Documents" to create your knowledge base
        5. **Ask Questions**: Get personalized benefits and financial guidance!
        
        ### 💡 Example Questions:
        - "What's the difference between the PPO and HMO health plans?"
        - "How much should I contribute to my 401(k)?"
        - "What FSA expenses are eligible for reimbursement?"
        - "How do I choose between dental plan options?"
        - "What's the company match on retirement contributions?"
        
        ### 📁 Supported Document Types:
        - **Benefits Guides**: Company benefits summaries
        - **SPDs**: Summary Plan Descriptions  
        - **Insurance Policies**: Health, dental, vision, life insurance
        - **Financial Wellness**: Budgeting guides, retirement planning
        - **HR Documents**: Employee handbooks, policy documents
        """)
        
        # Add sample benefits scenarios
        st.markdown("""
        ### 🎯 Common Benefits Scenarios:
        
        **New Employee Onboarding:**
        - "I'm a new hire with a family. Which health plan should I choose?"
        - "What benefits should I enroll in during my first 30 days?"
        
        **Life Changes:**
        - "I'm getting married. How do I add my spouse to my benefits?"
        - "I'm having a baby. What maternity benefits are available?"
        
        **Financial Planning:**
        - "I'm 25 and just started working. How should I plan for retirement?"
        - "Should I max out my HSA or contribute more to my 401(k)?"
        """)

if __name__ == "__main__":
    main()
    add_footer()