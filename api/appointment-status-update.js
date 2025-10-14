// Netlify serverless function for appointment status updates
const mailjet = require('node-mailjet').connect(
  process.env.VITE_MAILJET_API_KEY,
  process.env.VITE_MAILJET_SECRET_KEY
)

// Email templates for different status updates
const getStatusUpdateTemplate = (appointment, newStatus) => {
  const statusMessages = {
    CONFIRMED: {
      subject: 'Appointment Confirmed - Dohani Medicare',
      title: 'Your Appointment is Confirmed! ✅',
      message: 'Great news! Your appointment has been confirmed by our medical team.',
      color: '#10b981',
      bgColor: '#f0fdf4'
    },
    CANCELLED: {
      subject: 'Appointment Cancelled - Dohani Medicare',
      title: 'Appointment Cancelled',
      message: 'We regret to inform you that your appointment has been cancelled. Please contact us to reschedule.',
      color: '#ef4444',
      bgColor: '#fef2f2'
    },
    COMPLETED: {
      subject: 'Appointment Completed - Dohani Medicare',
      title: 'Thank You for Your Visit! 🏥',
      message: 'Your appointment has been completed. Thank you for choosing Dohani Medicare for your healthcare needs.',
      color: '#3b82f6',
      bgColor: '#eff6ff'
    },
    RESCHEDULED: {
      subject: 'Appointment Rescheduled - Dohani Medicare',
      title: 'Appointment Rescheduled',
      message: 'Your appointment has been rescheduled. Please check the new date and time below.',
      color: '#f59e0b',
      bgColor: '#fffbeb'
    }
  }

  const statusInfo = statusMessages[newStatus] || statusMessages.CONFIRMED

  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Dohani Medicare</h1>
            <p style="color: #6b7280;">Quality Healthcare Services</p>
          </div>
          
          <div style="background-color: ${statusInfo.bgColor}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusInfo.color};">
            <h2 style="color: ${statusInfo.color}; margin-top: 0;">${statusInfo.title}</h2>
            <p style="color: #374151; margin-bottom: 0;">${statusInfo.message}</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Appointment Details</h3>
            <p><strong>Patient:</strong> ${appointment.firstName} ${appointment.lastName}</p>
            <p><strong>Date:</strong> ${new Date(appointment.preferredDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.preferredTime}</p>
            <p><strong>Type:</strong> ${appointment.appointmentType}</p>
            <p><strong>Doctor:</strong> ${appointment.doctor || 'To be assigned'}</p>
            <p><strong>Status:</strong> <span style="color: ${statusInfo.color}; font-weight: bold;">${newStatus}</span></p>
          </div>
          
          ${newStatus === 'CONFIRMED' ? `
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #92400e; margin-top: 0;">Important Reminders</h4>
            <ul style="color: #92400e; margin-bottom: 0;">
              <li>Please arrive 15 minutes before your scheduled time</li>
              <li>Bring a valid ID and insurance card (if applicable)</li>
              <li>Bring any previous medical records or test results</li>
              <li>If you need to cancel or reschedule, please call us at least 24 hours in advance</li>
            </ul>
          </div>
          ` : ''}
          
          ${newStatus === 'CANCELLED' ? `
          <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #dc2626; margin-top: 0;">Need to Reschedule?</h4>
            <p style="color: #dc2626; margin-bottom: 0;">
              Please contact us at 0798057622 or email dohanimedicare@gmail.com to book a new appointment.
            </p>
          </div>
          ` : ''}
          
          ${newStatus === 'COMPLETED' ? `
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1d4ed8; margin-top: 0;">Follow-up Care</h4>
            <p style="color: #1d4ed8; margin-bottom: 0;">
              If you have any questions about your visit or need follow-up care, please don't hesitate to contact us.
            </p>
          </div>
          ` : ''}
          
          <div style="margin-top: 30px;">
            <h3 style="color: #1e40af;">Contact Information</h3>
            <p><strong>Phone:</strong> 0798057622</p>
            <p><strong>Email:</strong> dohanimedicare@gmail.com</p>
            <p><strong>Location:</strong> Dohani Medicare Hospital</p>
            <p><strong>Hours:</strong> Monday to Saturday: 8:00 AM - 6:00 PM</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 14px; color: #6b7280;">
            <p>Best regards,<br>The Dohani Medicare Team</p>
            <p>This is an automated notification email.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

exports.handler = async (event, context) => {
  const { httpMethod, body } = event

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
    const { appointment, newStatus } = JSON.parse(body)

    if (!appointment || !newStatus) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing appointment data or status' })
      }
    }

    const statusMessages = {
      CONFIRMED: 'Appointment Confirmed - Dohani Medicare',
      CANCELLED: 'Appointment Cancelled - Dohani Medicare',
      COMPLETED: 'Appointment Completed - Dohani Medicare',
      RESCHEDULED: 'Appointment Rescheduled - Dohani Medicare'
    }

    const subject = statusMessages[newStatus] || 'Appointment Update - Dohani Medicare'

    // Send status update email to patient
    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [{
        From: {
          Email: process.env.VITE_SENDER_EMAIL || 'noreply@dohanimedicare.com',
          Name: "Dohani Medicare"
        },
        To: [{
          Email: appointment.email,
          Name: `${appointment.firstName} ${appointment.lastName}`
        }],
        Subject: subject,
        HTMLPart: getStatusUpdateTemplate(appointment, newStatus),
        TextPart: `Dear ${appointment.firstName}, your appointment status has been updated to ${newStatus}. Please check your email for full details.`
      }]
    })

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Status update email sent successfully'
      })
    }

  } catch (error) {
    console.error('Status update email error:', error)
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Failed to send status update email',
        message: error.message
      })
    }
  }
}