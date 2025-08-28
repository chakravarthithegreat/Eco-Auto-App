# 🚀 Vercel Deployment Guide for Eco-Auto Backend

## Prerequisites

- ✅ Vercel CLI installed
- ✅ GitHub repository set up
- ✅ MongoDB Atlas database ready
- ✅ Node.js project structure

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate with Vercel.

## Step 3: Prepare Your Project

Make sure your project structure is correct:

```
Eco-Auto-app/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── models/
│   ├── routes/
│   └── ...
├── frontend/
├── vercel.json
└── ...
```

## Step 4: Deploy to Vercel

### Option A: Using the Deployment Script

```bash
./deploy-vercel.sh
```

### Option B: Manual Deployment

```bash
# Push your code to GitHub first
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main

# Deploy to Vercel
vercel
```

## Step 5: Configure Environment Variables

1. **Go to your Vercel Dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add these variables:**

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/artgifts_manufacturing?retryWrites=true&w=majority
NODE_ENV=production
CORS_ORIGIN=http://localhost:5173,https://your-frontend-domain.com
JWT_SECRET=your-super-secret-jwt-key-change-this
```

## Step 6: Redeploy with Environment Variables

```bash
vercel --prod
```

## Step 7: Test Your Deployment

Visit your deployment URL:
- **Health Check:** `https://your-app.vercel.app/health`
- **API Test:** `https://your-app.vercel.app/api/dashboard/hours`

## Step 8: Update Frontend API URL

Update your frontend to use the Vercel backend:

```javascript
// In frontend/src/services/dashboardApi.js
const API_BASE = import.meta.env.VITE_API_URL || 'https://your-app.vercel.app';
```

## Vercel-Specific Configuration

### vercel.json Explained

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "backend/server.js": {
      "maxDuration": 30
    }
  }
}
```

- **builds**: Tells Vercel to build the Node.js server
- **routes**: Routes all requests to your server.js
- **env**: Sets default environment variables
- **functions**: Configures serverless function settings

## Troubleshooting

### Common Issues:

1. **Build Errors**
   - Check that all dependencies are in `package.json`
   - Ensure `backend/package.json` exists

2. **Environment Variables Not Working**
   - Redeploy after setting environment variables: `vercel --prod`
   - Check variable names are correct

3. **CORS Errors**
   - Update `CORS_ORIGIN` to include your frontend domain
   - Add `http://localhost:5173` for local development

4. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings in MongoDB Atlas

### Useful Commands:

```bash
# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel remove

# View project info
vercel inspect
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `NODE_ENV` | Environment mode | `production` |
| `CORS_ORIGIN` | Allowed frontend domains | `http://localhost:5173,https://your-app.com` |
| `JWT_SECRET` | JWT signing secret | `your-super-secret-key` |

## Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Set environment variables
3. ✅ Test API endpoints
4. ✅ Update frontend API URL
5. ✅ Test dashboard widgets
6. ✅ Monitor performance

## Support

- **Vercel Documentation:** https://vercel.com/docs
- **Vercel CLI Reference:** https://vercel.com/docs/cli
- **MongoDB Atlas Setup:** See `MONGODB_SETUP.md`
