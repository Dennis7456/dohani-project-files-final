#!/bin/bash

echo "🚀 Deploying Dohani Medicare Website to Firebase Hosting"
echo "=================================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in
echo "🔐 Checking Firebase authentication..."
firebase login --no-localhost

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to Firebase
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "Your website is now live at:"
    echo "https://dohani-medicare-website.web.app"
    echo "https://dohani-medicare-website.firebaseapp.com"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi