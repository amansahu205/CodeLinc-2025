# Benefits Selection Frontend

AI-powered benefits and financial wellness advisor frontend built with Next.js, React, and Tailwind CSS.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: React, Tailwind CSS, shadcn/ui
- **State**: React Hooks
- **Authentication**: JWT (localStorage)
- **Deployment**: AWS Amplify

## Features
- 🔐 Secure JWT authentication
- 💬 AI-powered chatbot with AWS Bedrock
- 📊 Interactive benefit comparison
- 🎯 Personalized recommendations
- 📱 Responsive design
- 🎨 Lincoln Financial brand styling
- 📄 PDF enrollment summary generation

## Setup

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Run development server:
```bash
npm run dev
```

App runs on `http://localhost:3000`

## Build for Production

```bash
npm run build
npm start
```

## Deployment

### AWS Amplify

1. Connect GitHub repository
2. Set build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

## Project Structure
```
ai-financial-login/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   └── ...          # Custom components
├── lib/             # Utilities (API, auth, PDF)
├── hooks/           # Custom React hooks
├── public/          # Static assets
└── styles/          # Global styles
```

## Key Components
- `benefit-cards.tsx` - Benefit display with recommendations
- `chat-sidebar-placeholder.tsx` - AI chatbot interface
- `user-profile-bar.tsx` - User profile with stats
- `plan-comparison-modal.tsx` - Plan comparison tool

## License
Lincoln Financial - CodeLinc 2025 Hackathon
