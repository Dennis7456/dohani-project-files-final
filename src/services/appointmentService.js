import { client } from '@/lib/graphql.js'
import { CREATE_APPOINTMENT, PUBLISH_APPOINTMENT } from '@/graphql/queries.js'

// Helper function to convert time string to ISO format
const convertTimeToISO = (timeString) => {
  // Convert "10:00 AM" to "10:00:00"
  const [time, period] = timeString.split(' ')
  const [hours, minutes] = time.split(':')
  
  let hour24 = parseInt(hours)
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes}:00`
}

// Helper function to map appointment types to Hygraph enum values
const mapAppointmentType = (type) => {
  const typeMap = {
    'general': 'generalConsultation',
    'consultation': 'generalConsultation',
    'cardiology': 'cardiology',
    'pediatrics': 'pediatrics',
    'laboratory': 'laboratoryTests',
    'lab': 'laboratoryTests',
    'primary': 'primaryConsultation',
    'emergency': 'emergencyConsultion'
  }
  
  return typeMap[type?.toLowerCase()] || 'generalConsultation'
}

// Initialize EmailJS (we'll load it dynamically)
const loadEmailJS = async () => {
  if (window.emailjs) return window.emailjs
  
  // Load EmailJS from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
    script.onload = () => {
      window.emailjs.init(EMAIL_PUBLIC_KEY)
      resolve(window.emailjs)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Create appointment in Hygraph CMS
export const createAppointmentInCMS = async (appointmentData) => {
  try {
    // console.log('Creating appointment in Hygraph CMS...', appointmentData)
    // console.log('🔍 Raw appointment data received:', JSON.stringify(appointmentData, null, 2))
    
    // Prepare data for GraphQL mutation - matching your exact Hygraph schema
    const mutationData = {
      firstName: appointmentData.firstName?.trim() || '',
      lastName: appointmentData.lastName?.trim() || '',
      email: appointmentData.email?.trim().toLowerCase() || '',
      phone: appointmentData.phone?.trim() || '',
      // Map appointment type to your enum values
      appointmentType: mapAppointmentType(appointmentData.appointmentType),
      // Combine date and time into proper RFC3339 DateTime format
      preferredDateTime: `${appointmentData.preferredDate}T${convertTimeToISO(appointmentData.preferredTime)}.000Z`,
      // Convert date of birth to proper RFC3339 DateTime format (required field)
      dateOfBirth: appointmentData.dateOfBirth ? `${appointmentData.dateOfBirth}T00:00:00.000Z` : `${appointmentData.preferredDate}T00:00:00.000Z`,
      // Convert reason to RichText format for Hygraph (optional)
      reason: appointmentData.reason ? {
        children: [
          {
            type: 'paragraph',
            children: [
              { 
                text: `${appointmentData.reason}${appointmentData.symptoms ? ` - Symptoms: ${appointmentData.symptoms}` : ''}`
              }
            ]
          }
        ]
      } : null,
      // Optional boolean fields
      previousVisit: appointmentData.previousVisit || false,
      hasInsurance: appointmentData.hasInsurance || false,
      // Map status to your enum values
      appointmentStatus: 'pending',
      // Insurance fields (only if hasInsurance is true)
      insuranceProvider: appointmentData.hasInsurance ? appointmentData.insuranceProvider : null,
      policyNumber: appointmentData.hasInsurance ? appointmentData.policyNumber : null
    }

    // Try to create appointment in Hygraph
    try {
      // console.log('🔍 Sending mutation data:', JSON.stringify(mutationData, null, 2))
      // console.log('🔍 GraphQL Mutation:', CREATE_APPOINTMENT.loc.source.body)
      
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'appointmentType', 'preferredDateTime', 'dateOfBirth']
      const missingFields = requiredFields.filter(field => !mutationData[field])
      if (missingFields.length > 0) {
        // console.error('❌ Missing required fields:', missingFields)
      }
      
      // Validate data types and DateTime formats
      // console.log('🔍 Data type validation:')
      // console.log('   firstName type:', typeof mutationData.firstName, mutationData.firstName)
      // console.log('   appointmentType type:', typeof mutationData.appointmentType, mutationData.appointmentType)
      // console.log('   preferredDateTime type:', typeof mutationData.preferredDateTime, mutationData.preferredDateTime)
      // console.log('   dateOfBirth type:', typeof mutationData.dateOfBirth, mutationData.dateOfBirth)
      // console.log('   reason type:', typeof mutationData.reason, mutationData.reason)
      // console.log('   previousVisit type:', typeof mutationData.previousVisit, mutationData.previousVisit)
      // console.log('   hasInsurance type:', typeof mutationData.hasInsurance, mutationData.hasInsurance)
      
      // Validate DateTime formats specifically
      // console.log('🔍 DateTime format validation:')
      // console.log('   preferredDateTime format check:', /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(mutationData.preferredDateTime))
      // console.log('   dateOfBirth format check:', /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(mutationData.dateOfBirth))
      
      const result = await client.mutate({
        mutation: CREATE_APPOINTMENT,
        variables: mutationData,
        errorPolicy: 'all'
      })

      // console.log('📊 Full GraphQL Response:', JSON.stringify(result, null, 2))

      if (result.errors && result.errors.length > 0) {
        // console.error('❌ GraphQL Errors Found:')
        // result.errors.forEach((error, index) => {
        //   console.error(`   ${index + 1}. ${error.message}`)
        //   if (error.extensions) {
        //     console.error('      Extensions:', JSON.stringify(error.extensions, null, 2))
        //   }
        //   if (error.locations) {
        //     console.error('      Locations:', JSON.stringify(error.locations, null, 2))
        //   }
        //   if (error.path) {
        //     console.error('      Path:', JSON.stringify(error.path, null, 2))
        //   }
        // })
        throw new Error(`GraphQL Errors: ${result.errors.map(e => e.message).join(', ')}`)
      }

      const createdAppointment = result.data.createAppointment
      // console.log('✅ Appointment created in CMS:', createdAppointment.id)

      // Note: Publish step removed as it's not needed for your Hygraph setup
      // Appointments are automatically available once created

      return createdAppointment
    } catch (cmsError) {
      // console.error('❌ CMS Mutation Failed - Detailed Error Analysis:')
      // console.error('📋 Error Message:', cmsError.message)
      
      // Log GraphQL errors if available
      // if (cmsError.graphQLErrors && cmsError.graphQLErrors.length > 0) {
      //   console.error('🔍 GraphQL Errors:')
      //   cmsError.graphQLErrors.forEach((error, index) => {
      //     console.error(`   ${index + 1}. Message: ${error.message}`)
      //     if (error.extensions) {
      //       console.error(`      Extensions:`, JSON.stringify(error.extensions, null, 2))
      //     }
      //     if (error.locations) {
      //       console.error(`      Locations:`, JSON.stringify(error.locations, null, 2))
      //     }
      //     if (error.path) {
      //       console.error(`      Path:`, JSON.stringify(error.path, null, 2))
      //     }
      //   })
      // } else {
      //   console.error('⚠️ No GraphQL errors found in response')
      // }
      
      // Log network error if available
      // if (cmsError.networkError) {
      //   console.error('🌐 Network Error:', cmsError.networkError.message)
      //   if (cmsError.networkError.result) {
      //     console.error('🌐 Network Error Result:', JSON.stringify(cmsError.networkError.result, null, 2))
      //   }
      //   if (cmsError.networkError.statusCode) {
      //     console.error('🌐 Status Code:', cmsError.networkError.statusCode)
      //   }
      // } else {
      //   console.error('⚠️ No network error found')
      // }
      
      // Log the full error object
      // console.error('🔍 Full Error Object:', JSON.stringify(cmsError, null, 2))
      
      // console.warn('⚠️ Using fallback storage due to CMS error')
      
      // Fallback: Store appointment locally with proper structure
      const fallbackAppointment = {
        id: `local_${Date.now()}`,
        ...mutationData,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        source: 'fallback_storage'
      }
      
      // Store in localStorage for admin review
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]')
      appointments.push(fallbackAppointment)
      localStorage.setItem('appointments', JSON.stringify(appointments))
      
      // console.log('✅ Appointment stored locally for CMS migration:', fallbackAppointment.id)
      // console.log('📊 Total appointments in storage:', appointments.length)
      return fallbackAppointment
    }
  } catch (error) {
    // console.error('❌ Failed to create appointment:', error)
    throw new Error(`Failed to save appointment: ${error.message}`)
  }
}

// Send confirmation email to patient
export const sendConfirmationEmail = async (appointmentData, appointmentId) => {
  try {
    // console.log('📧 Preparing confirmation email...')
    
    // Create email content
    const emailContent = {
      to: appointmentData.email,
      patientName: `${appointmentData.firstName} ${appointmentData.lastName}`,
      appointmentDate: new Date(appointmentData.preferredDate).toLocaleDateString(),
      appointmentTime: appointmentData.preferredTime,
      appointmentType: appointmentData.appointmentType,
      appointmentId: appointmentId,
      doctorName: appointmentData.doctor || 'To be assigned'
    }

    // For now, store email details for manual sending or future integration
    const emailDetails = {
      to: emailContent.to,
      subject: 'Appointment Confirmation - Dohani Medicare',
      content: `
Dear ${emailContent.patientName},

Your appointment has been successfully scheduled with Dohani Medicare.

📋 Appointment Details:
• Date: ${emailContent.appointmentDate}
• Time: ${emailContent.appointmentTime}
• Type: ${emailContent.appointmentType}
• Doctor: ${emailContent.doctorName}
• Appointment ID: ${emailContent.appointmentId}

📝 Important Reminders:
• Please arrive 15 minutes before your scheduled time
• Bring a valid ID and insurance card (if applicable)
• Bring any previous medical records or test results
• If you need to cancel or reschedule, please call us at least 24 hours in advance

📞 Contact Information:
• Phone: 0798057622
• Email: dohanimedicare@gmail.com
• Location: Dohani Medicare Hospital
• Hours: Monday to Saturday: 8:00 AM - 6:00 PM

Best regards,
The Dohani Medicare Team

---
This is an automated confirmation. Please do not reply to this email.
      `,
      appointmentId: appointmentId,
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
    
    // Store email for admin to send manually or for future email service integration
    const pendingEmails = JSON.parse(localStorage.getItem('pendingEmails') || '[]')
    pendingEmails.push(emailDetails)
    localStorage.setItem('pendingEmails', JSON.stringify(pendingEmails))
    
    // console.log('✅ Email prepared and stored for sending')
    return { 
      success: true, 
      service: 'Prepared', 
      message: 'Email prepared for manual sending or future integration',
      emailDetails 
    }
  } catch (error) {
    // console.error('❌ Failed to prepare confirmation email:', error)
    return { success: false, error: error.message }
  }
}

// Send admin notification
export const sendAdminNotification = async (appointmentData, appointmentId) => {
  try {
    // console.log('Sending admin notification...')
    
    const adminEmailData = {
      to_email: 'dohanimedicare@gmail.com',
      to_name: 'Dohani Medicare Admin',
      patient_name: `${appointmentData.firstName} ${appointmentData.lastName}`,
      patient_email: appointmentData.email,
      patient_phone: appointmentData.phone,
      appointment_date: new Date(appointmentData.preferredDate).toLocaleDateString(),
      appointment_time: appointmentData.preferredTime,
      appointment_type: appointmentData.appointmentType,
      appointment_reason: appointmentData.reason,
      appointment_id: appointmentId,
      booking_time: new Date().toLocaleString()
    }

    // Store admin notification for manual review
    const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]')
    adminNotifications.push({
      ...adminEmailData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    })
    localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications))
    
    // console.log('📋 Admin notification stored for review')
    return { success: true }
  } catch (error) {
    // console.error('❌ Failed to send admin notification:', error)
    return { success: false, error: error.message }
  }
}

// Complete appointment booking process
export const bookAppointment = async (appointmentData) => {
  try {
    // console.log('🏥 Starting appointment booking process...')
    
    // Step 1: Create appointment in Hygraph CMS
    const createdAppointment = await createAppointmentInCMS(appointmentData)
    
    // Check if appointment was actually saved to CMS or just fallback
    const savedToCMS = !createdAppointment.id.startsWith('local_')
    
    // Step 2: Send confirmation email to patient
    const emailResult = await sendConfirmationEmail(appointmentData, createdAppointment.id)
    
    // Step 3: Send notification to admin
    const adminResult = await sendAdminNotification(appointmentData, createdAppointment.id)
    
    if (savedToCMS) {
      // console.log('✅ Appointment booking completed successfully in CMS!')
      return {
        success: true,
        savedToCMS: true,
        appointmentId: createdAppointment.id,
        appointmentDetails: {
          id: createdAppointment.id,
          date: createdAppointment.preferredDate || appointmentData.preferredDate,
          time: createdAppointment.preferredTime || appointmentData.preferredTime,
          type: createdAppointment.appointmentType || appointmentData.appointmentType,
          status: createdAppointment.status || 'PENDING'
        },
        emailSent: emailResult.success,
        emailService: emailResult.service,
        adminNotified: adminResult.success,
        message: 'Appointment successfully booked and saved to our system!'
      }
    } else {
      // console.log('⚠️ Appointment saved locally, CMS unavailable')
      return {
        success: false,
        savedToCMS: false,
        usedFallback: true,
        appointmentId: createdAppointment.id,
        appointmentDetails: {
          id: createdAppointment.id,
          date: appointmentData.preferredDate,
          time: appointmentData.preferredTime,
          type: appointmentData.appointmentType,
          status: 'PENDING'
        },
        emailSent: emailResult.success,
        emailService: emailResult.service,
        adminNotified: adminResult.success,
        error: 'Unable to connect to our booking system. Your appointment has been saved locally.',
        retryable: true,
        fallbackMessage: 'Your appointment information has been preserved and will be processed once our system is available.'
      }
    }
  } catch (error) {
    // console.error('❌ Appointment booking failed completely:', error)
    return {
      success: false,
      savedToCMS: false,
      usedFallback: false,
      error: 'Failed to save appointment. Please try again.',
      retryable: true,
      technicalError: error.message
    }
  }
}