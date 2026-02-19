# System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                 │
│                     http://localhost:3000                            │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                      FRONTEND (React)                                │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   Login     │  │   Signup    │  │  Dashboard  │                 │
│  │   Page      │  │    Page     │  │    Page     │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   Profile   │  │  Proposal   │  │   Navbar    │                 │
│  │    Page     │  │   Review    │  │  Component  │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                       │
│  Technologies: React 18, TailwindCSS, React Router, jsPDF           │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ REST API Calls
                             │ JWT Token in Headers
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                       │
│                     http://localhost:5000                            │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    API ENDPOINTS                              │  │
│  │                                                               │  │
│  │  POST /api/register        - User Registration               │  │
│  │  POST /api/login           - User Login                      │  │
│  │  GET  /api/opportunities   - Get Opportunities               │  │
│  │  POST /api/save-profile    - Save Company Profile            │  │
│  │  GET  /api/profile         - Get Company Profile             │  │
│  │  POST /api/generate-proposal - Generate AI Proposal          │  │
│  │  GET  /api/proposal/:id    - Get Specific Proposal           │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  AUTHENTICATION MIDDLEWARE                    │  │
│  │                                                               │  │
│  │  - JWT Token Verification                                    │  │
│  │  - bcrypt Password Hashing                                   │  │
│  │  - Protected Route Guards                                    │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Technologies: Express, bcryptjs, jsonwebtoken, dotenv               │
└──────────────┬────────────────────────────────┬─────────────────────┘
               │                                │
               │                                │
               │                                │ AI Generation Request
               │ Database Queries               │
               │                                │
┌──────────────▼────────────────┐  ┌───────────▼──────────────────────┐
│     DATABASE (SQLite)         │  │   HUGGING FACE API               │
│   govpreneurs.db              │  │                                  │
│                               │  │  Model: Mistral-7B-Instruct-v0.2 │
│  ┌─────────────────────────┐ │  │                                  │
│  │  Users                  │ │  │  ┌────────────────────────────┐ │
│  │  - id                   │ │  │  │  RAG WORKFLOW              │ │
│  │  - email                │ │  │  │                            │ │
│  │  - password (hashed)    │ │  │  │  1. Receive Prompt         │ │
│  │  - created_at           │ │  │  │  2. Process Context        │ │
│  └─────────────────────────┘ │  │  │  3. Generate Proposal      │ │
│                               │  │  │  4. Return Structured Text │ │
│  ┌─────────────────────────┐ │  │  └────────────────────────────┘ │
│  │  CompanyProfiles        │ │  │                                  │
│  │  - id                   │ │  │  Input: System Prompt +          │
│  │  - user_id              │ │  │         Company Profile +        │
│  │  - company_name         │ │  │         Opportunity Data         │
│  │  - naics_codes          │ │  │                                  │
│  │  - core_capabilities    │ │  │  Output: Structured Proposal     │
│  │  - past_performance     │ │  │          with Sections           │
│  └─────────────────────────┘ │  │                                  │
│                               │  │  API Key: HF_API_KEY             │
│  ┌─────────────────────────┐ │  │  (from .env)                     │
│  │  Opportunities          │ │  └──────────────────────────────────┘
│  │  - id                   │ │
│  │  - title                │ │
│  │  - agency               │ │
│  │  - description          │ │
│  │  - naics_code           │ │
│  │  - deadline             │ │
│  └─────────────────────────┘ │
│                               │
│  ┌─────────────────────────┐ │
│  │  Proposals              │ │
│  │  - id                   │ │
│  │  - user_id              │ │
│  │  - opportunity_id       │ │
│  │  - content (JSON)       │ │
│  │  - created_at           │ │
│  └─────────────────────────┘ │
│                               │
│  Technology: better-sqlite3   │
└───────────────────────────────┘


DATA FLOW - PROPOSAL GENERATION
═══════════════════════════════════════════════════════════════════

1. USER ACTION
   └─> User clicks "Generate Proposal" on Dashboard

2. FRONTEND REQUEST
   └─> POST /api/generate-proposal
       Headers: { Authorization: "Bearer <JWT_TOKEN>" }
       Body: { opportunityId: 1 }

3. BACKEND AUTHENTICATION
   └─> Verify JWT Token
       └─> Extract user_id from token

4. DATA RETRIEVAL
   └─> Query Opportunities table (opportunityId)
   └─> Query CompanyProfiles table (user_id)

5. PROMPT CONSTRUCTION
   └─> Combine:
       - System Prompt (expert instructions)
       - Company Profile (name, NAICS, capabilities, performance)
       - Opportunity Data (title, agency, description, NAICS, deadline)

6. AI GENERATION
   └─> Send to Hugging Face API
       └─> Model: mistralai/Mistral-7B-Instruct-v0.2
       └─> Parameters: max_new_tokens=1500, temperature=0.7

7. RESPONSE PROCESSING
   └─> Parse AI response into sections:
       - Company Overview
       - Relevant Experience
       - Technical Approach
       - Compliance Statement
       - Conclusion

8. DATABASE STORAGE
   └─> INSERT INTO Proposals
       └─> Store sections as JSON

9. FRONTEND RESPONSE
   └─> Return:
       - proposalId
       - sections (parsed)
       - opportunity data
       - profile data
       - confidenceScore: 87

10. NAVIGATION
    └─> Redirect to /proposal/:id
        └─> Display ProposalReview page


AUTHENTICATION FLOW
═══════════════════════════════════════════════════════════════════

SIGNUP:
User → Signup Form → POST /api/register → Hash Password → Store in DB → Success

LOGIN:
User → Login Form → POST /api/login → Verify Password → Generate JWT → Return Token

PROTECTED ROUTE:
User → Request → Check Token → Verify JWT → Allow/Deny → Response


SECURITY LAYERS
═══════════════════════════════════════════════════════════════════

1. PASSWORD SECURITY
   └─> bcrypt hashing (10 rounds)
   └─> Never store plain text passwords

2. TOKEN SECURITY
   └─> JWT with secret key
   └─> Stored in localStorage
   └─> Sent in Authorization header

3. API KEY SECURITY
   └─> Stored in .env file
   └─> Never committed to git
   └─> Accessed via process.env

4. ROUTE PROTECTION
   └─> Frontend: ProtectedRoute component
   └─> Backend: authenticateToken middleware

5. CORS PROTECTION
   └─> Configured in Express
   └─> Allows specific origins


DEPLOYMENT ARCHITECTURE
═══════════════════════════════════════════════════════════════════

OPTION 1: AWS
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  CloudFront     │────▶│  S3 Bucket       │     │ Elastic         │
│  (CDN)          │     │  (Frontend)      │     │ Beanstalk       │
└─────────────────┘     └──────────────────┘     │ (Backend)       │
                                                  └─────────────────┘

OPTION 2: Vercel + Railway
┌─────────────────┐                              ┌─────────────────┐
│  Vercel         │─────────────────────────────▶│  Railway        │
│  (Frontend)     │         API Calls            │  (Backend)      │
└─────────────────┘                              └─────────────────┘

OPTION 3: Replit (Full Stack)
┌──────────────────────────────────────────────────────────────────┐
│                        Replit Container                           │
│  ┌────────────────┐              ┌──────────────────┐            │
│  │   Frontend     │◀────────────▶│    Backend       │            │
│  │   (Port 3000)  │              │    (Port 5000)   │            │
│  └────────────────┘              └──────────────────┘            │
└──────────────────────────────────────────────────────────────────┘
```

## Component Interaction Map

```
┌──────────────┐
│    Login     │──┐
└──────────────┘  │
                  │
┌──────────────┐  │    ┌──────────────┐    ┌──────────────────┐
│   Signup     │──┼───▶│   Navbar     │───▶│   Dashboard      │
└──────────────┘  │    └──────────────┘    └────────┬─────────┘
                  │                                  │
                  │                                  │
                  │                                  ▼
                  │                         ┌──────────────────┐
                  │                         │  Generate        │
                  │                         │  Proposal        │
                  │                         └────────┬─────────┘
                  │                                  │
                  │                                  │
┌──────────────┐  │                                  ▼
│   Profile    │◀─┘                         ┌──────────────────┐
└──────────────┘                            │ ProposalReview   │
                                            └──────────────────┘
                                                     │
                                                     │
                                            ┌────────▼─────────┐
                                            │  Download PDF    │
                                            │  Submit          │
                                            └──────────────────┘
```

## File Structure

```
aicasestudy/
│
├── backend/
│   ├── .env                    # Environment variables
│   ├── database.js             # Database schema & initialization
│   ├── server.js               # Express server & API routes
│   ├── package.json            # Backend dependencies
│   └── govpreneurs.db          # SQLite database (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx      # Navigation component
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Signup.jsx      # Signup page
│   │   │   ├── Dashboard.jsx   # Opportunities dashboard
│   │   │   ├── Profile.jsx     # Company profile page
│   │   │   └── ProposalReview.jsx  # Proposal review & edit
│   │   ├── App.jsx             # Main app with routing
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # TailwindCSS imports
│   ├── index.html              # HTML entry point
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # TailwindCSS configuration
│   └── postcss.config.js       # PostCSS configuration
│
├── package.json                # Root package (concurrently)
├── setup.bat                   # Windows setup script
├── start.bat                   # Windows start script
├── .gitignore                  # Git ignore rules
│
└── Documentation/
    ├── README.md               # Main documentation
    ├── QUICK_START.md          # Quick start guide
    ├── API_DOCUMENTATION.md    # API reference
    ├── PROJECT_OVERVIEW.md     # Architecture details
    ├── DEPLOYMENT.md           # Deployment guide
    ├── TROUBLESHOOTING.md      # Troubleshooting guide
    ├── BUILD_SUMMARY.md        # Build completion summary
    └── ARCHITECTURE.md         # This file
```
