# Netlify Deployment Guide

This guide will help you deploy the Eco-Auto App to Netlify with serverless functions.

## 🚀 Quick Deploy

### Option 1: Deploy from GitHub (Recommended)

1. **Fork/Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd Eco-Auto-app
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "New site from Git"
   - Choose your repository

3. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: frontend/dist
   Base directory: frontend
   ```

4. **Set Environment Variables**
   In Netlify dashboard → Site settings → Environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your app will be live at `https://your-site.netlify.app`

### Option 2: Manual Deploy

1. **Build the Project**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `frontend/dist` folder
   - Set up environment variables in dashboard

## 🔧 Configuration

### Netlify Functions

The API functions are automatically deployed from `frontend/netlify/functions/`.

**Available Endpoints:**
- `/.netlify/functions/api/health` - Health check
- `/.netlify/functions/api/employees` - Employee management
- `/.netlify/functions/api/attendance` - Attendance tracking
- `/.netlify/functions/api/tasks` - Task management
- `/.netlify/functions/api/auth/*` - Authentication
- `/.netlify/functions/api/dashboard/*` - Dashboard data

### Environment Variables

**Required:**
- `MONGODB_URI` - Your MongoDB Atlas connection string

**Optional:**
- `NODE_ENV` - Set to "production"
- `JWT_SECRET` - For enhanced authentication security

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create free account

2. **Create Cluster**
   - Choose free tier (M0)
   - Select cloud provider and region
   - Create cluster

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Add to Netlify**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add `MONGODB_URI` with your connection string

## 📱 Testing Your Deployment

### Health Check
```bash
curl https://your-site.netlify.app/.netlify/functions/api/health
```

### Test API Endpoints
```bash
# Get employees
curl https://your-site.netlify.app/.netlify/functions/api/employees

# Create test employee
curl -X POST https://your-site.netlify.app/.netlify/functions/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phoneNumber":"1234567890","department":"IT","position":"Developer","hireDate":"2024-01-01","salary":50000}'
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check build logs in Netlify dashboard

2. **Functions Not Working**
   - Verify environment variables are set
   - Check function logs in Netlify dashboard
   - Ensure MongoDB connection string is correct

3. **CORS Errors**
   - Functions already have CORS configured
   - Check if you're calling the correct URL

4. **Database Connection Issues**
   - Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for all IPs)
   - Check connection string format
   - Ensure database user has proper permissions

### Debugging

1. **Check Function Logs**
   - Go to Netlify dashboard
   - Functions tab → View function logs

2. **Test Locally**
   ```bash
   cd frontend
   npm run dev
   # Test API at http://localhost:5173/.netlify/functions/api/health
   ```

3. **Environment Variables**
   - Verify all variables are set correctly
   - Check for typos in variable names

## 🚀 Performance Optimization

### Netlify Optimizations

1. **Asset Caching**
   - Static assets are automatically cached
   - Configured in `netlify.toml`

2. **Function Optimization**
   - Keep functions lightweight
   - Use connection pooling for database
   - Implement proper error handling

3. **CDN Benefits**
   - Global CDN for static assets
   - Automatic compression
   - Edge caching

## 📊 Monitoring

### Netlify Analytics
- View site analytics in Netlify dashboard
- Monitor function invocations
- Track performance metrics

### Function Monitoring
- Check function execution times
- Monitor error rates
- View cold start performance

## 🔒 Security

### Best Practices
1. **Environment Variables**
   - Never commit sensitive data
   - Use Netlify's environment variable system

2. **Database Security**
   - Use MongoDB Atlas security features
   - Implement proper authentication
   - Regular security updates

3. **API Security**
   - Input validation in functions
   - Rate limiting (implemented)
   - CORS configuration

## 📞 Support

If you encounter issues:
1. Check Netlify documentation
2. Review function logs
3. Test locally first
4. Create detailed issue reports

---

**Your app is now ready for production! 🎉**
