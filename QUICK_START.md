# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

**Option A - Use Setup Script (Windows):**
```bash
setup.bat
```

**Option B - Manual Installation:**
```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Step 2: Start the Application

**Option A - Use Start Script (Windows):**
```bash
start.bat
```

**Option B - Manual Start:**
```bash
npm run dev
```

### Step 3: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📋 First Time Setup

### 1. Create Account
- Click "Sign up" on the login page
- Enter your email and password
- Click "Sign Up"

### 2. Login
- Enter your credentials
- Click "Login"
- You'll be redirected to the Dashboard

### 3. Complete Company Profile
- Click "Profile" in the navigation
- Fill in all required fields:
  - Company Name
  - NAICS Codes (e.g., 541512, 541519)
  - Core Capabilities
  - Past Performance
- Click "Save Profile"

### 4. Generate Your First Proposal
- Go back to "Dashboard"
- Browse available opportunities
- Click "Generate Proposal" on any opportunity
- Wait 20-30 seconds for AI generation
- Review and edit the generated proposal

### 5. Download and Submit
- Edit any sections as needed
- Click "Download Proposal as PDF"
- Click "Submit Proposal" when ready

## 🎯 Key Features to Try

### Dashboard
✅ View government contract opportunities
✅ See opportunity details (agency, NAICS, deadline)
✅ One-click proposal generation

### Company Profile
✅ Store your company information
✅ Update anytime
✅ Used for all proposal generations

### Proposal Review
✅ Edit all proposal sections
✅ View source citations
✅ Check confidence score
✅ Download as PDF
✅ Regenerate if needed

## 🔧 Configuration

### Backend Configuration
File: `backend/.env`
```
HF_API_KEY=YOUR_HUGGINGFACE_API_KEY
JWT_SECRET=govpreneurs_secret_key_2024
PORT=5000
```

### Frontend Configuration
Default API URL: `http://localhost:5000`

To change, update in each component:
```javascript
const API_URL = 'http://localhost:5000/api'
```

## 📊 Sample Data

The application comes with 3 pre-loaded opportunities:

1. **IT Infrastructure Modernization**
   - Agency: Department of Defense
   - NAICS: 541512

2. **Cybersecurity Assessment Services**
   - Agency: Department of Homeland Security
   - NAICS: 541519

3. **Data Analytics Platform Development**
   - Agency: General Services Administration
   - NAICS: 541511

## 🛠️ Development Commands

```bash
# Start development servers
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Build frontend for production
npm run build

# Preview production build
cd frontend && npm run preview
```

## 📱 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Login Page**: http://localhost:3000/login
- **Signup Page**: http://localhost:3000/signup
- **Dashboard**: http://localhost:3000/
- **Profile**: http://localhost:3000/profile

## 🔐 Security Notes

- Passwords are hashed with bcrypt
- JWT tokens expire after session
- API keys stored in environment variables
- All routes except login/signup are protected

## 💡 Tips

1. **Complete your profile first** - Required for proposal generation
2. **Wait for AI generation** - Can take 20-30 seconds on first request
3. **Edit proposals** - AI-generated content should be reviewed
4. **Save frequently** - Use browser back button carefully
5. **Check sources** - Review source citations for accuracy

## 🆘 Need Help?

- **Troubleshooting**: See TROUBLESHOOTING.md
- **API Reference**: See API_DOCUMENTATION.md
- **Architecture**: See PROJECT_OVERVIEW.md
- **Full Documentation**: See README.md

## 🎉 You're Ready!

Your GovPreneurs AI Auto-Proposal Engine is now running and ready to help you generate professional government contract proposals!

Happy proposing! 🚀
