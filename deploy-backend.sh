#!/bin/bash

echo "🚀 Eco-Auto Backend Cloud Deployment Script"
echo "============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/your-repo.git"
    exit 1
fi

echo "✅ Git repository found"
echo "📤 Pushing code to GitHub..."

# Push to GitHub
git add .
git commit -m "Prepare for cloud deployment - $(date)"
git push origin main

echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🌐 Next Steps:"
echo "1. Go to https://railway.app"
echo "2. Sign up/Login with GitHub"
echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
echo "4. Select your repository"
echo "5. Add environment variables:"
echo "   - MONGODB_URI (from MongoDB Atlas)"
echo "   - NODE_ENV=production"
echo "   - CORS_ORIGIN (your frontend URL)"
echo ""
echo "🔗 Your backend will be available at: https://your-app-name.railway.app"
echo ""
echo "📊 To test: https://your-app-name.railway.app/health"
