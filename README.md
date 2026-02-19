# GovPreneurs AI Auto-Proposal Engine

A full-stack web application that helps small businesses generate government contract proposals using AI.

## Tech Stack

- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Authentication**: JWT-based login
- **AI Integration**: Hugging Face Inference API (Mistral-7B-Instruct)

## Features

✅ User Authentication (Login/Signup with password hashing)
✅ Dashboard with Government Contract Opportunities
✅ Company Profile Management
✅ AI-Powered Proposal Generation using RAG workflow
✅ Editable Proposal Sections
✅ Trust & Transparency Indicators (Confidence Score, Source Citations)
✅ PDF Export
✅ Clean, Modern, Responsive UI

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm

### Setup Instructions

1. **Install root dependencies**
```bash
npm install
```

2. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Production Build

Build the frontend for production:

```bash
npm run build
```

## Environment Variables

The backend uses the following environment variables (already configured in `backend/.env`):

```
HF_API_KEY=YOUR_HUGGINGFACE_API_KEY
JWT_SECRET=govpreneurs_secret_key_2024
PORT=5000
```

## Database

SQLite database is automatically created with the following tables:
- **Users**: User authentication data
- **CompanyProfiles**: Company information for proposal generation
- **Opportunities**: Government contract opportunities
- **Proposals**: Generated proposals

Sample opportunities are pre-populated on first run.

## Usage Guide

1. **Sign Up**: Create a new account at `/signup`
2. **Login**: Access your account at `/login`
3. **Complete Profile**: Fill in your company information at `/profile`
4. **Browse Opportunities**: View available contracts on the Dashboard
5. **Generate Proposal**: Click "Generate Proposal" on any opportunity
6. **Review & Edit**: Review AI-generated proposal, edit sections as needed
7. **Download**: Export proposal as PDF
8. **Submit**: Submit your proposal

## RAG Workflow

The application implements Retrieval-Augmented Generation:

1. Retrieves opportunity data from database
2. Retrieves company profile from database
3. Combines both into structured prompt
4. Sends to Hugging Face Mistral-7B-Instruct model
5. Parses response into structured sections
6. Displays with source citations and trust indicators

## Deployment

### AWS Deployment

1. Use AWS Elastic Beanstalk for backend
2. Use AWS Amplify or S3 + CloudFront for frontend
3. Configure environment variables in AWS console

### Vercel Deployment

1. Deploy frontend to Vercel
2. Deploy backend to Vercel Serverless Functions or separate service
3. Update API URLs in frontend

### Replit Deployment

1. Import project to Replit
2. Configure run command: `npm run dev`
3. Environment variables auto-configured

## API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/opportunities` - Get all opportunities
- `POST /api/save-profile` - Save company profile
- `GET /api/profile` - Get company profile
- `POST /api/generate-proposal` - Generate AI proposal
- `GET /api/proposal/:id` - Get specific proposal

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected routes
- Environment variable for API keys

## License

MIT
