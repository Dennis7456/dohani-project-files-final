# Contact Form Setup Guide

This guide explains how to set up the contact form system that records messages in Hygraph CMS and sends email notifications.

## Overview

The contact form system:
1. **Records messages** in Hygraph CMS for staff to review
2. **Sends notifications** to staff emails when new messages arrive
3. **Sends confirmations** to users acknowledging their message was received
4. **Uses Netlify Functions** for serverless backend processing

## Prerequisites

- Hygraph CMS project with proper permissions
- Email service account (SendGrid recommended)
- Netlify deployment (for serverless functions)

## Step 1: Set Up Hygraph CMS Model

### Option A: Automatic Setup (Recommended)

Run the setup script to test if the ContactMessage model exists:

```bash
npm run setup-contact-messages
```

### Option B: Manual Setup

If the script fails, manually create the ContactMessage model in Hygraph:

1. Go to your Hygraph project dashboard
2. Navigate to **Schema → Models**
3. Click **Add Model** and name it `ContactMessage`
4. Add these fields:

| Field Name | Type | Settings |
|------------|------|----------|
| `name` | String | Required |
| `email` | String | Required |
| `message` | String | Required, Multiline |
| `status` | String | Required, Default: "NEW" |

5. **Save and Publish** the schema
6. Run `npm run setup-contact-messages` to verify

## Step 2: Configure Email Service

### Using SendGrid (Recommended)

1. **Create SendGrid Account**
   - Go to [SendGrid](https://sendgrid.com/)
   - Sign up for a free account (100 emails/day free)

2. **Get API Key**
   - Go to Settings → API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the API key

3. **Verify Sender Domain** (Important!)
   - Go to Settings → Sender Authentication
   - Verify your domain (e.g., `dohanimedicare.com`)
   - Or use Single Sender Verification for testing

### Alternative Email Services

You can also use:
- **Mailgun**: Update the `sendEmail` function in `netlify/functions/submit-message.js`
- **AWS SES**: Modify the email sending logic
- **Postmark**: Change the API endpoint and headers

## Step 3: Environment Variables

Add these variables to your `.env` file:

```env
# Email service configuration
EMAIL_SERVICE_API_KEY=your_sendgrid_api_key_here
STAFF_EMAILS=staff1@dohanimedicare.com,staff2@dohanimedicare.com,admin@dohanimedicare.com
```

### For Netlify Deployment

Add the same environment variables in your Netlify dashboard:
1. Go to Site Settings → Environment Variables
2. Add `EMAIL_SERVICE_API_KEY`
3. Add `STAFF_EMAILS`
4. Add your existing `VITE_HYGRAPH_TOKEN`

## Step 4: Deploy to Netlify

### Option A: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Option B: Git Integration

1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in site settings

## Step 5: Test the System

1. **Test locally** (if using Netlify Dev):
   ```bash
   netlify dev
   ```

2. **Submit a test message** through your contact form

3. **Check Hygraph CMS** for the new ContactMessage record

4. **Check email inboxes** for notifications

## File Structure

```
project/
├── netlify/
│   └── functions/
│       └── submit-message.js     # Serverless function
├── scripts/
│   └── setup-contact-messages.js # Setup script
├── src/
│   └── App.jsx                   # Updated form handler
├── .env                          # Environment variables
└── CONTACT_FORM_SETUP.md        # This guide
```

## Troubleshooting

### Common Issues

1. **"ContactMessage model not found"**
   - Create the model manually in Hygraph (see Step 1B)
   - Ensure the model is published

2. **"Email sending failed"**
   - Verify your SendGrid API key
   - Check sender domain verification
   - Ensure EMAIL_SERVICE_API_KEY is set correctly

3. **"Function not found" (404 error)**
   - Ensure you're deploying to Netlify
   - Check that the function is in `netlify/functions/`
   - Verify the function name matches the endpoint

4. **CORS errors**
   - The function includes CORS headers
   - Ensure you're making requests to the correct endpoint

### Testing Endpoints

**Local development** (with Netlify Dev):
```
POST http://localhost:8888/.netlify/functions/submit-message
```

**Production**:
```
POST https://your-site.netlify.app/.netlify/functions/submit-message
```

## Email Templates

The system sends two types of emails:

### Staff Notification Email
- **To**: All addresses in `STAFF_EMAILS`
- **Subject**: "New Contact Form Message from [Name]"
- **Content**: Full message details with reference ID

### User Confirmation Email
- **To**: Message sender
- **Subject**: "Thank you for contacting Dohani Medicare Hospital"
- **Content**: Confirmation with contact information and reference ID

## Security Features

- **Input validation**: Required fields and email format validation
- **Rate limiting**: Inherent with Netlify Functions
- **CORS protection**: Configured for your domain
- **Error handling**: Graceful error responses
- **Data persistence**: All messages saved to CMS regardless of email status

## Monitoring

### Hygraph CMS Dashboard
- View all contact messages
- Filter by status (NEW, RESPONDED, CLOSED)
- Export message data

### Netlify Functions Dashboard
- Monitor function invocations
- View error logs
- Check performance metrics

### Email Service Dashboard
- Track email delivery rates
- Monitor bounce/spam rates
- View sending statistics

## Next Steps

1. **Customize email templates** in `submit-message.js`
2. **Add message status management** in Hygraph
3. **Set up automated responses** for common inquiries
4. **Implement message categorization** (General, Emergency, Appointment)
5. **Add SMS notifications** for urgent messages

## Support

If you encounter issues:
1. Check the Netlify Functions logs
2. Verify environment variables are set
3. Test the Hygraph connection with the setup script
4. Check email service dashboard for delivery issues

For additional help, refer to:
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [SendGrid API Documentation](https://docs.sendgrid.com/api-reference)
- [Hygraph Documentation](https://hygraph.com/docs)