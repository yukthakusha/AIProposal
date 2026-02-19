# Troubleshooting Guide

## Installation Issues

### Problem: npm install fails
**Solution:**
- Ensure Node.js v16+ is installed
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and package-lock.json, then reinstall

### Problem: SQLite installation fails on Windows
**Solution:**
- Install Windows Build Tools: `npm install --global windows-build-tools`
- Or use pre-built binaries: `npm install better-sqlite3 --build-from-source`

## Runtime Issues

### Problem: Backend won't start
**Solution:**
- Check if port 5000 is available
- Verify .env file exists in backend folder
- Check for syntax errors in server.js

### Problem: Frontend won't start
**Solution:**
- Check if port 3000 is available
- Verify all dependencies installed: `cd frontend && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Problem: Database not created
**Solution:**
- Ensure backend folder has write permissions
- Check database.js for errors
- Manually create database: Run backend once to auto-create

## Authentication Issues

### Problem: Login fails with valid credentials
**Solution:**
- Check JWT_SECRET in .env file
- Verify user exists in database
- Check browser console for CORS errors

### Problem: Token expired errors
**Solution:**
- Logout and login again
- Check token expiration settings
- Clear localStorage: `localStorage.clear()`

## API Issues

### Problem: Hugging Face API returns errors
**Solution:**
- Verify HF_API_KEY is correct in .env
- Check API rate limits
- Ensure model name is correct: mistralai/Mistral-7B-Instruct-v0.2
- Wait if model is loading (cold start)

### Problem: CORS errors
**Solution:**
- Ensure backend CORS is configured
- Check frontend API URL matches backend port
- Verify both servers are running

## Frontend Issues

### Problem: Blank page after login
**Solution:**
- Check browser console for errors
- Verify token is stored: `localStorage.getItem('token')`
- Check network tab for failed API calls

### Problem: Opportunities not loading
**Solution:**
- Verify backend is running
- Check database has sample opportunities
- Inspect network requests in browser DevTools

### Problem: Proposal generation fails
**Solution:**
- Ensure company profile is completed
- Check Hugging Face API key is valid
- Verify opportunity ID exists
- Check backend logs for errors

## PDF Download Issues

### Problem: PDF download fails
**Solution:**
- Check jsPDF is installed: `npm list jspdf`
- Verify browser allows downloads
- Check console for jsPDF errors

### Problem: PDF formatting issues
**Solution:**
- Adjust text wrapping in ProposalReview.jsx
- Modify page break logic
- Test with shorter content first

## Database Issues

### Problem: Data not persisting
**Solution:**
- Check database file permissions
- Verify database.js exports correctly
- Ensure transactions complete successfully

### Problem: Duplicate key errors
**Solution:**
- Check for existing records before insert
- Use INSERT OR IGNORE for idempotent operations
- Clear database and restart: Delete govpreneurs.db

## Deployment Issues

### Problem: Environment variables not working
**Solution:**
- Verify .env file location
- Check dotenv is loaded: `dotenv.config()`
- Use platform-specific env var settings (AWS, Vercel, etc.)

### Problem: Build fails
**Solution:**
- Run `npm run build` locally first
- Check for TypeScript errors
- Verify all imports are correct

## Performance Issues

### Problem: Slow proposal generation
**Solution:**
- Hugging Face model may be cold starting (wait 20-30 seconds)
- Check network connection
- Consider caching responses
- Reduce max_new_tokens parameter

### Problem: High memory usage
**Solution:**
- Restart backend server
- Check for memory leaks in long-running processes
- Optimize database queries

## Common Error Messages

### "Access denied"
- Token missing or invalid
- Login again to get new token

### "Email already exists"
- User already registered
- Use different email or login instead

### "Company profile not found"
- Complete profile before generating proposals
- Navigate to /profile and save information

### "Proposal not found"
- Invalid proposal ID
- Proposal may belong to different user

### "Failed to generate proposal"
- Check Hugging Face API status
- Verify API key is valid
- Check backend logs for details

## Getting Help

1. Check browser console for errors
2. Check backend terminal for server errors
3. Review API_DOCUMENTATION.md for correct usage
4. Verify all environment variables are set
5. Test with sample data first

## Debug Mode

Enable detailed logging:

**Backend (server.js):**
```javascript
console.log('Request:', req.body)
console.log('Response:', data)
```

**Frontend (any component):**
```javascript
console.log('State:', state)
console.log('API Response:', response)
```

## Reset Everything

If all else fails:

```bash
# Delete all node_modules
rm -rf node_modules backend/node_modules frontend/node_modules

# Delete database
rm backend/govpreneurs.db

# Delete package locks
rm package-lock.json backend/package-lock.json frontend/package-lock.json

# Reinstall
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Restart
npm run dev
```
