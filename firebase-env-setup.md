# Firebase Environment Variables Setup

## Important Note
Firebase Hosting serves static files, so environment variables must be set at **build time**, not runtime. The environment variables are embedded into the JavaScript bundle during the build process.

## Required Environment Variables

### 1. Hygraph CMS Configuration (Required)
```bash
VITE_HYGRAPH_ENDPOINT=https://us-west-2.cdn.hygraph.com/content/cmgr5l0iu00pf07wf9zpyrn3d/master
VITE_HYGRAPH_TOKEN=your_hygraph_token_here
```

### 2. OpenAI API (Optional - for ChatBot)
```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Email Service (Optional - for contact form)
```bash
VITE_MAILJET_API_KEY=your_mailjet_api_key
VITE_MAILJET_SECRET_KEY=your_mailjet_secret_key
VITE_SENDER_EMAIL=noreply@dohanimedicare.com
VITE_ADMIN_EMAIL=admin@dohanimedicare.com
```

## Setup Methods

### Method 1: Local .env File (Recommended for Development)
1. Copy `.env.example` to `.env`
2. Fill in your actual values
3. Run `npm run build` to build with environment variables
4. Run `firebase deploy` to deploy

### Method 2: GitHub Actions (Recommended for Production)
Set up environment variables in GitHub repository secrets:
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add the following repository secrets:
   - `VITE_HYGRAPH_ENDPOINT`
   - `VITE_HYGRAPH_TOKEN`
   - `VITE_OPENAI_API_KEY` (optional)
   - `VITE_MAILJET_API_KEY` (optional)
   - `VITE_MAILJET_SECRET_KEY` (optional)
   - `VITE_SENDER_EMAIL` (optional)
   - `VITE_ADMIN_EMAIL` (optional)

### Method 3: Firebase CLI with Environment Variables
```bash
# Set environment variables before building
export VITE_HYGRAPH_ENDPOINT="your_endpoint"
export VITE_HYGRAPH_TOKEN="your_token"
export VITE_OPENAI_API_KEY="your_openai_key"

# Build and deploy
npm run build
firebase deploy
```

## Current Status
✅ Website deployed successfully to: https://dohani-medicare-560e6.web.app
⚠️ Environment variables need to be configured for full functionality

## Next Steps
1. Set up your environment variables using one of the methods above
2. Rebuild and redeploy: `npm run build && firebase deploy`
3. Test all functionality including:
   - CMS data loading
   - Contact form submission
   - Appointment booking
   - ChatBot functionality

## Security Notes
- Never commit `.env` files to Git (already in .gitignore)
- Use GitHub Secrets for production deployments
- Rotate API tokens regularly
- Monitor API usage and costs