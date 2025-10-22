# 🧪 Test Appointment Mutation

## 🎯 **Schema Alignment Complete!**

I've updated all GraphQL mutations to match your exact Hygraph schema:

### **✅ Fixed Issues:**
- **Required fields**: `firstName`, `lastName`, `email`, `phone`, `appointmentType`, `preferredDateTime`, `dateOfBirth`
- **Optional fields**: `reason`, `previousVisit`, `hasInsurance`, `appointmentStatus`, `insuranceProvider`, `policyNumber`
- **Enum values**: Using your exact enum values (`generalConsultation`, `pending`, etc.)
- **Data types**: Proper DateTime formatting, RichText structure

## 🧪 **Test in Hygraph Playground**

Run this mutation in your Hygraph Playground to verify it works:

```graphql
mutation TestCreateAppointment {
  createAppointment(
    data: {
      firstName: "Test"
      lastName: "Patient"
      email: "test@example.com"
      phone: "0700000000"
      appointmentType: generalConsultation
      preferredDateTime: "2025-01-20T10:00:00.000Z"
      dateOfBirth: "1990-01-15T00:00:00.000Z"
      reason: {
        children: [
          {
            type: "paragraph"
            children: [
              { text: "Test appointment for schema validation" }
            ]
          }
        ]
      }
      previousVisit: false
      hasInsurance: true
      appointmentStatus: pending
      insuranceProvider: "Test Insurance"
      policyNumber: "TEST123"
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
    createdAt
  }
}
```

## 🎯 **Expected Result**

If successful, you should see:
```json
{
  "data": {
    "createAppointment": {
      "id": "cm4abc123def456",
      "firstName": "Test",
      "lastName": "Patient",
      "email": "test@example.com",
      "phone": "0700000000",
      "appointmentType": "generalConsultation",
      "preferredDateTime": "2025-01-20T10:00:00.000Z",
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "reason": {
        "text": "Test appointment for schema validation"
      },
      "previousVisit": false,
      "hasInsurance": true,
      "appointmentStatus": "pending",
      "insuranceProvider": "Test Insurance",
      "policyNumber": "TEST123",
      "createdAt": "2025-10-21T11:00:00.000Z"
    }
  }
}
```

## 🔧 **If Mutation Fails**

If you get errors, check:
1. **Field names** - Must match exactly
2. **Required fields** - All NON_NULL fields must be provided
3. **Enum values** - Must use exact enum names
4. **Data types** - DateTime format, RichText structure

## 🚀 **After Successful Test**

Once the mutation works in Playground:

1. **Restart your dev server**: `npm run dev`
2. **Test appointment booking** on your website
3. **Should now save to CMS** without errors!

## 📊 **Updated Appointment Type Mapping**

Your form sends `"general"` but Hygraph expects `generalConsultation`. I've added mapping:

```javascript
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
```

## 🎉 **Ready to Test!**

Your appointment booking system is now perfectly aligned with your Hygraph schema. Once you confirm the mutation works in Playground, your website appointments should save directly to CMS! 🏥✨