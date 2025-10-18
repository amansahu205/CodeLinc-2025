# RAG Chatbot with LangChain

A minimal implementation of a Retrieval Augmented Generation (RAG) chatbot using LangChain, OpenAI, and Google Generative AI. This chatbot allows you to upload documents and chat with your data using AI.

## Features

- 🤖 **Multiple LLM Support**: Choose between OpenAI GPT-3.5-turbo or Google Gemini Pro
- 📄 **Document Support**: Upload PDF, TXT, and CSV files
- 🔍 **Semantic Search**: Find relevant information across your documents
- 💬 **Conversational**: Maintains context throughout the conversation
- 📚 **Source Citations**: Shows which documents were used to answer questions
- 🌐 **Web Interface**: Easy-to-use Streamlit web application
- 🔄 **Memory Management**: Reset conversation history anytime

## Installation

1. **Clone or download the project files**

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables** (REQUIRED):
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your API keys:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     GOOGLE_API_KEY=your_google_api_key_here
     ```
   - **Important**: API keys are stored in the backend (`.env` file) for security. The UI will show if keys are configured correctly.

## Usage

### Option 1: Web Interface (Recommended)

Run the Streamlit app:
```bash
streamlit run streamlit_app.py
```

Then:
1. Open your browser to the provided URL (usually http://localhost:8501)
2. Select your AI model provider (OpenAI or Google) in the sidebar
3. Verify your API key is configured (green checkmark will appear)
4. Upload your documents (PDF, TXT, or CSV)
5. Click "Process Documents"
6. Start chatting with your documents!

### Option 2: Command Line

1. **Edit the `rag_chatbot.py` file**:
   - Add your document file paths to the `file_paths` list in the `main()` function

2. **Run the script**:
   ```bash
   python rag_chatbot.py
   ```

3. **Chat with your documents** through the command line interface

## API Keys

You need at least one of the following API keys:

### OpenAI API Key
- Go to [OpenAI Platform](https://platform.openai.com/account/api-keys)
- Create a new API key
- Add it to your `.env` file: `OPENAI_API_KEY=sk-...`

### Google API Key
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Add it to your `.env` file: `GOOGLE_API_KEY=AIza...`

**Security Note**: API keys are stored in the `.env` file (backend) and never exposed in the UI. The `.env` file is automatically excluded from git via `.gitignore`.

## How It Works

1. **Document Loading**: The system loads your documents using appropriate loaders (PDF, TXT, CSV)
2. **Text Splitting**: Documents are split into smaller chunks for better retrieval
3. **Vectorization**: Text chunks are converted to embeddings using OpenAI or Google embeddings
4. **Vector Storage**: Embeddings are stored in a Chroma vector database
5. **Retrieval**: When you ask a question, the system finds the most relevant document chunks
6. **Generation**: The LLM generates an answer based on the retrieved context and your question

## Supported File Types

- **PDF**: Text-based PDF documents
- **TXT**: Plain text files  
- **CSV**: Comma-separated value files

## Project Structure

```
├── rag_chatbot.py          # Main RAG chatbot implementation
├── streamlit_app.py        # Web interface using Streamlit
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── README.md              # This file
└── chroma_db/             # Vector database storage (created automatically)
```

## Customization

### Changing Models

In `rag_chatbot.py`, you can modify:
- **OpenAI model**: Change `model_name="gpt-3.5-turbo"` to `"gpt-4"` or other models
- **Google model**: Change `model="gemini-pro"` to other available models
- **Temperature**: Adjust creativity (0.0 = deterministic, 1.0 = creative)

### Adjusting Chunk Size

Modify the text splitter parameters:
```python
self.text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,        # Increase for larger chunks
    chunk_overlap=200,      # Overlap between chunks
    length_function=len
)
```

### Changing Retrieval Settings

Modify the retriever configuration:
```python
self.retriever = self.vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}  # Number of documents to retrieve
)
```

## Troubleshooting

### Common Issues

1. **API Key Errors**: Make sure your API keys are valid and have sufficient credits
2. **File Upload Issues**: Ensure files are text-based and not corrupted
3. **Memory Issues**: For large documents, try reducing chunk size or processing fewer documents at once
4. **Import Errors**: Make sure all dependencies are installed correctly

### Performance Tips

- Use smaller chunk sizes for more precise answers
- Use larger chunk sizes for more context
- Adjust the number of retrieved documents (`k` parameter)
- For large document collections, consider using a more powerful embedding model

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this RAG chatbot implementation.