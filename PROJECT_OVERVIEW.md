# GovPreneurs AI Auto-Proposal Engine - Project Overview

## Architecture

### Backend (Node.js + Express)
- **Port**: 5000
- **Database**: SQLite (govpreneurs.db)
- **Authentication**: JWT tokens with bcrypt password hashing
- **AI Integration**: Hugging Face Inference API (Mistral-7B-Instruct-v0.2)

### Frontend (React + TailwindCSS)
- **Port**: 3000
- **Routing**: React Router v6
- **Styling**: TailwindCSS utility-first framework
- **PDF Generation**: jsPDF library

## Database Schema

### Users Table
- id (PRIMARY KEY)
- email (UNIQUE)
- password (hashed)
- created_at

### CompanyProfiles Table
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- company_name
- naics_codes
- core_capabilities
- past_performance

### Opportunities Table
- id (PRIMARY KEY)
- title
- agency
- description
- naics_code
- deadline

### Proposals Table
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- opportunity_id (FOREIGN KEY)
- content (JSON)
- created_at

## RAG Workflow Implementation

### Step 1: Data Retrieval
- Fetch opportunity details from database
- Fetch company profile from database

### Step 2: Prompt Construction
System prompt includes:
- Expert role definition
- Instruction to use only provided data
- Required proposal sections
- Source citation requirements

### Step 3: AI Generation
- Send structured prompt to Hugging Face API
- Model: mistralai/Mistral-7B-Instruct-v0.2
- Parameters: max_new_tokens=1500, temperature=0.7

### Step 4: Response Processing
- Parse AI response into sections
- Store in database as JSON
- Return with metadata (confidence score, sources)

### Step 5: Display & Editing
- Render sections in editable textareas
- Show source citations
- Display trust indicators

## Key Features

### Authentication System
- Secure registration with password hashing
- JWT token-based authentication
- Protected routes on frontend
- Token verification middleware on backend

### Dashboard
- Displays government contract opportunities
- Card-based layout for easy browsing
- One-click proposal generation
- Loading states and error handling

### Company Profile
- Persistent storage of company information
- Used as context for AI proposal generation
- Required before generating proposals
- Easy update functionality

### Proposal Generation
- Combines opportunity + profile data
- Sends to Hugging Face API
- Generates structured proposal
- Saves to database for future reference

### Proposal Review Page
- Editable sections (Company Overview, Relevant Experience, etc.)
- Source citations for transparency
- Confidence score display
- Verified content badge
- AI warning message

### AI Control Features
- **Regenerate**: Fetch fresh proposal from API
- **Change Tone**: Adjust writing style (placeholder)
- **Improve Writing**: Enhance clarity (placeholder)
- **Download PDF**: Export complete proposal
- **Submit**: Final submission (placeholder)

## Trust & Transparency

### Confidence Score
- Displayed as percentage (87%)
- Indicates AI confidence in generated content

### Source Citations
- Each section shows data sources
- "View Source" buttons for verification
- Sources panel lists all reference materials

### AI Warning
- Prominent "AI Generated — Review Required" message
- Encourages human review before submission

### Verified Content Badge
- Visual indicator of content validation
- Builds user trust

## Security Considerations

1. **Password Security**: bcrypt hashing with salt
2. **API Key Protection**: Environment variables only
3. **Token Authentication**: JWT with secret key
4. **Route Protection**: Middleware on all protected endpoints
5. **Input Validation**: Required fields on forms

## Deployment Options

### AWS
- **Backend**: Elastic Beanstalk or EC2
- **Frontend**: S3 + CloudFront or Amplify
- **Database**: RDS (for production) or keep SQLite

### Vercel
- **Frontend**: Direct Vercel deployment
- **Backend**: Vercel Serverless Functions or separate service

### Replit
- **Full Stack**: Single Replit deployment
- **Auto-configuration**: Environment variables in Secrets

## Future Enhancements

1. Real-time collaboration on proposals
2. Version history and tracking
3. Integration with SAM.gov API for live opportunities
4. Advanced AI features (tone adjustment, writing improvement)
5. Team management and role-based access
6. Proposal templates library
7. Analytics dashboard
8. Email notifications for deadlines
9. Document upload and parsing
10. Multi-language support

## Performance Considerations

- SQLite suitable for small-medium scale
- Consider PostgreSQL for production scale
- Implement caching for frequently accessed data
- Optimize AI API calls (rate limiting, retries)
- Lazy loading for large proposal lists

## Testing Recommendations

1. Unit tests for backend routes
2. Integration tests for database operations
3. E2E tests for user workflows
4. API mocking for Hugging Face calls
5. Security testing for authentication

## Maintenance

- Regular dependency updates
- Monitor API usage and costs
- Database backups
- Log monitoring and error tracking
- User feedback collection
