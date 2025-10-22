# 🏥 Hygraph Appointment Schema Setup Guide

## 🚨 **Current Issue**
Your appointment booking is getting a **400 Bad Request** error because the **Appointment schema fields don't match** what the GraphQL mutation expects.

## ✅ **Fixed GraphQL Mutation**
I've updated the GraphQL mutation to match the actual form data structure being sent.

## 🏗️ **Create Appointment Schema in Hygraph**

### **Step 1: Access Your Hygraph Project**
1. Go to: https://app.hygraph.com
2. Select your project: **dohani-medicare**
3. Navigate to **Schema** section

### **Step 2: Create Appointment Model**
Click **"Add Model"** and configure:
```
Model Name: Appointment
API ID: appointment
Plural API ID: appointments
Description: Patient appointment bookings
```

### **Step 3: Add Required Fields**

#### **Personal Information Fields:**
```
Field Name: firstName
Type: Single Line Text
API ID: firstName
Required: ✅ Yes
```

```
Field Name: lastName  
Type: Single Line Text
API ID: lastName
Required: ✅ Yes
```

```
Field Name: email
Type: Single Line Text
API ID: email
Required: ✅ Yes
Validations: Email format
```

```
Field Name: phone
Type: Single Line Text
API ID: phone
Required: ✅ Yes
```

```
Field Name: dateOfBirth
Type: Single Line Text
API ID: dateOfBirth
Required: ❌ No
```

```
Field Name: emergencyContact
Type: Single Line Text
API ID: emergencyContact
Required: ❌ No
```

#### **Appointment Details Fields:**
```
Field Name: appointmentType
Type: Single Line Text
API ID: appointmentType
Required: ✅ Yes
Default Value: "general"
```

```
Field Name: preferredDate
Type: Single Line Text
API ID: preferredDate
Required: ✅ Yes
```

```
Field Name: preferredTime
Type: Single Line Text
API ID: preferredTime
Required: ✅ Yes
```

```
Field Name: doctor
Type: Single Line Text
API ID: doctor
Required: ❌ No
```

#### **Medical Information Fields:**
```
Field Name: reason
Type: Multi Line Text
API ID: reason
Required: ✅ Yes
```

```
Field Name: symptoms
Type: Multi Line Text
API ID: symptoms
Required: ❌ No
```

```
Field Name: previousVisit
Type: Boolean
API ID: previousVisit
Required: ✅ Yes
Default Value: false
```

#### **Insurance Fields:**
```
Field Name: hasInsurance
Type: Boolean
API ID: hasInsurance
Required: ✅ Yes
Default Value: false
```

```
Field Name: insuranceProvider
Type: Single Line Text
API ID: insuranceProvider
Required: ❌ No
```

```
Field Name: policyNumber
Type: Single Line Text
API ID: policyNumber
Required: ❌ No
```

#### **Status Field:**
```
Field Name: status
Type: Enumeration
API ID: status
Required: ✅ Yes
Default Value: PENDING

Enumeration Values:
- PENDING
- CONFIRMED  
- COMPLETED
- CANCELLED
- NO_SHOW
- RESCHEDULED
```

### **Step 4: Configure API Permissions**

#### **Public API Permissions (for appointment booking):**
```
Create: ✅ Allow
Read: ❌ Deny (for patient privacy)
Update: ❌ Deny
Delete: ❌ Deny
```

#### **Admin/Management API Permissions:**
```
Create: ✅ Allow
Read: ✅ Allow
Update: ✅ Allow
Delete: ✅ Allow
```

### **Step 5: Save and Deploy Schema**
1. Click **"Save Model"**
2. Go to **Settings** → **API Access**
3. Ensure your API token has **Create** permissions for Appointments
4. **Deploy** the schema changes

## 🧪 **Test Schema Setup**

### **Test in Hygraph API Playground:**
```graphql
mutation TestCreateAppointment {
  createAppointment(data: {
    firstName: "John"
    lastName: "Doe"
    email: "john.doe@example.com"
    phone: "0798057622"
    dateOfBirth: "1990-01-15"
    appointmentType: "general"
    preferredDate: "2025-01-20"
    preferredTime: "10:00"
    doctor: "1"
    reason: "Regular checkup"
    symptoms: "No specific symptoms"
    previousVisit: false
    emergencyContact: "0798057622"
    hasInsurance: true
    insuranceProvider: "NHIF"
    policyNumber: "12345"
    status: "PENDING"
  }) {
    id
    firstName
    lastName
    email
    phone
    appointmentType
    preferredDate
    preferredTime
    status
    createdAt
  }
}
```

### **Expected Response:**
```json
{
  "data": {
    "createAppointment": {
      "id": "cm4abc123def456",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "0798057622",
      "appointmentType": "general",
      "preferredDate": "2025-01-20",
      "preferredTime": "10:00",
      "status": "PENDING",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

## 🔄 **After Schema Setup**

### **1. Test Appointment Booking**
- Go to your website: https://dohani-medicare-560e6.web.app
- Click **"Book Appointment"**
- Fill out the 4-step form
- Submit and check for success

### **2. Verify in Hygraph CMS**
- Go to **Content** section in Hygraph
- Look for **Appointments** content type
- Verify new appointments appear

### **3. Check Admin Dashboard**
- Go to: https://dohani-medicare-560e6.web.app/admin/appointments
- Verify appointments display correctly

## 📊 **Current Fallback System**

While setting up the schema, appointments are stored locally:

### **View Stored Appointments:**
```javascript
// In browser console:
console.log('Stored Appointments:', JSON.parse(localStorage.getItem('appointments') || '[]'))
```

### **View Pending Emails:**
```javascript
// In browser console:  
console.log('Pending Emails:', JSON.parse(localStorage.getItem('pendingEmails') || '[]'))
```

## 🚀 **Benefits After Setup**

### **✅ What Will Work:**
- **Real-time appointment storage** in Hygraph CMS
- **Admin dashboard** showing all appointments
- **Appointment management** (status updates, scheduling)
- **Data persistence** across sessions
- **Professional workflow** for healthcare management

### **✅ What's Already Working:**
- **Appointment booking form** (4-step wizard)
- **Form validation** and user experience
- **Email preparation** for confirmations
- **Fallback storage** ensuring no data loss
- **Admin notifications** for new bookings

## 🎯 **Next Steps**

### **Immediate (Required - 15 minutes):**
1. **Create Appointment schema** in Hygraph using the fields above
2. **Test the mutation** in API Playground
3. **Test appointment booking** on your website
4. **Verify appointments appear** in CMS

### **Optional (Enhanced Experience):**
1. **Set up email service** (EmailJS/Mailjet) for automatic confirmations
2. **Configure email templates** with Dohani branding
3. **Set up SMS notifications** for appointment reminders
4. **Add appointment calendar** integration

## 🎉 **Expected Result**

Once the Appointment schema is created with these exact fields:

- ✅ **Appointments save directly to Hygraph CMS**
- ✅ **No more 400 Bad Request errors**
- ✅ **Admin dashboard shows real appointments**
- ✅ **Professional appointment management system**
- ✅ **Complete healthcare workflow**

**Your appointment booking will be fully functional with proper CMS integration! 📅✨**

## 🆘 **If You Need Help**

If you encounter any issues:
1. **Check the browser console** for specific error messages
2. **Verify field names match exactly** as specified above
3. **Ensure API permissions** are set correctly
4. **Test the mutation** in Hygraph API Playground first

The appointment booking system is now properly configured to work with your Hygraph CMS once the schema is created!