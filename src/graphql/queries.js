import { gql } from '@apollo/client'

// Get all CMS data for homepage
export const GET_HOMEPAGE_DATA = gql`
  query GetHomepageData {
    medicalServices(where: { featured: true }) {
      id
      name
      description
      keywords
      icon
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
      where: { publishedAt_lte: $now }
      orderBy: publishedAt_DESC
      first: 3
    ) {
      id
      title
      excerpt
      featuredImage {
        url
      }
      author
      publishedAt
    }
  }
`

// Get all medical services
export const GET_ALL_SERVICES = gql`
  query GetAllServices {
    medicalServices(orderBy: name_ASC) {
      id
      name
      description
      keywords
      icon
      featured
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
      where: { publishedAt_lte: $now }
      orderBy: publishedAt_DESC
      first: $limit
      skip: $skip
    ) {
      id
      title
      excerpt
      content {
        html
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
    doctors(where: { available: true }) {
      id
      name
      specialty
      qualifications
      bio {
        html
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

// Get messages (for admin)
export const GET_MESSAGES = gql`
  query GetMessages($status: MessageStatus) {
    messages(
      where: { status: $status }
      orderBy: createdAt_DESC
    ) {
      id
      name
      email
      message {
        html
      }
      status
      source
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
        html
      }
      status
      source
      createdAt
      updatedAt
    }
  }
`