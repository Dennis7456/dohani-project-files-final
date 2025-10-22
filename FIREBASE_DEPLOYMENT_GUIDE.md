# Firebase Deployment Guide for Dohani Medicare Website

This guide will help you deploy the Dohani Medicare website frontend to Firebase Hosting.

## 🚀 Quick Deployment Steps

### Prerequisites
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Firebase account (free tier is sufficient)
- Built project (`npm run build` completed)

### Step 1: Firebase Login
```bash
firebase login
```
This will open your browser to authenticate with your Google account.

### Step 2: Initialize Firebase Project
```bash
firebase init hosting
```

**Configuration Options:**
- **Use an existing project or create a new one**: Choose "Create a new project"
- **Project ID**: `dohani-medicare` (or your preferred unique ID)
- **Public directory**: `dist` (already configured)
- **Single-page app**: `Yes`
- **Set up automatic builds**: `No` (we'll deploy manually)
- **Overwrite index.html**: `No`

### Step 3: Build the Project
```bash
npm run build
```

### Step 4: Deploy to Firebase
```bash
firebase deploy
```

## 📋 Configuration Files

### firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### .firebaserc
```json
{
  "projects": {
    "default": "dohani-medicare"
  }
}
```

## 🔧 Environment Variables Setup

Since Firebase Hosting only serves static files, environment variables need to be built into the application at build time.

### For Production Deployment:

1. **Update .env for production:**
```env
# Hygraph Configuration (Production)
VITE_HYGRAPH_ENDPOINT=https://api-[region].hygraph.com/v2/[project-id]/master
VITE_HYGRAPH_TOKEN=your_production_hygraph_token

# Mailjet Configuration (Production)
VITE_MAILJET_API_KEY=your_production_mailjet_api_key
VITE_MAILJET_SECRET_KEY=your_production_mailjet_secret_key
VITE_SENDER_EMAIL=noreply@dohanmedicare.com
VITE_ADMIN_EMAIL=dohanimedicare@gmail.com

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

2. **Build with production environment:**
```bash
npm run build
```

## 🌐 Custom Domain Setup

### Step 1: Add Custom Domain in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Hosting → Add custom domain
4. Enter your domain (e.g., `dohanmedicare.com`)

### Step 2: Configure DNS Records
Add these DNS records in your domain provider:

**For root domain (dohanmedicare.com):**
```
Type: A
Name: @
Value: 151.101.1.195
Value: 151.101.65.195
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: dohani-medicare.web.app
```

### Step 3: SSL Certificate
Firebase automatically provisions SSL certificates for custom domains.

## 📊 Deployment Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "deploy": "npm run build && firebase deploy",
    "deploy:hosting": "firebase deploy --only hosting",
    "preview": "firebase hosting:channel:deploy preview"
  }
}
```

## 🔄 Continuous Deployment with GitHub Actions

Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build
        env:
          VITE_HYGRAPH_ENDPOINT: ${{ secrets.VITE_HYGRAPH_ENDPOINT }}
          VITE_HYGRAPH_TOKEN: ${{ secrets.VITE_HYGRAPH_TOKEN }}
          VITE_MAILJET_API_KEY: ${{ secrets.VITE_MAILJET_API_KEY }}
          VITE_MAILJET_SECRET_KEY: ${{ secrets.VITE_MAILJET_SECRET_KEY }}
          VITE_SENDER_EMAIL: ${{ secrets.VITE_SENDER_EMAIL }}
          VITE_ADMIN_EMAIL: ${{ secrets.VITE_ADMIN_EMAIL }}
          VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: dohani-medicare
```

## 🛠️ Backend Integration

Since Firebase Hosting only serves static files, you'll need to handle the serverless functions separately:

### Option 1: Keep Netlify Functions
- Deploy frontend to Firebase
- Keep serverless functions on Netlify
- Update API endpoints in your code

### Option 2: Firebase Functions
- Migrate serverless functions to Firebase Functions
- Update function structure for Firebase
- Deploy both frontend and backend to Firebase

### Option 3: External API Service
- Deploy functions to Vercel, Railway, or similar
- Update API base URL in environment variables

## 📈 Performance Optimization

Firebase Hosting includes:
- **Global CDN**: Automatic worldwide distribution
- **HTTP/2**: Faster loading with multiplexing
- **Gzip Compression**: Automatic compression
- **Caching**: Optimized caching headers (configured in firebase.json)

## 🔍 Monitoring and Analytics

### Firebase Analytics Integration
Add to your `index.html`:
```html
<!-- Firebase Analytics -->
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js"></script>
<script>
  const firebaseConfig = {
    // Your config
  };
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
</script>
```

## 🚨 Troubleshooting

### Common Issues:

**Build Fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Deployment Fails:**
```bash
# Check Firebase CLI version
firebase --version

# Re-authenticate
firebase logout
firebase login
```

**Environment Variables Not Working:**
- Ensure all VITE_ prefixed variables are set
- Rebuild after changing environment variables
- Check browser console for undefined variables

**404 Errors:**
- Verify `rewrites` configuration in firebase.json
- Ensure SPA routing is properly configured

## 📞 Support Resources

- **Firebase Documentation**: [firebase.google.com/docs/hosting](https://firebase.google.com/docs/hosting)
- **Firebase Console**: [console.firebase.google.com](https://console.firebase.google.com)
- **Firebase CLI Reference**: [firebase.google.com/docs/cli](https://firebase.google.com/docs/cli)

## 🎯 Post-Deployment Checklist

After successful deployment:

- [ ] Test all pages and functionality
- [ ] Verify appointment booking works
- [ ] Check admin panel access
- [ ] Test contact forms
- [ ] Verify chatbot functionality
- [ ] Check mobile responsiveness
- [ ] Test custom domain (if configured)
- [ ] Monitor performance metrics
- [ ] Set up analytics tracking

Your Dohani Medicare website will be live at:
- **Firebase URL**: `https://dohani-medicare.web.app`
- **Custom Domain**: `https://dohanmedicare.com` (if configured)

## 🔄 Future Updates

To update your deployed site:
```bash
npm run build
firebase deploy
```

Or use the combined script:
```bash
npm run deploy
```

Your healthcare website is now ready for professional deployment on Firebase! 🏥✨