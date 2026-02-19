# Deployment Guide

## AWS Deployment

### Option 1: AWS Elastic Beanstalk (Backend) + S3/CloudFront (Frontend)

#### Backend Deployment

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB**
```bash
cd backend
eb init -p node.js govpreneurs-backend
```

3. **Create Environment**
```bash
eb create govpreneurs-prod
```

4. **Set Environment Variables**
```bash
eb setenv HF_API_KEY=YOUR_HUGGINGFACE_API_KEY
eb setenv JWT_SECRET=govpreneurs_secret_key_2024
```

5. **Deploy**
```bash
eb deploy
```

#### Frontend Deployment

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://govpreneurs-frontend
```

3. **Upload Build**
```bash
aws s3 sync dist/ s3://govpreneurs-frontend --acl public-read
```

4. **Configure CloudFront** (Optional)
- Create CloudFront distribution
- Point to S3 bucket
- Enable HTTPS

5. **Update API URL**
Update frontend code to use EB URL:
```javascript
const API_URL = 'http://your-eb-url.elasticbeanstalk.com/api'
```

### Option 2: AWS Amplify (Full Stack)

1. **Install Amplify CLI**
```bash
npm install -g @aws-amplify/cli
amplify configure
```

2. **Initialize Amplify**
```bash
amplify init
```

3. **Add Hosting**
```bash
amplify add hosting
```

4. **Deploy**
```bash
amplify publish
```

## Vercel Deployment

### Frontend Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy Frontend**
```bash
cd frontend
vercel
```

3. **Set Environment Variables**
In Vercel dashboard:
- Add API_URL pointing to backend

### Backend Deployment

**Option A: Vercel Serverless Functions**

1. Create `api` folder in root
2. Convert Express routes to serverless functions
3. Deploy with `vercel`

**Option B: Separate Service (Railway, Render)**

1. Deploy backend to Railway/Render
2. Update frontend API_URL
3. Set environment variables in platform

## Replit Deployment

### Single Deployment (Recommended)

1. **Import to Replit**
- Go to replit.com
- Click "Create Repl"
- Import from GitHub or upload files

2. **Configure Run Command**
```bash
npm run dev
```

3. **Set Secrets**
In Replit Secrets tab:
- HF_API_KEY
- JWT_SECRET
- PORT

4. **Update Frontend API URL**
```javascript
const API_URL = window.location.origin + '/api'
```

5. **Click Run**

### Replit Configuration File

Create `.replit`:
```toml
run = "npm run dev"
entrypoint = "backend/server.js"

[env]
PORT = "5000"

[nix]
channel = "stable-22_11"

[deployment]
run = ["npm", "run", "dev"]
deploymentTarget = "cloudrun"
```

## Heroku Deployment

### Backend Deployment

1. **Create Heroku App**
```bash
heroku create govpreneurs-backend
```

2. **Set Environment Variables**
```bash
heroku config:set HF_API_KEY=YOUR_HUGGINGFACE_API_KEY
heroku config:set JWT_SECRET=govpreneurs_secret_key_2024
```

3. **Create Procfile**
```
web: node backend/server.js
```

4. **Deploy**
```bash
git push heroku main
```

### Frontend Deployment

Deploy to Vercel or Netlify (see respective sections)

## Netlify Deployment

### Frontend Only

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build Frontend**
```bash
cd frontend
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

4. **Set Environment Variables**
In Netlify dashboard:
- VITE_API_URL = your backend URL

## Railway Deployment

### Full Stack Deployment

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Initialize Project**
```bash
railway init
```

4. **Deploy Backend**
```bash
cd backend
railway up
```

5. **Set Environment Variables**
```bash
railway variables set HF_API_KEY=YOUR_HUGGINGFACE_API_KEY
railway variables set JWT_SECRET=govpreneurs_secret_key_2024
```

6. **Deploy Frontend**
```bash
cd frontend
railway up
```

## Docker Deployment

### Create Dockerfiles

**Backend Dockerfile:**
```dockerfile
FROM node:18
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
EXPOSE 5000
CMD ["node", "server.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18 as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "5000:5000"
    environment:
      - HF_API_KEY=${HF_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend:/app
  
  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend
```

### Deploy
```bash
docker-compose up -d
```

## Production Checklist

### Security
- [ ] Change JWT_SECRET to strong random value
- [ ] Use HTTPS for all connections
- [ ] Enable CORS only for specific domains
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable security headers

### Database
- [ ] Migrate from SQLite to PostgreSQL/MySQL
- [ ] Set up automated backups
- [ ] Implement connection pooling
- [ ] Add database indexes

### Performance
- [ ] Enable gzip compression
- [ ] Implement caching (Redis)
- [ ] Use CDN for static assets
- [ ] Optimize images
- [ ] Minify JavaScript/CSS

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Add logging (Winston, Morgan)
- [ ] Monitor API usage
- [ ] Set up uptime monitoring
- [ ] Configure alerts

### Environment Variables
- [ ] Never commit .env files
- [ ] Use platform-specific secret management
- [ ] Rotate API keys regularly
- [ ] Document all required variables

## Post-Deployment Testing

1. **Test Authentication**
- Register new user
- Login with credentials
- Verify token persistence

2. **Test Core Features**
- Create company profile
- Generate proposal
- Edit proposal sections
- Download PDF

3. **Test API Endpoints**
- All CRUD operations
- Error handling
- Authentication middleware

4. **Performance Testing**
- Load testing with multiple users
- API response times
- Database query performance

5. **Security Testing**
- SQL injection attempts
- XSS attempts
- CSRF protection
- Rate limiting

## Rollback Plan

If deployment fails:

1. **Revert to Previous Version**
```bash
git revert HEAD
git push
```

2. **Restore Database Backup**
```bash
# Platform-specific commands
```

3. **Clear Cache**
```bash
# CDN cache invalidation
```

4. **Notify Users**
- Status page update
- Email notification

## Support

For deployment issues:
1. Check platform-specific logs
2. Verify environment variables
3. Test locally first
4. Review TROUBLESHOOTING.md
5. Contact platform support
