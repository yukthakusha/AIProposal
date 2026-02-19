# Deployment Instructions

## Step 1: Push to GitHub

```bash
cd e:\aicasestudy
git init
git add .
git commit -m "Initial commit - GovPreneurs AI"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: govpreneurs-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `HF_API_KEY` = `YOUR_HUGGINGFACE_API_KEY`
     - `JWT_SECRET` = `govpreneurs_secret_key_2024`
     - `PORT` = `5000`
5. Click "Create Web Service"
6. Copy your backend URL (e.g., https://govpreneurs-backend.onrender.com)

## Step 3: Update Frontend API URL

Replace `http://localhost:5000` with your Render backend URL in:
- frontend/src/pages/Dashboard.jsx
- frontend/src/pages/Login.jsx
- frontend/src/pages/Signup.jsx
- frontend/src/pages/Profile.jsx
- frontend/src/pages/ProposalReview.jsx

## Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
5. Click "Deploy"

## Done!

Your app is now live:
- Frontend: https://your-app.vercel.app
- Backend: https://govpreneurs-backend.onrender.com
