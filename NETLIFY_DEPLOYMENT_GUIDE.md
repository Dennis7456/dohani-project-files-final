# Netlify Deployment Guide for Dohani Medicare Website

This guide will help you deploy the Dohani Medicare website to Netlify with full Hygraph and Mailjet integration.

## 🚀 Quick Deployment Steps

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy from this directory**
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Git Integration

1. **Push to GitHub/GitLab**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Dohani Medicare website with Hygraph integration"
   git branch -M main
   git remote add origin https://github.com/yourusername/dohani-medicare.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Netlify will auto-detect the build settings from `netlify.toml`

## ⚙️ Environment Variables Setup

After deployment, add these environment variables in Netlify Dashboard:

### Go to: Site Settings → Environment Variables

```env
# Hygraph Configuration
VITE_HYGRAPH_ENDPOINT=https://api-[region].hygraph.com/v2/[project-id]/master
VITE_HYGRAPH_TOKEN=your_hygraph_permanent_auth_token

# Mailjet Configuration
VITE_MAILJET_API_KEY=your_mailjet_api_key
VITE_MAILJET_SECRET_KEY=your_mailjet_secret_key
VITE_SENDER_EMAIL=noreply@dohanmedicare.com
VITE_ADMIN_EMAIL=admin@dohanmedicare.com

# OpenAI Configuration (Optional)
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## 📋 Pre-Deployment Checklist

### ✅ **Hygraph Setup**
- [ ] Hygraph project created
- [ ] Content models configured (see `hygraph-schema.md`)
- [ ] Initial content populated
- [ ] API token generated with proper permissions

### ✅ **Mailjet Setup**
- [ ] Mailjet account created
- [ ] Domain authenticated (SPF/DKIM records)
- [ ] API credentials obtained
- [ ] Test email sent successfully

### ✅ **Code Preparation**
- [ ] Build runs successfully (`npm run build`)
- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Serverless functions tested locally

## 🔧 Build Configuration

The `netlify.toml` file is already configured with:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[functions]
  directory = "api"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🧪 Testing After Deployment

### 1. **Test Website Loading**
- Visit your Netlify URL
- Check that all sections load properly
- Verify images and assets are working

### 2. **Test Contact Form**
- Fill out the contact form
- Check for success message
- Verify emails are received (admin + user confirmation)

### 3. **Test Dynamic Content**
- Verify contact information displays correctly
- Check that services load from Hygraph
- Test any dynamic content updates

### 4. **Test Serverless Functions**
- Check Netlify Functions logs for any errors
- Test form submission endpoint directly
- Verify Hygraph integration is working

## 🔍 Troubleshooting

### Common Issues and Solutions

**Build Fails**
```bash
# Check build logs in Netlify dashboard
# Common fixes:
- Ensure all dependencies are in package.json
- Check for syntax errors in code
- Verify environment variables are set
```

**Serverless Functions Not Working**
```bash
# Check function logs in Netlify dashboard
# Common fixes:
- Verify environment variables are set correctly
- Check function syntax (CommonJS format required)
- Ensure API endpoints match frontend calls
```

**Hygraph Connection Issues**
```bash
# Verify in browser console:
- Check GraphQL endpoint URL
- Verify API token permissions
- Check CORS settings in Hygraph
```

**Email Not Sending**
```bash
# Check Mailjet dashboard:
- Verify API credentials
- Check domain authentication status
- Review bounce/complaint rates
```

## 📊 Monitoring and Analytics

### Netlify Analytics
- Enable Netlify Analytics in site settings
- Monitor page views and performance
- Track form submissions and function calls

### Function Logs
- Monitor serverless function execution
- Check for errors in real-time
- Set up alerts for critical failures

### Hygraph Analytics
- Monitor API usage in Hygraph dashboard
- Track content updates and queries
- Review performance metrics

## 🚀 Post-Deployment Steps

### 1. **Custom Domain Setup**
- Add your custom domain in Netlify
- Configure DNS records
- Enable HTTPS (automatic with Netlify)

### 2. **Performance Optimization**
- Enable asset optimization in Netlify
- Configure caching headers
- Monitor Core Web Vitals

### 3. **Security**
- Review and configure security headers
- Set up form spam protection
- Monitor for security issues

### 4. **Backup Strategy**
- Regular Hygraph content backups
- Code repository backups
- Environment variables documentation

## 📈 Scaling Considerations

### Traffic Growth
- Netlify automatically scales with traffic
- Monitor bandwidth usage
- Consider upgrading plan if needed

### Content Growth
- Monitor Hygraph API limits
- Plan for content model expansions
- Consider CDN optimization for media

### Email Volume
- Monitor Mailjet usage limits
- Plan for email volume growth
- Consider dedicated IP for high volume

## 🎯 Success Metrics

After deployment, monitor these key metrics:

- **Website Performance**: Page load times, Core Web Vitals
- **Form Submissions**: Conversion rates, error rates
- **Email Delivery**: Delivery rates, bounce rates
- **Content Updates**: CMS usage, content freshness
- **User Engagement**: Page views, session duration

## 📞 Support Resources

- **Netlify Support**: [docs.netlify.com](https://docs.netlify.com)
- **Hygraph Support**: [docs.hygraph.com](https://docs.hygraph.com)
- **Mailjet Support**: [mailjet.com/support](https://mailjet.com/support)

## 🎉 Deployment Complete!

Once deployed successfully, your Dohani Medicare website will have:

✅ **Modern Healthcare Website**: Professional, responsive design
✅ **Content Management**: Easy updates via Hygraph dashboard
✅ **Contact Forms**: Working form submissions with email notifications
✅ **AI Chatbot**: Integrated chatbot with backend logging
✅ **Scalable Infrastructure**: Serverless architecture that scales automatically
✅ **Professional Emails**: Branded email templates via Mailjet

Your website is now ready to serve patients and provide excellent healthcare information and services!