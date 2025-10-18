import os
import tempfile
from pathlib import Path
from dotenv import load_dotenv

# LangChain imports
from langchain_openai import OpenAI, OpenAIEmbeddings, ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain_classic.chains import ConversationalRetrievalChain
from langchain_classic.memory import ConversationBufferMemory
from langchain_community.document_loaders import PyPDFLoader, TextLoader, CSVLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma

# Load environment variables
load_dotenv()

class InsuranceRAGChatbot:
    def __init__(self, llm_provider="openai"):
        """
        Initialize Insurance RAG Chatbot for Benefits and Financial Wellness
        
        Args:
            llm_provider (str): "openai" or "google"
        """
        self.llm_provider = llm_provider
        self.vectorstore = None
        self.retriever = None
        self.conversation_chain = None
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )
        
        # Initialize LLM and embeddings
        self._setup_llm_and_embeddings()
        
        # Setup text splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
    
    def _setup_llm_and_embeddings(self):
        """Setup LLM and embeddings based on provider"""
        if self.llm_provider == "openai":
            openai_api_key = os.getenv("OPENAI_API_KEY")
            if not openai_api_key:
                raise ValueError("OPENAI_API_KEY not found in environment variables")
            
            self.llm = ChatOpenAI(
                model_name="gpt-3.5-turbo",
                temperature=0.7,
                openai_api_key=openai_api_key
            )
            self.embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
            
        elif self.llm_provider == "google":
            google_api_key = os.getenv("GOOGLE_API_KEY")
            if not google_api_key:
                raise ValueError("GOOGLE_API_KEY not found in environment variables")
            
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-pro",
                temperature=0.7,
                google_api_key=google_api_key
            )
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=google_api_key
            )
        else:
            raise ValueError("llm_provider must be 'openai' or 'google'")
    
    def load_documents(self, file_paths):
        """
        Load documents from various file formats
        
        Args:
            file_paths (list): List of file paths to load
        
        Returns:
            list: List of loaded documents
        """
        documents = []
        
        for file_path in file_paths:
            file_path = Path(file_path)
            
            if not file_path.exists():
                print(f"File not found: {file_path}")
                continue
            
            try:
                if file_path.suffix.lower() == '.pdf':
                    loader = PyPDFLoader(str(file_path))
                elif file_path.suffix.lower() == '.txt':
                    loader = TextLoader(str(file_path))
                elif file_path.suffix.lower() == '.csv':
                    loader = CSVLoader(str(file_path))
                else:
                    print(f"Unsupported file format: {file_path.suffix}")
                    continue
                
                docs = loader.load()
                documents.extend(docs)
                print(f"Loaded {len(docs)} documents from {file_path.name}")
                
            except Exception as e:
                print(f"Error loading {file_path}: {str(e)}")
        
        return documents
    
    def create_vectorstore(self, documents):
        """
        Create vector store from documents
        
        Args:
            documents (list): List of documents to vectorize
        """
        if not documents:
            raise ValueError("No documents provided")
        
        # Split documents into chunks
        texts = self.text_splitter.split_documents(documents)
        print(f"Split documents into {len(texts)} chunks")
        
        # Create vector store
        self.vectorstore = Chroma.from_documents(
            documents=texts,
            embedding=self.embeddings,
            persist_directory="./chroma_db"
        )
        
        # Create retriever
        self.retriever = self.vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 3}
        )
        
        print("Vector store created successfully")
    
    def setup_conversation_chain(self):
        """Setup the conversational retrieval chain"""
        if not self.retriever:
            raise ValueError("Vector store not created. Call create_vectorstore first.")
        
        # Insurance-specific prompt template
        prompt_template = """You are an AI-powered Benefits and Financial Wellness Advisor for employees. 
        Use the following insurance and benefits context to provide helpful, accurate guidance.
        
        Focus on:
        - Health, dental, vision, and group benefits selection
        - Financial wellness education (budgeting, savings, debt management)
        - Long-term financial planning concepts
        - Personalized recommendations based on employee needs
        
        If you don't know the answer from the provided context, say so clearly and suggest contacting HR or benefits administrator.
        
        Context: {context}

        Question: {question}
        
        Answer:"""
        
        PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )
        
        # Create conversational retrieval chain
        self.conversation_chain = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=self.retriever,
            memory=self.memory,
            return_source_documents=True,
            combine_docs_chain_kwargs={"prompt": PROMPT}
        )
        
        print("Conversation chain setup complete")
    
    def chat(self, question):
        """
        Chat with the RAG system
        
        Args:
            question (str): User question
        
        Returns:
            dict: Response with answer and source documents
        """
        if not self.conversation_chain:
            raise ValueError("Conversation chain not setup. Call setup_conversation_chain first.")
        
        try:
            response = self.conversation_chain({"question": question})
            return {
                "answer": response["answer"],
                "source_documents": response.get("source_documents", [])
            }
        except Exception as e:
            return {
                "answer": f"Error processing question: {str(e)}",
                "source_documents": []
            }
    
    def reset_conversation(self):
        """Reset conversation memory"""
        self.memory.clear()
        print("Conversation memory cleared")

def main():
    """Example usage of RAG Chatbot"""
    print("Insurance Benefits & Financial Wellness Advisor")
    print("=" * 50)
    
    # Initialize insurance chatbot
    chatbot = InsuranceRAGChatbot(llm_provider="openai")
    
    # Example: Load documents (replace with your file paths)
    file_paths = [
        # Add your document paths here
        # "path/to/your/document.pdf",
        # "path/to/your/document.txt",
    ]
    
    if not file_paths:
        print("No documents specified. Please add file paths to the file_paths list.")
        return
    
    try:
        # Load documents
        documents = chatbot.load_documents(file_paths)
        
        if not documents:
            print("No documents loaded successfully.")
            return
        
        # Create vector store
        chatbot.create_vectorstore(documents)
        
        # Setup conversation chain
        chatbot.setup_conversation_chain()
        
        # Interactive chat loop
        print("\nChatbot ready! Type 'quit' to exit, 'reset' to clear conversation history.")
        print("-" * 50)
        
        while True:
            question = input("\nYou: ").strip()
            
            if question.lower() == 'quit':
                break
            elif question.lower() == 'reset':
                chatbot.reset_conversation()
                continue
            elif not question:
                continue
            
            response = chatbot.chat(question)
            print(f"\nBot: {response['answer']}")
            
            # Optionally show source documents
            if response['source_documents']:
                print(f"\n[Sources: {len(response['source_documents'])} documents]")
    
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()