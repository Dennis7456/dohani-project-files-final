# Hygraph ContactMessage Model Setup Guide

## 🚨 **Current Issue**
The contact form is showing this error:
```
CMS Error: [line: 8] field 'createContactMessage' is not defined in 'Mutation'
```

This means the **ContactMessage model doesn't exist** in your Hygraph schema yet.

## ✅ **Solution: Create ContactMessage Model**

### Step 1: Access Your Hygraph Project
1. Go to [Hygraph Dashboard](https://app.hygraph.com/)
2. Select your project: `cmgr5l0iu00pf07wf9zpyrn3d`

### Step 2: Create the ContactMessage Model
1. **Navigate to Schema**
   - Click on "Schema" in the left sidebar
   - Click on "Models" tab

2. **Add New Model**
   - Click the "+" button or "Add Model"
   - **Model Name**: `ContactMessage`
   - **API ID**: `ContactMessage` (should auto-generate)
   - **Plural API ID**: `ContactMessages` (should auto-generate)

3. **Add Fields**
   Click "Add Field" for each of these:

   **Field 1: Name**
   - **Field Type**: Single line text
   - **Display Name**: `Name`
   - **API ID**: `name`
   - **Required**: ✅ Yes
   - **Validations**: 
     - Min length: 2
     - Max length: 100

   **Field 2: Email**
   - **Field Type**: Single line text
   - **Display Name**: `Email`
   - **API ID**: `email`
   - **Required**: ✅ Yes
   - **Validations**:
     - Pattern: Email format

   **Field 3: Message**
   - **Field Type**: Multi line text
   - **Display Name**: `Message`
   - **API ID**: `message`
   - **Required**: ✅ Yes
   - **Validations**:
     - Min length: 10
     - Max length: 1000

   **Field 4: Status**
   - **Field Type**: Single line text
   - **Display Name**: `Status`
   - **API ID**: `status`
   - **Required**: ✅ Yes
   - **Default Value**: `NEW`
   - **Validations**:
     - Enumeration: `NEW`, `READ`, `RESPONDED`, `CLOSED`

### Step 3: Configure Permissions
1. **Go to Settings → API Access**
2. **Find your Permanent Auth Token**
3. **Edit Permissions** for your token:
   - **ContactMessage Model**:
     - ✅ Create
     - ✅ Read
     - ✅ Update (optional)
     - ✅ Delete (optional)

### Step 4: Publish Schema
1. **Click "Publish" button** (top right)
2. **Confirm publication**
3. Wait for schema to be deployed

## 🧪 **Test the Setup**

### Option 1: Run Setup Script
```bash
npm run setup-contact-messages
```

### Option 2: Manual Test
1. Go to your website
2. Fill out the contact form
3. Submit the message
4. Check Hygraph CMS for the new record

## 🔧 **Enable CMS Integration**

Once the model is created, uncomment the CMS code in `src/App.jsx`:

1. **Find this section** (around line 100):
```javascript
// TODO: Uncomment this section once ContactMessage model is created in Hygraph
/*
const hygraphEndpoint = ...
```

2. **Remove the comment blocks** (`/*` and `*/`)

3. **Comment out the temporary fallback code**:
```javascript
// Temporary fallback - comment this out once CMS is ready
/*
await new Promise(resolve => setTimeout(resolve, 1500))
const messageId = `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
console.log('Contact Form Submission:', { ... })
*/
```

## 📋 **Expected Schema Structure**

After setup, your ContactMessage model should look like this:

```graphql
type ContactMessage {
  id: ID!
  name: String!
  email: String!
  message: String!
  status: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input ContactMessageCreateInput {
  name: String!
  email: String!
  message: String!
  status: String!
}

type Mutation {
  createContactMessage(data: ContactMessageCreateInput!): ContactMessage
  updateContactMessage(where: ContactMessageWhereUniqueInput!, data: ContactMessageUpdateInput!): ContactMessage
  deleteContactMessage(where: ContactMessageWhereUniqueInput!): ContactMessage
}

type Query {
  contactMessage(where: ContactMessageWhereUniqueInput!): ContactMessage
  contactMessages(where: ContactMessageWhereInput, orderBy: ContactMessageOrderByInput, skip: Int, first: Int): [ContactMessage!]!
}
```

## 🎯 **Verification Checklist**

- [ ] ContactMessage model created in Hygraph
- [ ] All 4 fields added (name, email, message, status)
- [ ] Required validations set
- [ ] API permissions configured
- [ ] Schema published
- [ ] Setup script runs successfully
- [ ] Contact form submits without errors
- [ ] Messages appear in Hygraph CMS

## 🔍 **Troubleshooting**

### "Field not defined" Error
- Ensure the model is published
- Check API permissions include Create/Read
- Verify field names match exactly

### "Token verification failed" Error
- Check your VITE_HYGRAPH_TOKEN in .env
- Ensure token has proper permissions
- Try regenerating the token

### "Network Error"
- Check your internet connection
- Verify Hygraph endpoint URL
- Check browser console for CORS issues

## 📧 **Next Steps: Email Notifications**

After the ContactMessage model is working:

1. **Deploy to Netlify** for serverless functions
2. **Set up SendGrid** for email notifications
3. **Configure staff email list**
4. **Enable email notifications** in the Netlify function

## 📞 **Support**

If you encounter issues:
1. Check the browser console for detailed errors
2. Verify all environment variables are set
3. Test the GraphQL endpoint directly
4. Contact Hygraph support if schema issues persist

---

**Remember**: The contact form currently uses a temporary fallback that logs messages to the console. Once you create the ContactMessage model and uncomment the CMS code, messages will be saved to your Hygraph CMS!