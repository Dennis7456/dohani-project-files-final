// Netlify serverless function for handling appointment bookings
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

// GraphQL mutation for creating appointments
const CREATE_APPOINTMENT = `
  mutation CreateAppointment($data: AppointmentCreateInput!) {
    createAppointment(data: $data) {
      id
      firstName
      lastName
      email
      phone
      appointmentType
      preferredDate
      preferredTime
      doctor
      status
      createdAt
    }
  }
`

// Email templates
const getPatientConfirmationTemplate = (appointmentData) => `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">Dohani Medicare</h1>
          <p style="color: #6b7280;">Quality Healthcare Services</p>
        </div>
        
        <h2 style="color: #1e40af;">Appointment Confirmation</h2>
        
        <p>Dear ${appointmentData.firstName} ${appointmentData.lastName},</p>
        
        <p>Thank you for booking an appointment with Dohani Medicare. Your appointment has been successfully scheduled.</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <h3 style="color: #1e40af; margin-top: 0;">Appointment Details</h3>
          <p><strong>Date:</strong> ${new Date(appointmentData.preferredDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${appointmentData.preferredTime}</p>
          <p><strong>Type:</strong> ${appointmentData.appointmentType}</p>
          <p><strong>Doctor:</strong> ${appointmentData.doctor || 'To be assigned'}</p>
          <p><strong>Status:</strong> ${appointmentData.status}</p>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #92400e; margin-top: 0;">Important Reminders</h4>
          <ul style="color: #92400e; margin-bottom: 0;">
            <li>Please arrive 15 minutes before your scheduled time</li>
            <li>Bring a valid ID and insurance card (if applicable)</li>
            <li>Bring any previous medical records or test results</li>
            <li>If you need to cancel or reschedule, please call us at least 24 hours in advance</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px;">
          <h3 style="color: #1e40af;">Contact Information</h3>
          <p><strong>Phone:</strong> 0798057622</p>
          <p><strong>Email:</strong> dohanimedicare@gmail.com</p>
          <p><strong>Location:</strong> Dohani Medicare Hospital</p>
          <p><strong>Hours:</strong> Monday to Saturday: 8:00 AM - 6:00 PM</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 14px; color: #6b7280;">
          <p>Best regards,<br>The Dohani Medicare Team</p>
          <p>This is an automated confirmation email.</p>
        </div>
      </div>
    </body>
  </html>
`

const getAdminNotificationTemplate = (appointmentData) => `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          📅 New Appointment Booking
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Patient Information</h3>
          <p><strong>Name:</strong> ${appointmentData.firstName} ${appointmentData.lastName}</p>
          <p><strong>Email:</strong> ${appointmentData.email}</p>
          <p><strong>Phone:</strong> ${appointmentData.phone}</p>
          <p><strong>Date of Birth:</strong> ${appointmentData.dateOfBirth || 'Not provided'}</p>
          <p><strong>Emergency Contact:</strong> ${appointmentData.emergencyContact || 'Not provided'}</p>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Appointment Details</h3>
          <p><strong>Date:</strong> ${new Date(appointmentData.preferredDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${appointmentData.preferredTime}</p>
          <p><strong>Type:</strong> ${appointmentData.appointmentType}</p>
          <p><strong>Preferred Doctor:</strong> ${appointmentData.doctor || 'No preference'}</p>
          <p><strong>Reason:</strong> ${appointmentData.reason}</p>
          ${appointmentData.symptoms ? `<p><strong>Symptoms:</strong> ${appointmentData.symptoms}</p>` : ''}
          <p><strong>Previous Visit:</strong> ${appointmentData.previousVisit ? 'Yes' : 'No'}</p>
        </div>
        
        ${appointmentData.hasInsurance ? `
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #166534; margin-top: 0;">Insurance Information</h3>
          <p><strong>Provider:</strong> ${appointmentData.insuranceProvider}</p>
          <p><strong>Policy Number:</strong> ${appointmentData.policyNumber}</p>
        </div>
        ` : ''}
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #92400e; margin-top: 0;">Action Required</h4>
          <p style="margin-bottom: 0; color: #92400e;">
            Please review this appointment and confirm the booking. Contact the patient if any clarification is needed.
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
          <p>Booking received at: ${new Date().toLocaleString()}</p>
          <p>This notification was generated by the Dohani Medicare appointment system.</p>
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
    const appointmentData = JSON.parse(body)

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'appointmentType', 'preferredDate', 'preferredTime', 'reason']
    const missingFields = requiredFields.filter(field => !appointmentData[field])
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          missingFields
        })
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(appointmentData.email)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid email format' })
      }
    }

    // Validate date (must be in the future)
    const appointmentDate = new Date(appointmentData.preferredDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (appointmentDate < today) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Appointment date must be in the future' })
      }
    }

    // Create appointment in Hygraph
    const hygraphData = {
      firstName: appointmentData.firstName.trim(),
      lastName: appointmentData.lastName.trim(),
      email: appointmentData.email.trim().toLowerCase(),
      phone: appointmentData.phone.trim(),
      dateOfBirth: appointmentData.dateOfBirth || null,
      appointmentType: appointmentData.appointmentType,
      preferredDate: appointmentData.preferredDate,
      preferredTime: appointmentData.preferredTime,
      doctor: appointmentData.doctor || null,
      reason: appointmentData.reason,
      symptoms: appointmentData.symptoms || null,
      previousVisit: appointmentData.previousVisit || false,
      emergencyContact: appointmentData.emergencyContact || null,
      hasInsurance: appointmentData.hasInsurance || false,
      insuranceProvider: appointmentData.insuranceProvider || null,
      policyNumber: appointmentData.policyNumber || null,
      status: 'PENDING'
    }

    const hygraphResponse = await hygraph.request(CREATE_APPOINTMENT, {
      data: hygraphData
    })

    const createdAppointment = hygraphResponse.createAppointment

    // Send confirmation email to patient
    try {
      await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
          From: {
            Email: process.env.VITE_SENDER_EMAIL || 'noreply@dohanimedicare.com',
            Name: "Dohani Medicare"
          },
          To: [{
            Email: appointmentData.email,
            Name: `${appointmentData.firstName} ${appointmentData.lastName}`
          }],
          Subject: "Appointment Confirmation - Dohani Medicare",
          HTMLPart: getPatientConfirmationTemplate({
            ...appointmentData,
            ...createdAppointment
          }),
          TextPart: `Dear ${appointmentData.firstName}, your appointment has been confirmed for ${appointmentData.preferredDate} at ${appointmentData.preferredTime}. We look forward to seeing you at Dohani Medicare.`
        }]
      })
    } catch (emailError) {
      console.error('Patient confirmation email error:', emailError)
    }

    // Send notification email to admin
    try {
      await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
          From: {
            Email: process.env.VITE_SENDER_EMAIL || 'noreply@dohanimedicare.com',
            Name: "Dohani Medicare Appointments"
          },
          To: [{
            Email: process.env.VITE_ADMIN_EMAIL || 'dohanimedicare@gmail.com',
            Name: "Dohani Medicare Admin"
          }],
          Subject: `📅 New Appointment: ${appointmentData.firstName} ${appointmentData.lastName}`,
          HTMLPart: getAdminNotificationTemplate(appointmentData),
          TextPart: `New appointment booking: ${appointmentData.firstName} ${appointmentData.lastName} for ${appointmentData.preferredDate} at ${appointmentData.preferredTime}`
        }]
      })
    } catch (emailError) {
      console.error('Admin notification email error:', emailError)
    }

    // Return success response
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Appointment booked successfully',
        appointmentId: createdAppointment.id,
        appointmentDetails: {
          date: createdAppointment.preferredDate,
          time: createdAppointment.preferredTime,
          type: createdAppointment.appointmentType,
          status: createdAppointment.status
        }
      })
    }

  } catch (error) {
    console.error('Appointment booking error:', error)
    
    // Return appropriate error response
    if (error.response?.errors) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Failed to save appointment',
          details: error.response.errors
        })
      }
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Please try again later or call us directly'
      })
    }
  }
}