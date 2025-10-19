# CodeLinc-2025: AI-Powered Benefits & Financial Wellness Advisor

**Lincoln Financial Hackathon - CodeLinc 10**

An intelligent platform that guides early-career employees through benefits selection and financial wellness education using AI-powered recommendations.

## 🎯 Problem Statement

New employees face overwhelming choices during benefits enrollment and lack financial literacy for long-term planning. This platform provides:
- Personalized benefit recommendations based on individual circumstances
- Interactive AI chatbot for questions and guidance
- Financial wellness education and resources
- Streamlined enrollment process

## 🏗️ Architecture

### Frontend
- **Tech**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Features**: Responsive UI, real-time chat, PDF generation
- **Deployment**: AWS Amplify

### Backend
- **Tech**: Flask, PostgreSQL, AWS Bedrock (Amazon Titan)
- **Features**: JWT auth, AI recommendations, RESTful API
- **Deployment**: AWS Elastic Beanstalk

### Database
- **Tech**: PostgreSQL
- **Deployment**: AWS RDS
- **Schema**: Users, benefits, plans, selections

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Configure .env with database and AWS credentials
python server.py
```

### Frontend Setup
```bash
cd ai-financial-login
npm install
cp .env.local.example .env.local
# Configure .env.local with backend API URL
npm run dev
```

## 📁 Project Structure

```
CodeLinc-2025/
├── backend/              # Flask API
│   ├── api/             # Route handlers
│   ├── database/        # SQL schemas
│   ├── services/        # AI & business logic
│   └── .ebextensions/   # AWS EB config
├── ai-financial-login/   # Next.js frontend
│   ├── app/             # Pages
│   ├── components/      # React components
│   └── lib/             # Utilities
└── Frontend/docs/        # Documentation
```

## 🎨 Key Features

### 1. Smart Recommendations
- Annual questionnaire (5-7 questions)
- AI-powered benefit matching
- Dynamic priority labels (💎 Highly Recommended, ⭐ Recommended, etc.)
- Real-time updates based on life events

### 2. AI Chatbot
- AWS Bedrock integration (Amazon Titan)
- Context-aware responses
- Benefits knowledge base
- Life event detection

### 3. Interactive Tools
- Plan comparison modal
- Cost calculator
- PDF enrollment summary
- Financial health tracking

### 4. Lincoln Financial Programs
- 529 Savings Plan (WPS)
- Candidly Emergency Savings
- WellnessPATH Financial Wellness

## 🔐 Security
- JWT authentication
- Secure password hashing
- Environment-based configuration
- CORS protection

## 📊 Database Schema

**Users**: id, name, email, age, salary, dependents, last_questionnaire_date  
**Benefits**: id, name, category, description  
**Plans**: id, benefit_id, name, cost, coverage  
**User_Selections**: user_id, plan_id, enrollment_date

## 🌐 Deployment

### Production URLs
- **Backend**: AWS Elastic Beanstalk (us-east-1)
- **Frontend**: AWS Amplify (pending)
- **Database**: AWS RDS PostgreSQL

See `AWS_DEPLOYMENT_GUIDE.md` for detailed instructions.

## 👥 Team

Lincoln Financial - CodeLinc 2025 Hackathon Submission

## 📄 License

Proprietary - Lincoln Financial Group
