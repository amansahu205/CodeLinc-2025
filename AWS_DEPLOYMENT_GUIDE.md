# AWS Deployment Guide - Lincoln Financial Benefits App

## Architecture Overview

```
Frontend (Next.js) → AWS Amplify
Backend (Flask) → AWS Elastic Beanstalk
Database (PostgreSQL) → AWS RDS
AI (Bedrock) → Already configured
```

## Prerequisites

- AWS Account with billing enabled
- AWS CLI installed
- Git repository

---

## Part 1: Deploy Backend (Flask API)

### Step 1: Prepare Backend for Deployment

Create `requirements.txt`:
```bash
cd backend
pip freeze > requirements.txt
```

Create `application.py` (Elastic Beanstalk entry point):
```python
from server import app as application

if __name__ == '__main__':
    application.run()
```

### Step 2: Create RDS PostgreSQL Database

1. Go to AWS Console → **RDS**
2. Click **Create database**
3. **Engine options:**
   - Engine type: **PostgreSQL**
   - Version: Latest (default)
4. **Templates:**
   - Select: **Free tier**
5. **Settings:**
   - DB instance identifier: `benefits-db`
   - Master username: `postgres`
   - Master password: (set strong password, e.g., `Benefits2025!`)
6. **Instance configuration:**
   - Auto-selected (db.t3.micro for free tier)
7. **Storage:**
   - Keep defaults (20 GB)
8. **Connectivity:**
   - Scroll down to find **Public access**
   - Select: **Yes** ✅ (Important for initial setup)
9. **Additional configuration:**
   - Initial database name: `benefits_db`
10. Click **Create database**
11. Wait 5-10 minutes for creation
12. Click on database name → **Connectivity & security** tab
13. Copy the **Endpoint** (e.g., `benefits-db.xxxxx.us-east-1.rds.amazonaws.com`)

### Step 3: Update Backend Environment Variables

Create `.ebextensions/environment.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    DB_HOST: your-rds-endpoint.rds.amazonaws.com
    DB_NAME: benefits_db
    DB_USER: postgres
    DB_PASSWORD: your-rds-password
    AWS_REGION: us-east-1
```

### Step 4: Deploy to Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init -p python-3.11 benefits-backend --region us-east-1

# Create environment
eb create benefits-env

# Deploy
eb deploy

# Get URL
eb status
```

Your backend will be at: `http://benefits-env.xxxxx.us-east-1.elasticbeanstalk.com`

---

## Part 2: Deploy Frontend (Next.js)

### Step 1: Update API URLs

Update `ai-financial-login/lib/api.ts`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
```

Create `.env.production`:
```
NEXT_PUBLIC_API_URL=http://your-backend-url.elasticbeanstalk.com
```

### Step 2: Deploy to AWS Amplify

1. Go to AWS Console → **AWS Amplify**
2. Click **New app** → **Host web app**
3. Choose **GitHub** (or your Git provider)
4. Authorize and select your repository
5. Select branch: `main`
6. Build settings (auto-detected):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd ai-financial-login
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: ai-financial-login/.next
       files:
         - '**/*'
     cache:
       paths:
         - ai-financial-login/node_modules/**/*
   ```
7. Add environment variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `http://your-backend-url.elasticbeanstalk.com`
8. Click **Save and deploy**

Your app will be at: `https://main.xxxxx.amplifyapp.com`

---

## Part 3: Setup Database Schema

Connect to RDS and run schema:

```bash
# Install PostgreSQL client
# Windows: Download from postgresql.org

# Connect to RDS
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d postgres

# Create database
CREATE DATABASE benefits_db;
\c benefits_db

# Run schema (paste contents of backend/database/schema.sql)
```

Or use pgAdmin:
1. Add new server
2. Host: RDS endpoint
3. Username: postgres
4. Password: your RDS password
5. Run schema.sql

---

## Part 4: Configure CORS

Update `backend/server.py`:
```python
CORS(app, origins=[
    'http://localhost:3000',
    'https://main.xxxxx.amplifyapp.com',  # Your Amplify URL
    'https://your-custom-domain.com'
])
```

Redeploy:
```bash
cd backend
eb deploy
```

---

## Part 5: Custom Domain (Optional)

### For Frontend (Amplify):
1. Amplify Console → Domain management
2. Add domain
3. Follow DNS verification steps

### For Backend (Elastic Beanstalk):
1. Get SSL certificate from AWS Certificate Manager
2. Add load balancer
3. Configure Route 53

---

## Cost Estimate (Free Tier)

- **RDS PostgreSQL (Free Tier):** $0/month (first 12 months)
- **Elastic Beanstalk:** $0 (pay for EC2)
- **EC2 t2.micro:** $0/month (free tier)
- **Amplify:** $0.01/build minute, $0.15/GB served
- **Bedrock Titan:** ~$0.0001/request

**Total:** ~$5-10/month after free tier

---

## Quick Deploy Commands

```bash
# Backend
cd backend
eb init -p python-3.11 benefits-backend --region us-east-1
eb create benefits-env
eb deploy

# Frontend - push to GitHub, Amplify auto-deploys

# Check status
eb status
```

---

## Troubleshooting

### Backend won't start
- Check logs: `eb logs`
- Verify environment variables
- Check RDS security group allows EB access

### Frontend can't reach backend
- Check CORS settings
- Verify API_URL environment variable
- Check backend security group allows HTTPS

### Database connection fails
- Verify RDS endpoint
- Check security group inbound rules (port 5432)
- Verify credentials

---

## Production Checklist

- [ ] RDS database created and schema loaded
- [ ] Backend deployed to Elastic Beanstalk
- [ ] Frontend deployed to Amplify
- [ ] Environment variables configured
- [ ] CORS properly set
- [ ] SSL certificates (for custom domain)
- [ ] Database backups enabled
- [ ] CloudWatch monitoring enabled
- [ ] Remove `.env` from Git (use .gitignore)

---

## Rollback

```bash
# Backend
eb deploy --version previous-version

# Frontend
# Amplify Console → Redeploy previous build
```

---

## Support

- AWS Documentation: https://docs.aws.amazon.com
- Elastic Beanstalk: https://docs.aws.amazon.com/elasticbeanstalk
- Amplify: https://docs.amplify.aws
- RDS: https://docs.aws.amazon.com/rds

---

Your Lincoln Financial Benefits App is now live on AWS! 🚀
