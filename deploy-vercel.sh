#!/bin/bash

echo "🚀 Eco-Auto Backend Vercel Deployment Script"
echo "============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

echo "✅ Git repository found"
echo "📤 Pushing code to GitHub..."

# Push to GitHub
git add .
git commit -m "Prepare for Vercel deployment - $(date)"
git push origin main

echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🌐 Next Steps for Vercel Deployment:"
echo ""
echo "1. 📱 Install Vercel CLI (if not already installed):"
echo "   npm install -g vercel"
echo ""
echo "2. 🔐 Login to Vercel:"
echo "   vercel login"
echo ""
echo "3. 🚀 Deploy to Vercel:"
echo "   vercel"
echo ""
echo "4. ⚙️  Set Environment Variables in Vercel Dashboard:"
echo "   - Go to your project dashboard"
echo "   - Click 'Settings' → 'Environment Variables'"
echo "   - Add these variables:"
echo "     MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/artgifts_manufacturing"
echo "     NODE_ENV=production"
echo "     CORS_ORIGIN=https://your-frontend-domain.com"
echo "     JWT_SECRET=your-super-secret-key"
echo ""
echo "5. 🔄 Redeploy after setting environment variables:"
echo "   vercel --prod"
echo ""
echo "🔗 Your backend will be available at: https://your-app-name.vercel.app"
echo ""
echo "📊 To test: https://your-app-name.vercel.app/health"
