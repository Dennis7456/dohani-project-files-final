# Hygraph Content Models Setup Guide

This document provides the exact schema definitions needed to set up the Hygraph content models for the Dohani Medicare website.

## Content Models to Create

### 1. Medical Service

**Model Name:** `MedicalService`
**API ID:** `medicalService`
**Plural API ID:** `medicalServices`

**Fields:**
- `name` (Single Line Text) - Required, Unique
- `description` (Rich Text) - Required
- `keywords` (Multiple Values > Single Line Text) - Required
- `icon` (Single Line Text) - Optional (for icon class names)
- `featured` (Boolean) - Required, Default: false

**Permissions:**
- Public: Read
- Admin: Full access

### 2. Contact Information

**Model Name:** `ContactInfo`
**API ID:** `contactInfo`
**Plural API ID:** `contactInfos`

**Fields:**
- `phone` (Single Line Text) - Required
- `emergencyPhone` (Single Line Text) - Required
- `email` (Single Line Text) - Required
- `location` (Single Line Text) - Required

**Permissions:**
- Public: Read
- Admin: Full access

**Note:** This should be a singleton (only one record)

### 3. Working Hours

**Model Name:** `WorkingHours`
**API ID:** `workingHours`
**Plural API ID:** `workingHours`

**Fields:**
- `emergency` (Single Line Text) - Required
- `consultation` (Single Line Text) - Required
- `pharmacy` (Single Line Text) - Required
- `laboratory` (Single Line Text) - Required

**Permissions:**
- Public: Read
- Admin: Full access

**Note:** This should be a singleton (only one record)

### 4. Message

**Model Name:** `Message`
**API ID:** `message`
**Plural API ID:** `messages`

**Fields:**
- `name` (Single Line Text) - Required
- `email` (Single Line Text) - Required
- `message` (Rich Text) - Required
- `status` (Enumeration) - Required, Default: UNREAD
  - Values: UNREAD, READ, REPLIED
- `source` (Enumeration) - Required, Default: WEBSITE
  - Values: WEBSITE, CHATBOT

**Permissions:**
- Public: Create only
- Admin: Full access

### 5. News Article

**Model Name:** `NewsArticle`
**API ID:** `newsArticle`
**Plural API ID:** `newsArticles`

**Fields:**
- `title` (Single Line Text) - Required
- `excerpt` (Multi Line Text) - Optional
- `content` (Rich Text) - Required
- `featuredImage` (Asset) - Optional
- `author` (Single Line Text) - Required
- `featured` (Boolean) - Required, Default: false
- `publishedAt` (Date & Time) - Optional

**Permissions:**
- Public: Read (where publishedAt is not null)
- Admin: Full access

### 6. Doctor

**Model Name:** `Doctor`
**API ID:** `doctor`
**Plural API ID:** `doctors`

**Fields:**
- `name` (Single Line Text) - Required
- `specialty` (Single Line Text) - Required
- `qualifications` (Multiple Values > Single Line Text) - Required
- `bio` (Rich Text) - Optional
- `photo` (Asset) - Optional
- `consultationHours` (Single Line Text) - Optional
- `available` (Boolean) - Required, Default: true

**Permissions:**
- Public: Read (where available is true)
- Admin: Full access

## Setup Instructions

### Step 1: Create Hygraph Project
1. Go to [Hygraph](https://hygraph.com) and create a new project
2. Choose the "Professional" plan for production use
3. Select your preferred region (closest to your users)

### Step 2: Create Content Models
1. In the Hygraph dashboard, go to "Schema"
2. Create each content model listed above with the exact field specifications
3. Set up the permissions as specified for each model

### Step 3: Configure API Access
1. Go to "Settings" > "API Access"
2. Create a new "Permanent Auth Token" with the following permissions:
   - Read access to all public content
   - Create access for Messages
3. Copy the token for use in your environment variables

### Step 4: Set up Webhooks (Optional for now)
1. Go to "Settings" > "Webhooks"
2. Create webhooks for:
   - Message created: `POST https://your-domain.com/api/webhooks/message-created`
   - Content published: `POST https://your-domain.com/api/webhooks/content-updated`

### Step 5: Initial Content Population
After creating the models, populate them with initial data:

#### Contact Information (Create one record)
```json
{
  "phone": "+254-XXX-XXX-XXX",
  "emergencyPhone": "+254-XXX-XXX-XXX",
  "email": "info@dohanmedicare.com",
  "location": "Dohani Medicare Hospital"
}
```

#### Working Hours (Create one record)
```json
{
  "emergency": "24/7 - Open all day, every day",
  "consultation": "Monday to Saturday: 8:00 AM - 6:00 PM",
  "pharmacy": "24/7 - Open all day, every day",
  "laboratory": "Monday to Saturday: 7:00 AM - 7:00 PM"
}
```

#### Medical Services (Create multiple records)
```json
[
  {
    "name": "General Medicine",
    "description": "Comprehensive primary care services for all ages, including diagnosis, treatment, and preventive care.",
    "keywords": ["general", "medicine", "primary care", "gp", "doctor", "consultation"],
    "featured": true
  },
  {
    "name": "Cardiology",
    "description": "Expert cardiac care including ECG, stress tests, and heart disease management.",
    "keywords": ["heart", "cardiology", "cardiac", "ecg", "blood pressure"],
    "featured": true
  },
  {
    "name": "Pediatrics",
    "description": "Specialized healthcare for infants, children, and adolescents with compassionate care.",
    "keywords": ["children", "pediatrics", "kids", "baby", "vaccination"],
    "featured": true
  },
  {
    "name": "Laboratory Services",
    "description": "State-of-the-art diagnostic testing with accurate and timely results.",
    "keywords": ["lab", "laboratory", "test", "blood test", "diagnosis"],
    "featured": false
  },
  {
    "name": "Pharmacy",
    "description": "24/7 pharmacy services with a wide range of medications and professional consultation.",
    "keywords": ["pharmacy", "medicine", "medication", "drugs", "prescription"],
    "featured": false
  }
]
```

## Environment Variables Setup

After setting up Hygraph, update your `.env` file:

```env
VITE_HYGRAPH_ENDPOINT=https://api-[region].hygraph.com/v2/[project-id]/master
VITE_HYGRAPH_TOKEN=your_permanent_auth_token_here
```

## Testing the Setup

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Test GraphQL queries in the browser console or use the Hygraph API Playground
4. Verify that content appears correctly on the website

## Next Steps

Once the basic setup is complete, you can:
1. Set up serverless functions for form handling
2. Configure Mailjet for email notifications
3. Implement the admin interface updates
4. Add webhook handlers for real-time updates
#
## 7. Appointment

**Model Name:** `Appointment`
**API ID:** `appointment`
**Plural API ID:** `appointments`

**Fields:**
- `firstName` (Single Line Text) - Required
- `lastName` (Single Line Text) - Required
- `email` (Single Line Text) - Required
- `phone` (Single Line Text) - Required
- `dateOfBirth` (Single Line Text) - Optional
- `appointmentType` (Single Line Text) - Required
- `preferredDate` (Date) - Required
- `preferredTime` (Single Line Text) - Required
- `doctor` (Single Line Text) - Optional
- `reason` (Multi Line Text) - Required
- `symptoms` (Multi Line Text) - Optional
- `previousVisit` (Boolean) - Required, Default: false
- `emergencyContact` (Single Line Text) - Optional
- `hasInsurance` (Boolean) - Required, Default: false
- `insuranceProvider` (Single Line Text) - Optional
- `policyNumber` (Single Line Text) - Optional
- `status` (Enumeration) - Required, Default: PENDING
  - Values: PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW, RESCHEDULED

**Permissions:**
- Public: Create only
- Admin: Full access

**Note:** This model stores all appointment bookings from patients

## GraphQL Schema Reference

```graphql
type Appointment {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  phone: String!
  dateOfBirth: String
  appointmentType: String!
  preferredDate: Date!
  preferredTime: String!
  doctor: String
  reason: String!
  symptoms: String
  previousVisit: Boolean!
  emergencyContact: String
  hasInsurance: Boolean!
  insuranceProvider: String
  policyNumber: String
  status: AppointmentStatus!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
  NO_SHOW
  RESCHEDULED
}
```