// Netlify serverless function for handling contact form submissions
const { GraphQLClient } = require('graphql-request')

// Mailjet configuration
const mailjet = require('node-mailjet').connect(
  process.env.VITE_MAILJET_API_KEY,
  process.env.VITE_MAILJET_SECRET_KEY
)

// Hygraph client for mutations
const hygraph = new GraphQLClient(process.env.VITE_HYGRAPH_ENDPOINT, {
  headers: {
    authorization: `Bearer ${process.env.VITE_HYGRAPH_TOKEN}`,
  },
})

// GraphQL mutation for creating messages
const CREATE_MESSAGE = `
  mutation CreateMessage($data: MessageCreateInput!) {
    createMessage(data: $data) {
      id
      name
      email
      message {
        html
      }
      status
      source
      createdAt
    }
  }
`

// Email templates
const getAdminEmailTemplate = (messageData) => `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          New Message from Dohani Medicare Website
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>From:</strong> ${messageData.name}</p>
          <p><strong>Email:</strong> ${messageData.email}</p>
          <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #1e40af;">Message:</h3>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px;">
            ${messageData.message}
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
          <p>This message was sent from the Dohani Medicare website contact form.</p>
          <p>Please respond to the patient at: <a href="mailto:${messageData.email}">${messageData.email}</a></p>
        </div>
      </div>
    </body>
  </html>
`

const getUserConfirmationTemplate = (messageData) => `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">Dohani Medicare</h1>
          <p style="color: #6b7280;">Quality Healthcare Services</p>
        </div>
        
        <h2 style="color: #1e40af;">Thank you for contacting us!</h2>
        
        <p>Dear ${messageData.name},</p>
        
        <p>We have received your message and appreciate you reaching out to Dohani Medicare. Our team will review your inquiry and get back to you as soon as possible, typically within 24 hours.</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <h3 style="color: #1e40af; margin-top: 0;">Your Message:</h3>
          <p style="margin-bottom: 0;">${messageData.message}</p>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #92400e; margin-top: 0;">Emergency Services</h4>
          <p style="margin-bottom: 0; color: #92400e;">If this is a medical emergency, please call our emergency line immediately at <strong>+254-XXX-XXX-XXX</strong> or visit our hospital directly.</p>
        </div>
        
        <div style="margin-top: 30px;">
          <h3 style="color: #1e40af;">Contact Information</h3>
          <p><strong>Phone:</strong> +254-XXX-XXX-XXX</p>
          <p><strong>Emergency:</strong> +254-XXX-XXX-XXX</p>
          <p><strong>Email:</strong> info@dohanmedicare.com</p>
          <p><strong>Location:</strong> Dohani Medicare Hospital</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 14px; color: #6b7280;">
          <p>Best regards,<br>The Dohani Medicare Team</p>
          <p>This is an automated confirmation email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
  </html>
`

exports.handler = async (event, context) => {
  const { httpMethod, body, headers } = event
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    }
  }

  if (httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { name, email, message } = JSON.parse(body)

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: ['name', 'email', 'message']
        })
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid email format' })
      }
    }

    // Create message in Hygraph
    const messageData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: {
        html: `<p>${message.replace(/\n/g, '</p><p>')}</p>`
      },
      status: 'UNREAD',
      source: 'WEBSITE'
    }

    const hygraphResponse = await hygraph.request(CREATE_MESSAGE, {
      data: messageData
    })

    // Send email notification to admin
    try {
      await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
          From: {
            Email: process.env.VITE_SENDER_EMAIL,
            Name: "Dohani Medicare Website"
          },
          To: [{
            Email: process.env.VITE_ADMIN_EMAIL,
            Name: "Dohani Medicare Admin"
          }],
          Subject: `New Website Message from ${name}`,
          HTMLPart: getAdminEmailTemplate({ name, email, message }),
          TextPart: `New message from ${name} (${email}): ${message}`
        }]
      })
    } catch (emailError) {
      console.error('Admin email error:', emailError)
      // Continue execution - don't fail the request if email fails
    }

    // Send confirmation email to user
    try {
      await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
          From: {
            Email: process.env.VITE_SENDER_EMAIL,
            Name: "Dohani Medicare"
          },
          To: [{
            Email: email,
            Name: name
          }],
          Subject: "Thank you for contacting Dohani Medicare",
          HTMLPart: getUserConfirmationTemplate({ name, email, message }),
          TextPart: `Dear ${name}, thank you for contacting Dohani Medicare. We have received your message and will get back to you soon.`
        }]
      })
    } catch (emailError) {
      console.error('User confirmation email error:', emailError)
      // Continue execution - don't fail the request if email fails
    }

    // Return success response
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Message submitted successfully',
        id: hygraphResponse.createMessage.id
      })
    }

  } catch (error) {
    console.error('Message submission error:', error)
    
    // Return appropriate error response
    if (error.response?.errors) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Failed to save message',
          details: error.response.errors
        })
      }
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Please try again later'
      })
    }
  }
}