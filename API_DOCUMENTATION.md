# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### Register User
```
POST /register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

### Login User
```
POST /login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "userId": 1
}
```

## Protected Endpoints

All endpoints below require Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Get Opportunities
```
GET /opportunities
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "IT Infrastructure Modernization",
    "agency": "Department of Defense",
    "description": "Seeking qualified contractors...",
    "naics_code": "541512",
    "deadline": "2024-06-30"
  }
]
```

### Save Company Profile
```
POST /save-profile
```

**Request Body:**
```json
{
  "companyName": "Tech Solutions Inc",
  "naicsCodes": "541512, 541519",
  "coreCapabilities": "Cloud computing, cybersecurity...",
  "pastPerformance": "Successfully delivered 10+ federal projects..."
}
```

**Response:**
```json
{
  "message": "Profile saved successfully"
}
```

### Get Company Profile
```
GET /profile
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "company_name": "Tech Solutions Inc",
  "naics_codes": "541512, 541519",
  "core_capabilities": "Cloud computing, cybersecurity...",
  "past_performance": "Successfully delivered 10+ federal projects..."
}
```

### Generate Proposal
```
POST /generate-proposal
```

**Request Body:**
```json
{
  "opportunityId": 1
}
```

**Response:**
```json
{
  "proposalId": 1,
  "sections": {
    "companyOverview": "...",
    "relevantExperience": "...",
    "technicalApproach": "...",
    "complianceStatement": "...",
    "conclusion": "..."
  },
  "opportunity": { ... },
  "profile": { ... },
  "confidenceScore": 87
}
```

### Get Proposal
```
GET /proposal/:id
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "opportunity_id": 1,
  "content": "...",
  "created_at": "2024-01-15 10:30:00",
  "title": "IT Infrastructure Modernization",
  "agency": "Department of Defense",
  "sections": { ... },
  "profile": { ... }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email already exists"
}
```

### 401 Unauthorized
```json
{
  "error": "Access denied"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Proposal not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to generate proposal"
}
```
