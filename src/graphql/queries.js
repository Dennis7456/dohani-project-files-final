import { gql } from '@apollo/client'

// Get all CMS data for homepage
export const GET_HOMEPAGE_DATA = gql`
  query GetHomepageData {
    medicalServices {
      id
      name
      description {
        text
        html
      }
      keywords
      icon
      featured
      servicesOffered
      commonProcedures {
        text
        html
      }
    }
    contactInfos(first: 1) {
      id
      phone
      emergencyPhone
      email
      location
    }
    workingHours(first: 1) {
      id
      emergency
      consultation
      pharmacy
      laboratory
    }
    newsArticles(
      where: { publishedAt_not: null }
      orderBy: publishedAt_DESC
      first: 3
    ) {
      id
      title
      excerpt
      featuredImage {
        id
        url
        width
        height
      }
      author
      publishedAt
      featured
    }
    doctors(where: { available: true }, first: 3) {
      id
      name
      specialty
      available
    }
  }
`

// Get all medical services
export const GET_ALL_SERVICES = gql`
  query GetAllServices {
    medicalServices(orderBy: name_ASC) {
      id
      name
      description {
        text
        html
      }
      keywords
      icon
      featured
      servicesOffered
      commonProcedures {
        text
        html
      }
    }
  }
`

// Get single medical service
export const GET_MEDICAL_SERVICE = gql`
  query GetMedicalService($id: ID, $name: String) {
    medicalService(where: { id: $id, name: $name }) {
      id
      name
      description {
        text
        html
      }
      keywords
      icon
      featured
      servicesOffered
      commonProcedures {
        text
        html
      }
      createdAt
      updatedAt
    }
  }
`

// Get contact information
export const GET_CONTACT_INFO = gql`
  query GetContactInfo {
    contactInfos(first: 1) {
      id
      phone
      emergencyPhone
      email
      location
      updatedAt
    }
  }
`

// Get working hours
export const GET_WORKING_HOURS = gql`
  query GetWorkingHours {
    workingHours(first: 1) {
      id
      emergency
      consultation
      pharmacy
      laboratory
      updatedAt
    }
  }
`

// Get news articles
export const GET_NEWS_ARTICLES = gql`
  query GetNewsArticles($limit: Int = 10, $skip: Int = 0) {
    newsArticles(
      where: { publishedAt_not: null }
      orderBy: publishedAt_DESC
      first: $limit
      skip: $skip
    ) {
      id
      title
      excerpt
      content {
        text
      }
      featuredImage {
        url
        width
        height
      }
      author
      featured
      publishedAt
      createdAt
    }
  }
`

// Get single news article
export const GET_NEWS_ARTICLE = gql`
  query GetNewsArticle($id: ID!) {
    newsArticle(where: { id: $id }) {
      id
      title
      content {
        html
      }
      featuredImage {
        url
        width
        height
      }
      author
      publishedAt
      createdAt
    }
  }
`

// Get doctor profiles
export const GET_DOCTORS = gql`
  query GetDoctors {
    doctors(where: { available: true }, orderBy: name_ASC) {
      id
      name
      specialty
      qualifications
      bio {
        text
      }
      photo {
        url
        width
        height
      }
      consultationHours
      available
    }
  }
`

// Get single doctor by ID
export const GET_DOCTOR = gql`
  query GetDoctor($id: ID!) {
    doctor(where: { id: $id }) {
      id
      name
      specialty
      qualifications
      bio {
        text
        html
      }
      photo {
        url
        width
        height
      }
      consultationHours
      available
      experience
      languages
      consultationFee
    }
  }
`

// Get messages (for admin)
export const GET_MESSAGES = gql`
  query GetMessages($messageStatus: MessageStatus) {
    messages(
      where: { messageStatus: $messageStatus }
      orderBy: createdAt_DESC
    ) {
      id
      name
      email
      message {
        text
      }
      messageStatus
      messageSource
      createdAt
      updatedAt
    }
  }
`

// Get all messages
export const GET_ALL_MESSAGES = gql`
  query GetAllMessages {
    messages(orderBy: createdAt_DESC) {
      id
      name
      email
      message {
        text
      }
      messageStatus
      messageSource
      createdAt
      updatedAt
    }
  }
`

// Get appointments (for admin) - Updated to match your exact schema
export const GET_APPOINTMENTS = gql`
  query GetAppointments($appointmentStatus: AppointmentStatus) {
    appointments(
      where: { appointmentStatus: $appointmentStatus }
      orderBy: createdAt_DESC
    ) {
      id
      firstName
      lastName
      email
      phone
      appointmentType
      preferredDateTime
      dateOfBirth
      reason {
        text
      }
      previousVisit
      hasInsurance
      appointmentStatus
      doctor {
        id
      }
      insuranceProvider
      policyNumber
      createdAt
      updatedAt
    }
  }
`

// Get all appointments - Updated to match your exact Hygraph schema
export const GET_ALL_APPOINTMENTS = gql`
  query GetAllAppointments {
    appointments(orderBy: createdAt_DESC) {
      id
      firstName
      lastName
      email
      phone
      appointmentType
      preferredDateTime
      dateOfBirth
      reason {
        text
      }
      previousVisit
      hasInsurance
      appointmentStatus
      doctor {
        id
      }
      insuranceProvider
      policyNumber
      createdAt
      updatedAt
    }
  }
`

// Create appointment mutation - Fixed to match your exact Hygraph schema
export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment(
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
    $appointmentType: AppointmentType!
    $preferredDateTime: DateTime!
    $dateOfBirth: DateTime!
    $reason: RichTextAST
    $previousVisit: Boolean
    $hasInsurance: Boolean
    $appointmentStatus: AppointmentStatus
    $insuranceProvider: String
    $policyNumber: String
  ) {
    createAppointment(
      data: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        phone: $phone
        appointmentType: $appointmentType
        preferredDateTime: $preferredDateTime
        dateOfBirth: $dateOfBirth
        reason: $reason
        previousVisit: $previousVisit
        hasInsurance: $hasInsurance
        appointmentStatus: $appointmentStatus
        insuranceProvider: $insuranceProvider
        policyNumber: $policyNumber
      }
    ) {
      id
      firstName
      lastName
      email
      phone
      appointmentType
      preferredDateTime
      dateOfBirth
      reason {
        text
      }
      previousVisit
      hasInsurance
      appointmentStatus
      insuranceProvider
      policyNumber
      doctor {
        id
      }
      createdAt
    }
  }
`

// Publish appointment mutation (if using Hygraph's draft system)
export const PUBLISH_APPOINTMENT = gql`
  mutation PublishAppointment($id: ID!) {
    publishAppointment(where: { id: $id }) {
      id
      status
    }
  }
`