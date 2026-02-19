# Testing Guide

## Manual Testing Checklist

### 1. Authentication Testing

#### Test Case 1.1: User Registration
**Steps:**
1. Navigate to http://localhost:3000/signup
2. Enter email: test@example.com
3. Enter password: password123
4. Click "Sign Up"

**Expected Result:**
- Success message or redirect to login
- User created in database

**Verification:**
```sql
SELECT * FROM Users WHERE email = 'test@example.com';
```

#### Test Case 1.2: User Login
**Steps:**
1. Navigate to http://localhost:3000/login
2. Enter registered email
3. Enter password
4. Click "Login"

**Expected Result:**
- Redirect to Dashboard
- JWT token stored in localStorage
- Navbar appears

**Verification:**
```javascript
// In browser console
localStorage.getItem('token')
```

#### Test Case 1.3: Duplicate Registration
**Steps:**
1. Try to register with existing email

**Expected Result:**
- Error message: "Email already exists"
- No new user created

#### Test Case 1.4: Invalid Login
**Steps:**
1. Enter wrong password
2. Click "Login"

**Expected Result:**
- Error message: "Invalid credentials"
- No token generated

#### Test Case 1.5: Protected Route Access
**Steps:**
1. Logout
2. Try to access http://localhost:3000/profile directly

**Expected Result:**
- Redirect to /login
- Cannot access protected pages

### 2. Company Profile Testing

#### Test Case 2.1: Create Profile
**Steps:**
1. Login
2. Navigate to Profile page
3. Fill in all fields:
   - Company Name: "Tech Solutions Inc"
   - NAICS Codes: "541512, 541519"
   - Core Capabilities: "Cloud computing, cybersecurity"
   - Past Performance: "10+ federal projects"
4. Click "Save Profile"

**Expected Result:**
- Success message appears
- Profile saved to database

**Verification:**
```sql
SELECT * FROM CompanyProfiles WHERE user_id = 1;
```

#### Test Case 2.2: Update Profile
**Steps:**
1. Modify existing profile
2. Click "Save Profile"

**Expected Result:**
- Success message
- Profile updated (not duplicated)

#### Test Case 2.3: Profile Persistence
**Steps:**
1. Save profile
2. Logout and login again
3. Navigate to Profile page

**Expected Result:**
- Previously saved data appears in form

### 3. Dashboard Testing

#### Test Case 3.1: View Opportunities
**Steps:**
1. Login
2. View Dashboard

**Expected Result:**
- 3 opportunities displayed
- Each shows: Title, Agency, Description, NAICS, Deadline
- "Generate Proposal" button on each card

#### Test Case 3.2: Opportunity Display
**Steps:**
1. Verify each opportunity card

**Expected Result:**
- IT Infrastructure Modernization (DoD)
- Cybersecurity Assessment Services (DHS)
- Data Analytics Platform Development (GSA)

### 4. Proposal Generation Testing

#### Test Case 4.1: Generate Without Profile
**Steps:**
1. Login with new user (no profile)
2. Click "Generate Proposal"

**Expected Result:**
- Error message: "Company profile not found"
- No proposal generated

#### Test Case 4.2: Generate With Profile
**Steps:**
1. Complete company profile
2. Click "Generate Proposal" on any opportunity
3. Wait 20-30 seconds

**Expected Result:**
- Loading indicator appears
- Redirect to Proposal Review page
- Proposal sections populated

#### Test Case 4.3: AI Response Parsing
**Steps:**
1. Generate proposal
2. Check all sections

**Expected Result:**
- Company Overview section filled
- Relevant Experience section filled
- Technical Approach section filled
- Compliance Statement section filled
- Conclusion section filled

#### Test Case 4.4: Proposal Storage
**Steps:**
1. Generate proposal

**Expected Result:**
- Proposal saved to database

**Verification:**
```sql
SELECT * FROM Proposals WHERE user_id = 1;
```

### 5. Proposal Review Testing

#### Test Case 5.1: View Proposal
**Steps:**
1. Navigate to proposal review page

**Expected Result:**
- All sections displayed
- Editable textareas
- Source citations visible
- Confidence score: 87%
- Verified Content badge
- AI warning message

#### Test Case 5.2: Edit Sections
**Steps:**
1. Modify text in any section
2. Type new content

**Expected Result:**
- Text updates in real-time
- Changes persist in component state

#### Test Case 5.3: View Sources
**Steps:**
1. Check Sources and References panel

**Expected Result:**
- Opportunity data displayed
- Company profile displayed

#### Test Case 5.4: Regenerate Proposal
**Steps:**
1. Click "Regenerate Proposal"
2. Wait for response

**Expected Result:**
- Loading state
- New proposal generated
- Sections updated

#### Test Case 5.5: Download PDF
**Steps:**
1. Click "Download Proposal as PDF"

**Expected Result:**
- PDF file downloads
- Contains all sections
- Properly formatted

**Verification:**
- Open downloaded PDF
- Check all sections present

#### Test Case 5.6: Submit Proposal
**Steps:**
1. Click "Submit Proposal"

**Expected Result:**
- Alert: "Proposal submitted successfully!"

### 6. Navigation Testing

#### Test Case 6.1: Navbar Links
**Steps:**
1. Click each navbar link

**Expected Result:**
- Dashboard link → Dashboard page
- Profile link → Profile page
- Logout link → Login page

#### Test Case 6.2: Browser Back Button
**Steps:**
1. Navigate through pages
2. Use browser back button

**Expected Result:**
- Proper navigation history
- No broken states

### 7. UI/UX Testing

#### Test Case 7.1: Responsive Design
**Steps:**
1. Resize browser window
2. Test mobile view (< 768px)
3. Test tablet view (768px - 1024px)
4. Test desktop view (> 1024px)

**Expected Result:**
- Layout adapts properly
- No horizontal scrolling
- Buttons remain clickable

#### Test Case 7.2: Loading States
**Steps:**
1. Observe loading indicators during:
   - Login
   - Profile save
   - Proposal generation

**Expected Result:**
- Loading text appears
- Buttons disabled during loading
- Clear feedback to user

#### Test Case 7.3: Error Messages
**Steps:**
1. Trigger various errors
2. Check error display

**Expected Result:**
- Clear error messages
- Red/yellow color coding
- User-friendly language

### 8. API Testing

#### Test Case 8.1: Register Endpoint
**Request:**
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"api@test.com","password":"test123"}'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "userId": 2
}
```

#### Test Case 8.2: Login Endpoint
**Request:**
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"api@test.com","password":"test123"}'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 2
}
```

#### Test Case 8.3: Get Opportunities (Protected)
**Request:**
```bash
curl -X GET http://localhost:5000/api/opportunities \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "IT Infrastructure Modernization",
    "agency": "Department of Defense",
    ...
  }
]
```

#### Test Case 8.4: Unauthorized Access
**Request:**
```bash
curl -X GET http://localhost:5000/api/opportunities
```

**Expected Response:**
```json
{
  "error": "Access denied"
}
```

### 9. Security Testing

#### Test Case 9.1: Password Hashing
**Steps:**
1. Register user
2. Check database

**Expected Result:**
- Password is hashed (not plain text)
- Hash starts with $2a$ or $2b$ (bcrypt)

**Verification:**
```sql
SELECT password FROM Users WHERE email = 'test@example.com';
```

#### Test Case 9.2: JWT Token Validation
**Steps:**
1. Login and get token
2. Modify token slightly
3. Try to access protected route

**Expected Result:**
- Error: "Invalid token"
- Access denied

#### Test Case 9.3: SQL Injection Prevention
**Steps:**
1. Try SQL injection in email field:
   - `admin' OR '1'='1`

**Expected Result:**
- No SQL injection
- Treated as literal string

#### Test Case 9.4: XSS Prevention
**Steps:**
1. Try entering script tags in profile:
   - `<script>alert('XSS')</script>`

**Expected Result:**
- Script not executed
- Displayed as text

### 10. Performance Testing

#### Test Case 10.1: Page Load Time
**Steps:**
1. Open DevTools Network tab
2. Load each page
3. Measure load time

**Expected Result:**
- Dashboard: < 2 seconds
- Profile: < 1 second
- Proposal Review: < 2 seconds

#### Test Case 10.2: API Response Time
**Steps:**
1. Monitor API calls in Network tab

**Expected Result:**
- Login: < 500ms
- Get Opportunities: < 200ms
- Generate Proposal: 20-30 seconds (AI processing)

#### Test Case 10.3: Database Query Performance
**Steps:**
1. Check backend logs for query times

**Expected Result:**
- All queries < 100ms
- No N+1 query problems

### 11. Integration Testing

#### Test Case 11.1: End-to-End User Flow
**Steps:**
1. Sign up
2. Login
3. Create profile
4. Generate proposal
5. Edit proposal
6. Download PDF
7. Logout

**Expected Result:**
- All steps complete successfully
- No errors in console
- Data persists correctly

#### Test Case 11.2: Multiple Users
**Steps:**
1. Create 2 users
2. Each creates profile
3. Each generates proposals

**Expected Result:**
- Data isolated per user
- No cross-user data leakage

### 12. Error Handling Testing

#### Test Case 12.1: Network Error
**Steps:**
1. Stop backend server
2. Try to login

**Expected Result:**
- Error message displayed
- No app crash

#### Test Case 12.2: Invalid API Response
**Steps:**
1. Modify backend to return invalid JSON
2. Make API call

**Expected Result:**
- Graceful error handling
- User-friendly message

#### Test Case 12.3: Database Error
**Steps:**
1. Delete database file while app running
2. Try to save profile

**Expected Result:**
- Error caught
- Error message displayed

## Automated Testing (Future)

### Unit Tests
```javascript
// Example: Test password hashing
describe('Authentication', () => {
  test('should hash password', async () => {
    const password = 'test123'
    const hashed = await bcrypt.hash(password, 10)
    expect(hashed).not.toBe(password)
  })
})
```

### Integration Tests
```javascript
// Example: Test login endpoint
describe('POST /api/login', () => {
  test('should return token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'test123' })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })
})
```

### E2E Tests
```javascript
// Example: Test full user flow
describe('User Flow', () => {
  test('should complete signup to proposal generation', async () => {
    // Signup
    await page.goto('http://localhost:3000/signup')
    await page.fill('input[type="email"]', 'e2e@test.com')
    await page.fill('input[type="password"]', 'test123')
    await page.click('button[type="submit"]')
    
    // Login
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', 'e2e@test.com')
    await page.fill('input[type="password"]', 'test123')
    await page.click('button[type="submit"]')
    
    // Verify dashboard
    await expect(page).toHaveURL('http://localhost:3000/')
  })
})
```

## Test Data

### Sample User
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Sample Company Profile
```json
{
  "companyName": "Tech Solutions Inc",
  "naicsCodes": "541512, 541519",
  "coreCapabilities": "Cloud computing, cybersecurity, data analytics",
  "pastPerformance": "Successfully delivered 10+ federal projects"
}
```

## Bug Reporting Template

```
**Bug Title:** [Short description]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Environment:**
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Node Version: 
- App Version: 

**Screenshots:**
[If applicable]

**Console Errors:**
[Copy from browser console]
```

## Testing Tools

- **Browser DevTools**: Network, Console, Application tabs
- **Postman**: API testing
- **SQLite Browser**: Database inspection
- **React DevTools**: Component inspection
- **Lighthouse**: Performance auditing

## Test Coverage Goals

- [ ] 100% of user flows tested
- [ ] All API endpoints tested
- [ ] All error cases handled
- [ ] Security vulnerabilities checked
- [ ] Performance benchmarks met
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness confirmed
