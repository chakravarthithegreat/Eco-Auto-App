#!/bin/bash

# Eco-Auto App - Netlify Deployment Script
echo "🚀 Starting Netlify deployment..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Ready for Netlify deployment!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to https://netlify.com"
    echo "2. Drag and drop the 'frontend/dist' folder"
    echo "3. Or connect your GitHub repository"
    echo "4. Set environment variables:"
    echo "   - MONGODB_URI=your_mongodb_atlas_connection_string"
    echo "   - NODE_ENV=production"
    echo ""
    echo "📁 Build output: frontend/dist/"
else
    echo "❌ Build failed!"
    exit 1
fi
