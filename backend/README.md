# Benefits Selection Backend API

AI-powered benefits and financial wellness advisor backend built with Flask, PostgreSQL, and AWS Bedrock.

## Tech Stack
- **Framework**: Flask
- **Database**: PostgreSQL
- **AI**: AWS Bedrock (Amazon Titan)
- **Authentication**: JWT
- **Deployment**: AWS Elastic Beanstalk

## Setup

### Prerequisites
- Python 3.9+
- PostgreSQL 12+
- AWS Account with Bedrock access

### Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables (`.env`):
```
SECRET_KEY=your-secret-key
DB_HOST=localhost
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

3. Initialize database:
```bash
psql -U postgres -d postgres -f database/schema.sql
psql -U postgres -d postgres -f database/seed_data.sql
psql -U postgres -d postgres -f database/add_plans_data.sql
```

4. Run server:
```bash
python server.py
```

API runs on `http://localhost:5000`

## API Endpoints

### Public
- `GET /` - Health check
- `GET /api/health` - API health status
- `POST /api/login` - User authentication

### Protected (requires JWT token)
- `GET /api/benefits` - Get all benefits
- `GET /api/selections` - Get user selections
- `POST /api/selections` - Save benefit selection
- `POST /api/chat` - AI chatbot interaction
- `POST /api/enroll` - Complete enrollment

## Deployment

### AWS Elastic Beanstalk

1. Initialize EB:
```bash
eb init -p python-3.9 benefits-app --region us-east-1
```

2. Create environment:
```bash
eb create benefits-env
```

3. Deploy:
```bash
eb deploy
```

Environment variables are configured in `.ebextensions/environment.config`

## Project Structure
```
backend/
├── api/              # API route handlers
├── database/         # SQL schemas and migrations
├── services/         # Business logic (AI, benefits)
├── .ebextensions/    # AWS EB configuration
├── application.py    # EB entry point
├── server.py         # Flask app
└── requirements.txt  # Python dependencies
```

## License
Lincoln Financial - CodeLinc 2025 Hackathon
