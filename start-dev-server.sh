#!/bin/bash

# Script to start the development server
echo "Starting Eco-Auto App Development Server..."
echo "=========================================="

# Navigate to frontend directory
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the development server
echo "Starting development server on port 5173..."
echo "Access the application at: http://localhost:5173"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm run dev