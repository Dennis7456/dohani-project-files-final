#!/bin/bash

# Deploy script with environment variables for Dohani Medicare Website
# This script builds the project with environment variables and deploys to Firebase

echo "🚀 Starting deployment process for Dohani Medicare Website..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your actual values and run this script again."
    exit 1
fi

# Load environment variables
echo "📋 Loading environment variables..."
source .env

# Validate required environment variables
if [ -z "$VITE_HYGRAPH_ENDPOINT" ] || [ -z "$VITE_HYGRAPH_TOKEN" ]; then
    echo "❌ Required environment variables missing:"
    echo "   - VITE_HYGRAPH_ENDPOINT"
    echo "   - VITE_HYGRAPH_TOKEN"
    echo "📝 Please update your .env file with the correct values."
    exit 1
fi

echo "✅ Environment variables loaded successfully"

# Build the project
echo "🔨 Building project for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "🌐 Your website is live at: https://dohani-medicare-560e6.web.app"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Test all functionality on the live site"
    echo "   2. Verify CMS data is loading correctly"
    echo "   3. Test contact form and appointment booking"
    echo "   4. Check ChatBot functionality"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi