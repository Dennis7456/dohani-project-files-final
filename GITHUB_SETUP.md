# GitHub Repository Setup

## 📋 Steps to Create GitHub Repository and Push Code

### 1. Create Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `dohani-medicare-website`
   - **Description**: `Modern healthcare website for Dohani Medicare with Hygraph CMS and AI chatbot integration`
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### 2. Push Your Local Code

After creating the repository, GitHub will show you the commands. Use these:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/dohani-medicare-website.git

# Push the code
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 3. Verify Upload

After pushing, you should see all your files in the GitHub repository, including:
- ✅ Source code (`src/` directory)
- ✅ Serverless functions (`api/` directory) 
- ✅ Configuration files (`netlify.toml`, `package.json`, etc.)
- ✅ Documentation (`README.md`, setup guides)
- ✅ Hygraph migration specs (`.kiro/specs/`)

## 🚀 Next Steps After GitHub Push

### Option 1: Deploy via Netlify Dashboard
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "New site from Git"
3. Choose "GitHub" as your Git provider
4. Select your `dohani-medicare-website` repository
5. Netlify will auto-detect build settings from `netlify.toml`
6. Click "Deploy site"

### Option 2: Deploy via Netlify CLI
```bash
# Link to your GitHub repository
netlify init

# Deploy to production
netlify deploy --prod
```

## ⚙️ Environment Variables Setup

After deployment, add these environment variables in Netlify:

**Site Settings → Environment Variables**

```env
VITE_HYGRAPH_ENDPOINT=https://api-[region].hygraph.com/v2/[project-id]/master
VITE_HYGRAPH_TOKEN=your_hygraph_permanent_auth_token
VITE_MAILJET_API_KEY=your_mailjet_api_key
VITE_MAILJET_SECRET_KEY=your_mailjet_secret_key
VITE_SENDER_EMAIL=noreply@dohanmedicare.com
VITE_ADMIN_EMAIL=admin@dohanmedicare.com
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## 📊 Repository Structure

Your GitHub repository will contain:

```
dohani-medicare-website/
├── 📁 .kiro/specs/hygraph-migration/    # Migration specifications
├── 📁 api/                              # Netlify serverless functions
├── 📁 backend/                          # Legacy Flask backend (for reference)
├── 📁 src/                              # React application source
│   ├── 📁 assets/                       # Images and media files
│   ├── 📁 components/                   # React components
│   ├── 📁 graphql/                      # GraphQL queries and mutations
│   ├── 📁 hooks/                        # Custom React hooks
│   └── 📁 lib/                          # Utility libraries
├── 📄 netlify.toml                      # Netlify configuration
├── 📄 package.json                      # Node.js dependencies
├── 📄 README.md                         # Project documentation
├── 📄 HYGRAPH_SETUP_GUIDE.md          # Hygraph setup instructions
├── 📄 NETLIFY_DEPLOYMENT_GUIDE.md     # Deployment instructions
└── 📄 hygraph-schema.md                # Content model definitions
```

## 🔒 Security Notes

- ✅ `.env` file is in `.gitignore` (secrets not exposed)
- ✅ Environment variables will be set in Netlify dashboard
- ✅ API keys and tokens remain secure
- ✅ Only public configuration is in the repository

## 🎯 What's Included

Your repository contains a complete, production-ready healthcare website with:

- **Modern React Frontend**: Built with Vite and Tailwind CSS
- **Hygraph CMS Integration**: GraphQL-based content management
- **Mailjet Email Service**: Professional email templates and delivery
- **Netlify Serverless Functions**: Contact form and chatbot handlers
- **AI Chatbot Integration**: OpenAI-powered patient assistance
- **Responsive Design**: Works on all devices
- **Professional Documentation**: Complete setup and deployment guides

## 📞 Support

If you encounter any issues:
1. Check the deployment guides in the repository
2. Review Netlify build logs for errors
3. Verify environment variables are set correctly
4. Test Hygraph and Mailjet integrations separately

Your healthcare website is ready for professional deployment! 🏥✨