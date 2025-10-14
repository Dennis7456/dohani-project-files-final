import { gql } from '@apollo/client'

// Create a new message
export const CREATE_MESSAGE = gql`
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

// Update message status
export const UPDATE_MESSAGE_STATUS = gql`
  mutation UpdateMessageStatus($id: ID!, $status: MessageStatus!) {
    updateMessage(where: { id: $id }, data: { status: $status }) {
      id
      status
      updatedAt
    }
  }
`

// Publish message (if using draft system)
export const PUBLISH_MESSAGE = gql`
  mutation PublishMessage($id: ID!) {
    publishMessage(where: { id: $id }) {
      id
      status
    }
  }
`

// Create medical service (admin)
export const CREATE_MEDICAL_SERVICE = gql`
  mutation CreateMedicalService($data: MedicalServiceCreateInput!) {
    createMedicalService(data: $data) {
      id
      name
      description
      keywords
      icon
      featured
    }
  }
`

// Update medical service (admin)
export const UPDATE_MEDICAL_SERVICE = gql`
  mutation UpdateMedicalService($id: ID!, $data: MedicalServiceUpdateInput!) {
    updateMedicalService(where: { id: $id }, data: $data) {
      id
      name
      description
      keywords
      icon
      featured
      updatedAt
    }
  }
`

// Delete medical service (admin)
export const DELETE_MEDICAL_SERVICE = gql`
  mutation DeleteMedicalService($id: ID!) {
    deleteMedicalService(where: { id: $id }) {
      id
    }
  }
`

// Update contact information (admin)
export const UPDATE_CONTACT_INFO = gql`
  mutation UpdateContactInfo($id: ID!, $data: ContactInfoUpdateInput!) {
    updateContactInfo(where: { id: $id }, data: $data) {
      id
      phone
      emergencyPhone
      email
      location
      updatedAt
    }
  }
`

// Update working hours (admin)
export const UPDATE_WORKING_HOURS = gql`
  mutation UpdateWorkingHours($id: ID!, $data: WorkingHoursUpdateInput!) {
    updateWorkingHours(where: { id: $id }, data: $data) {
      id
      emergency
      consultation
      pharmacy
      laboratory
      updatedAt
    }
  }
`

// Create news article (admin)
export const CREATE_NEWS_ARTICLE = gql`
  mutation CreateNewsArticle($data: NewsArticleCreateInput!) {
    createNewsArticle(data: $data) {
      id
      title
      excerpt
      content {
        html
      }
      author
      featured
      publishedAt
    }
  }
`

// Update news article (admin)
export const UPDATE_NEWS_ARTICLE = gql`
  mutation UpdateNewsArticle($id: ID!, $data: NewsArticleUpdateInput!) {
    updateNewsArticle(where: { id: $id }, data: $data) {
      id
      title
      excerpt
      content {
        html
      }
      author
      featured
      publishedAt
      updatedAt
    }
  }
`

// Create doctor profile (admin)
export const CREATE_DOCTOR = gql`
  mutation CreateDoctor($data: DoctorCreateInput!) {
    createDoctor(data: $data) {
      id
      name
      specialty
      qualifications
      bio {
        html
      }
      consultationHours
      available
    }
  }
`

// Update doctor profile (admin)
export const UPDATE_DOCTOR = gql`
  mutation UpdateDoctor($id: ID!, $data: DoctorUpdateInput!) {
    updateDoctor(where: { id: $id }, data: $data) {
      id
      name
      specialty
      qualifications
      bio {
        html
      }
      consultationHours
      available
      updatedAt
    }
  }
`