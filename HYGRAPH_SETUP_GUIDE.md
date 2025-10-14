# Hygraph Migration Setup Guide

This guide will walk you through setting up Hygraph and Mailjet to replace the Flask backend for the Dohani Medicare website.

## 🚀 Quick Start Summary

The migration includes:
- ✅ **GraphQL Client**: Apollo Client configured and integrated
- ✅ **Serverless Functions**: Contact form and chatbot notification handlers
- ✅ **Email Integration**: Mailjet templates for admin notifications and user confirmations
- ✅ **Dynamic Content**: Contact info and services now pull from Hygraph
- ✅ **Form Handling**: Real-time form submission with success/error states

## 📋 Prerequisites

1. **Hygraph Account**: Sign up at [hygraph.com](https://hygraph.com)
2. **Mailjet Account**: Sign up at [mailjet.com](https://mailjet.com)
3. **Deployment Platform**: Vercel, Netlify, or similar for serverless functions

## 🔧 Step 1: Hygraph Setup

### 1.1 Create Project
1. Go to [Hygraph Dashboard](https://app.hygraph.com)
2. Click "Create Project"
3. Choose "Professional" plan for production
4. Select region closest to your users
5. Name your project "Dohani Medicare CMS"

### 1.2 Create Content Models
Use the schema definitions in `hygraph-schema.md` to create these models:

1. **MedicalService** - For managing medical services
2. **ContactInfo** - For contact information (singleton)
3. **WorkingHours** - For operating hours (singleton)
4. **Message** - For storing patient inquiries
5. **NewsArticle** - For blog posts and news
6. **Doctor** - For doctor profiles

### 1.3 Configure API Access
1. Go to Settings → API Access
2. Create a "Permanent Auth Token"
3. Grant these permissions:
   - **Read**: All content models
   - **Create**: Messages only
   - **Update/Delete**: Admin only
4. Copy the token for environment variables

### 1.4 Populate Initial Content
Create initial records for:
- **ContactInfo**: One record with phone, email, location
- **WorkingHours**: One record with all department hours
- **MedicalServices**: Create 5-6 services with descriptions and keywords

## 📧 Step 2: Mailjet Setup

### 2.1 Create Account
1. Sign up at [Mailjet](https://mailjet.com)
2. Verify your email address
3. Complete account setup

### 2.2 Domain Authentication
1. Go to Account Settings → Sender domains & addresses
2. Add your domain (e.g., `dohanmedicare.com`)
3. Configure SPF and DKIM records in your DNS:
   ```
   SPF: v=spf1 include:spf.mailjet.com ?all
   DKIM: Add the provided DKIM key
   ```

### 2.3 Get API Credentials
1. Go to Account Settings → REST API
2. Copy your API Key and Secret Key
3. These will be used in environment variables

## ⚙️ Step 3: Environment Configuration

Update your `.env` file with the following variables:

```env
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Hygraph Configuration
VITE_HYGRAPH_ENDPOINT=https://api-[region].hygraph.com/v2/[project-id]/master
VITE_HYGRAPH_TOKEN=your_hygraph_permanent_auth_token

# Mailjet Configuration
VITE_MAILJET_API_KEY=your_mailjet_api_key
VITE_MAILJET_SECRET_KEY=your_mailjet_secret_key
VITE_SENDER_EMAIL=noreply@dohanmedicare.com
VITE_ADMIN_EMAIL=admin@dohanmedicare.com
```

## 🚀 Step 4: Deployment

### 4.1 Vercel Deployment (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts to deploy
4. Add environment variables in Vercel dashboard

### 4.2 Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## 🧪 Step 5: Testing

### 5.1 Test GraphQL Connection
1. Start development server: `npm run dev`
2. Open browser console
3. Check for GraphQL errors in Network tab
4. Verify content loads from Hygraph

### 5.2 Test Contact Form
1. Fill out the contact form on the website
2. Check that message appears in Hygraph dashboard
3. Verify admin notification email is received
4. Confirm user receives confirmation email

### 5.3 Test Chatbot Integration
The chatbot will automatically use the new notification system when deployed.

## 📊 Step 6: Content Management

### 6.1 Managing Services
1. Go to Hygraph dashboard
2. Navigate to "Content" → "Medical Services"
3. Add, edit, or delete services as needed
4. Changes appear on website immediately

### 6.2 Updating Contact Information
1. Go to "Content" → "Contact Infos"
2. Edit the single contact record
3. Update phone, email, or location
4. Changes reflect across the entire website

### 6.3 Managing Messages
1. Go to "Content" → "Messages"
2. View all patient inquiries
3. Update status from UNREAD to READ
4. Filter by source (WEBSITE or CHATBOT)

## 🔄 Step 7: Migration from Flask

### 7.1 Gradual Migration
1. Keep Flask backend running initially
2. Test Hygraph integration thoroughly
3. Update DNS/routing when ready
4. Monitor for any issues

### 7.2 Data Migration
If you have existing data in Flask:
1. Export data from JSON files
2. Use Hygraph's bulk import or API
3. Verify data integrity
4. Update any references

## 🛠️ Troubleshooting

### Common Issues

**GraphQL Errors**
- Check endpoint URL and token
- Verify content model names match queries
- Ensure proper permissions are set

**Email Not Sending**
- Verify Mailjet API credentials
- Check domain authentication status
- Review email templates for errors

**Form Submission Fails**
- Check serverless function logs
- Verify environment variables
- Test API endpoints directly

### Getting Help

1. **Hygraph Support**: [docs.hygraph.com](https://docs.hygraph.com)
2. **Mailjet Support**: [mailjet.com/support](https://mailjet.com/support)
3. **Deployment Issues**: Check platform-specific documentation

## 📈 Benefits Achieved

✅ **No Backend Maintenance**: Eliminated server management overhead
✅ **Better Content Management**: Rich editor and media management
✅ **Improved Performance**: Global CDN and optimized queries
✅ **Enhanced Security**: Built-in authentication and permissions
✅ **Scalability**: Automatic scaling based on usage
✅ **Cost Efficiency**: Pay-as-you-use pricing model

## 🎯 Next Steps

After successful migration, consider:
1. **News/Blog System**: Implement the news article functionality
2. **Doctor Profiles**: Add comprehensive doctor management
3. **Appointment System**: Build on the foundation for booking
4. **Analytics**: Add content performance tracking
5. **Multi-language**: Leverage Hygraph's localization features

## 📞 Support

For technical support with this migration:
- Review the implementation in `src/` directory
- Check serverless functions in `api/` directory
- Refer to GraphQL queries in `src/graphql/`
- Test with the provided fallback data

The migration provides a solid foundation for future enhancements while significantly reducing maintenance overhead.