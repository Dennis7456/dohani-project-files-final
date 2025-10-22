import fetch from 'node-fetch';

// Hygraph configuration
const HYGRAPH_ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT?.replace('us-west-2.cdn.hygraph.com/content', 'api-us-west-2.hygraph.com/v2') || 'https://api-us-west-2.hygraph.com/v2/cmgr5l0iu00pf07wf9zpyrn3d/master';
const HYGRAPH_TOKEN = process.env.VITE_HYGRAPH_TOKEN;

// Email configuration (using a service like SendGrid, Mailgun, or similar)
const EMAIL_SERVICE_API_KEY = process.env.EMAIL_SERVICE_API_KEY; // You'll need to set this
const STAFF_EMAILS = process.env.STAFF_EMAILS?.split(',') || ['dohanimedicare@gmail.com']; // Comma-separated list

// GraphQL mutation to create contact message
const CREATE_CONTACT_MESSAGE = `
  mutation CreateContactMessage(
    $name: String!
    $email: String!
    $message: String!
    $status: String!
  ) {
    createContactMessage(
      data: {
        name: $name
        email: $email
        message: $message
        status: $status
      }
    ) {
      id
      name
      email
      message
      status
      createdAt
    }
  }
`;

// Function to save message to Hygraph CMS
async function saveMessageToCMS(messageData) {
  try {
    const response = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`
      },
      body: JSON.stringify({
        query: CREATE_CONTACT_MESSAGE,
        variables: {
          name: messageData.name,
          email: messageData.email,
          message: messageData.message,
          status: 'NEW'
        }
      })
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data.createContactMessage;
  } catch (error) {
    console.error('Error saving to CMS:', error);
    throw error;
  }
}

// Function to send notification emails using SendGrid
async function sendNotificationEmails(messageData, cmsRecord) {
  if (!EMAIL_SERVICE_API_KEY) {
    console.warn('Email service not configured, skipping email notifications');
    return;
  }

  try {
    // Send notification to staff
    const staffEmailPromises = STAFF_EMAILS.map(email => 
      sendEmail({
        to: email,
        subject: `New Contact Form Message from ${messageData.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${messageData.name} (${messageData.email})</p>
          <p><strong>Submitted:</strong> ${new Date(cmsRecord.createdAt).toLocaleString()}</p>
          <p><strong>Message ID:</strong> ${cmsRecord.id}</p>
          
          <h3>Message:</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${messageData.message.replace(/\n/g, '<br>')}
          </div>
          
          <p>Please respond to this inquiry promptly.</p>
          <p><em>This message was submitted through the Dohani Medicare website contact form.</em></p>
        `
      })
    );

    // Send confirmation to sender
    const confirmationEmail = sendEmail({
      to: messageData.email,
      subject: 'Thank you for contacting Dohani Medicare Hospital',
      html: `
        <h2>Thank you for your message!</h2>
        <p>Dear ${messageData.name},</p>
        
        <p>We have received your message and will respond within 24 hours during business hours.</p>
        
        <h3>Your Message:</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${messageData.message.replace(/\n/g, '<br>')}
        </div>
        
        <h3>Contact Information:</h3>
        <p>
          📞 Phone: 0798057622<br>
          🚨 Emergency: 0798057622<br>
          📧 Email: dohanimedicare@gmail.com<br>
          📍 Location: Mombasa, Kenya
        </p>
        
        <p>For urgent medical matters, please call our emergency line immediately.</p>
        
        <p>Best regards,<br>
        Dohani Medicare Hospital Team</p>
        
        <p><em>Reference ID: ${cmsRecord.id}</em></p>
      `
    });

    await Promise.all([...staffEmailPromises, confirmationEmail]);
    console.log('All emails sent successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
    // Don't throw error here - message is already saved to CMS
  }
}

// Function to send email using SendGrid API
async function sendEmail({ to, subject, html }) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EMAIL_SERVICE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: to }],
        subject: subject
      }],
      from: {
        email: 'noreply@dohanimedicare.com', // You'll need to verify this domain with SendGrid
        name: 'Dohani Medicare Hospital'
      },
      content: [{
        type: 'text/html',
        value: html
      }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Email sending failed: ${error}`);
  }
}

// Main Netlify function handler
export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const messageData = JSON.parse(event.body);

    // Validate required fields
    if (!messageData.name || !messageData.email || !messageData.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: name, email, message' })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(messageData.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Save message to Hygraph CMS
    console.log('Saving message to CMS...');
    const cmsRecord = await saveMessageToCMS(messageData);
    console.log('Message saved to CMS:', cmsRecord.id);

    // Send notification emails
    console.log('Sending notification emails...');
    await sendNotificationEmails(messageData, cmsRecord);

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Message received successfully. We will respond within 24 hours.',
        id: cmsRecord.id
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error. Please try again or contact us directly.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};