# Design Document

## Overview

This design outlines the migration from Flask backend to Hygraph headless CMS with Mailjet email integration. The new architecture will provide better scalability, easier content management, and reduced maintenance overhead while maintaining all existing functionality.

## Architecture

### High-Level Architecture

```
Frontend (React/Vite)
    ↓ GraphQL Queries
Hygraph CMS
    ↓ Webhooks
Serverless Functions (Vercel/Netlify)
    ↓ Email API
Mailjet Email Service
```

### Data Flow

1. **Content Management**: Admins manage content through Hygraph dashboard
2. **Frontend Data**: React app fetches data via GraphQL from Hygraph
3. **Form Submissions**: Frontend sends data to serverless functions
4. **Email Notifications**: Serverless functions use Mailjet to send emails
5. **Webhooks**: Hygraph triggers webhooks for real-time updates

## Components and Interfaces

### 1. Hygraph Content Models

#### Medical Services Model
```graphql
type MedicalService {
  id: ID!
  name: String!
  description: RichText!
  keywords: [String!]!
  icon: String
  featured: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

#### Contact Information Model
```graphql
type ContactInfo {
  id: ID!
  phone: String!
  emergencyPhone: String!
  email: String!
  location: String!
  updatedAt: DateTime!
}
```

#### Working Hours Model
```graphql
type WorkingHours {
  id: ID!
  emergency: String!
  consultation: String!
  pharmacy: String!
  laboratory: String!
  updatedAt: DateTime!
}
```

#### Messages Model
```graphql
type Message {
  id: ID!
  name: String!
  email: String!
  message: RichText!
  status: MessageStatus!
  source: MessageSource!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum MessageStatus {
  UNREAD
  READ
  REPLIED
}

enum MessageSource {
  WEBSITE
  CHATBOT
}
```

#### News Article Model
```graphql
type NewsArticle {
  id: ID!
  title: String!
  content: RichText!
  excerpt: String
  featuredImage: Asset
  author: String!
  featured: Boolean!
  publishedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

#### Doctor Profile Model
```graphql
type Doctor {
  id: ID!
  name: String!
  specialty: String!
  qualifications: [String!]!
  bio: RichText
  photo: Asset
  available: Boolean!
  consultationHours: String
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### 2. Frontend GraphQL Integration

#### GraphQL Client Setup
- Use Apollo Client or GraphQL-Request
- Implement caching for better performance
- Handle loading and error states

#### Key Queries
```graphql
# Get all CMS data for homepage
query GetHomepageData {
  medicalServices(where: { featured: true }) {
    id
    name
    description
    keywords
  }
  contactInfo {
    phone
    emergencyPhone
    email
    location
  }
  workingHours {
    emergency
    consultation
    pharmacy
    laboratory
  }
}

# Get all services
query GetAllServices {
  medicalServices(orderBy: name_ASC) {
    id
    name
    description
    keywords
    icon
  }
}

# Get news articles
query GetNewsArticles($limit: Int = 10) {
  newsArticles(
    where: { publishedAt_lte: $now }
    orderBy: publishedAt_DESC
    first: $limit
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

# Get doctor profiles
query GetDoctors {
  doctors(where: { available: true }) {
    id
    name
    specialty
    qualifications
    bio
    photo {
      url
    }
    consultationHours
  }
}
```

### 3. Serverless Functions Architecture

#### Message Submission Function
```javascript
// /api/submit-message.js
export default async function handler(req, res) {
  // 1. Validate input
  // 2. Create message in Hygraph via mutation
  // 3. Send email via Mailjet
  // 4. Return success response
}
```

#### Chatbot Notification Function
```javascript
// /api/chatbot-notify.js
export default async function handler(req, res) {
  // 1. Process chatbot request
  // 2. Create message in Hygraph
  // 3. Send notification email via Mailjet
  // 4. Return response
}
```

### 4. Mailjet Email Integration

#### Email Templates
- **Admin Notification Template**: New message received
- **User Confirmation Template**: Thank you message
- **Chatbot Alert Template**: AI assistance request

#### Configuration
```javascript
const mailjet = require('node-mailjet').connect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

const sendEmail = async (to, subject, htmlContent, textContent) => {
  return await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [{
      From: { Email: process.env.SENDER_EMAIL, Name: "Dohani Medicare" },
      To: [{ Email: to }],
      Subject: subject,
      HTMLPart: htmlContent,
      TextPart: textContent
    }]
  });
};
```

### 5. Webhook Handlers

#### Message Creation Webhook
```javascript
// /api/webhooks/message-created.js
export default async function handler(req, res) {
  const { data } = req.body;
  
  // Send email notification to admin
  await sendAdminNotification(data);
  
  // Send confirmation to user
  await sendUserConfirmation(data);
  
  res.status(200).json({ success: true });
}
```

## Data Models

### Hygraph Schema Design

#### Content Relationships
- **Messages**: Standalone entries with status tracking
- **Services**: Can be referenced by chatbot knowledge base
- **News**: Can reference doctors as authors
- **Doctors**: Can have multiple specialties and availability slots

#### Permissions
- **Public**: Read access to published content
- **Admin**: Full CRUD access to all content
- **Editor**: Create/update content, no delete permissions

## Error Handling

### Frontend Error Handling
- GraphQL error boundaries
- Fallback content for failed queries
- Retry mechanisms for mutations
- User-friendly error messages

### Backend Error Handling
- Webhook retry logic with exponential backoff
- Email delivery failure handling
- Hygraph API rate limit handling
- Graceful degradation when services are unavailable

### Email Delivery
- Mailjet delivery status tracking
- Bounce and complaint handling
- Fallback notification methods
- Email template validation

## Testing Strategy

### Frontend Testing
- Unit tests for GraphQL queries and mutations
- Integration tests for form submissions
- E2E tests for critical user journeys
- Performance testing for large content loads

### Backend Testing
- Serverless function unit tests
- Webhook payload validation tests
- Email delivery integration tests
- Hygraph API integration tests

### Content Management Testing
- CMS workflow testing
- Content publishing validation
- Media upload and optimization tests
- Multi-user content editing scenarios

## Performance Considerations

### Caching Strategy
- Apollo Client cache for GraphQL queries
- CDN caching for static assets via Hygraph
- Browser caching for images and media
- Service worker for offline content access

### Optimization
- GraphQL query optimization and batching
- Image optimization through Hygraph transformations
- Lazy loading for non-critical content
- Code splitting for better initial load times

### Monitoring
- GraphQL query performance monitoring
- Email delivery rate tracking
- Webhook success/failure monitoring
- Content update propagation timing

## Security

### API Security
- Environment variable protection for API keys
- CORS configuration for GraphQL endpoints
- Rate limiting on serverless functions
- Input validation and sanitization

### Content Security
- Role-based access control in Hygraph
- Content approval workflows
- Asset access permissions
- Webhook signature verification

### Email Security
- SPF/DKIM configuration for Mailjet
- Email content sanitization
- Bounce and complaint handling
- Unsubscribe link management

## Migration Strategy

### Phase 1: Setup and Basic Content
1. Create Hygraph project and schema
2. Set up Mailjet account and templates
3. Migrate existing content from JSON files
4. Implement basic GraphQL queries

### Phase 2: Form Handling and Emails
1. Create serverless functions for form submission
2. Implement Mailjet email sending
3. Set up webhook handlers
4. Test email delivery and notifications

### Phase 3: Advanced Features
1. Implement news/blog functionality
2. Add doctor profile management
3. Set up content publishing workflows
4. Implement advanced caching strategies

### Phase 4: Optimization and Monitoring
1. Performance optimization
2. Monitoring and analytics setup
3. Error tracking and alerting
4. Documentation and training

## Deployment Architecture

### Frontend Deployment
- Vercel or Netlify for static site hosting
- Environment variables for GraphQL endpoints
- Build-time content pre-fetching where possible
- CDN distribution for global performance

### Serverless Functions
- Co-located with frontend (Vercel Functions/Netlify Functions)
- Environment variables for API keys
- Cold start optimization
- Error logging and monitoring

### Content Delivery
- Hygraph CDN for media assets
- GraphQL endpoint caching
- Content invalidation strategies
- Global content distribution