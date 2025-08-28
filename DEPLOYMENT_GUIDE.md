# 🚀 Cloud Deployment Guide for Eco-Auto Backend

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

1. **Sign up at [Railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Deploy with one click**

**Steps:**
```bash
# 1. Push your code to GitHub
git add .
git commit -m "Prepare for cloud deployment"
git push origin main

# 2. Go to Railway.app and:
# - Click "New Project"
# - Select "Deploy from GitHub repo"
# - Choose your repository
# - Railway will auto-detect it's a Node.js app
```

**Environment Variables to set in Railway:**
```
MONGODB_URI=mongodb+srv://your-mongodb-atlas-uri
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com
JWT_SECRET=your-super-secret-key
```

### Option 2: Render

1. **Sign up at [Render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repo**

**Build Command:** `npm install`
**Start Command:** `npm start`

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Create Heroku app**
3. **Deploy**

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create eco-auto-backend

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main
```

## Database Setup

### MongoDB Atlas (Cloud Database)

1. **Sign up at [MongoDB Atlas](https://mongodb.com/atlas)**
2. **Create a free cluster**
3. **Get your connection string**
4. **Add it to your environment variables**

**Connection string format:**
```
mongodb+srv://username:password@cluster.mongodb.net/artgifts_manufacturing?retryWrites=true&w=majority
```

## Frontend Configuration

After deploying the backend, update your frontend API URL:

```javascript
// In frontend/src/services/dashboardApi.js
const API_BASE = import.meta.env.VITE_API_URL || 'https://your-backend-url.railway.app';
```

## Environment Variables Checklist

Make sure to set these in your cloud platform:

- ✅ `MONGODB_URI` - Your MongoDB connection string
- ✅ `NODE_ENV` - Set to "production"
- ✅ `PORT` - Usually auto-set by platform
- ✅ `CORS_ORIGIN` - Your frontend domain
- ✅ `JWT_SECRET` - A secure random string

## Testing Your Deployment

1. **Health Check:** `https://your-backend-url.railway.app/health`
2. **API Test:** `https://your-backend-url.railway.app/api/dashboard/hours`

## Troubleshooting

### Common Issues:
- **CORS errors:** Check CORS_ORIGIN environment variable
- **Database connection:** Verify MONGODB_URI is correct
- **Port issues:** Most platforms auto-set PORT

### Logs:
- Check your platform's logs for errors
- Railway: Dashboard → Your app → Logs
- Render: Dashboard → Your service → Logs
- Heroku: `heroku logs --tail`

## Next Steps

1. Deploy backend to cloud
2. Update frontend API URL
3. Test all dashboard widgets
4. Monitor performance and logs
