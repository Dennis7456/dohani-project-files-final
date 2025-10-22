# 🔍 Hygraph Schema Checker Guide

## 📋 **Overview**
I've created multiple tools to help you check if your Hygraph Appointment schema is properly configured for the Dohani Medicare booking system.

## 🛠️ **Available Schema Checkers**

### **1. Simple Node.js Checker (Recommended)**
**File**: `check-schema.js`
**Usage**: 
```bash
npm run check-schema
# or
node check-schema.js
```

**Features**:
- ✅ Uses your actual Hygraph configuration
- ✅ Tests connection to Hygraph
- ✅ Checks if Appointment schema exists
- ✅ Tests appointment creation
- ✅ Automatic cleanup of test data
- ✅ Clear, colored output

### **2. Advanced Node.js Checker**
**File**: `scripts/check-hygraph-schema.js`
**Usage**:
```bash
npm run check-schema:advanced
# or
node scripts/check-hygraph-schema.js
```

**Features**:
- ✅ Full schema introspection
- ✅ Field-by-field validation
- ✅ Required vs optional field checking
- ✅ Detailed error reporting
- ✅ Comprehensive status report

### **3. Browser-Based Checker**
**File**: `hygraph-schema-checker.html`
**Usage**: Open in browser from your project root

**Features**:
- ✅ Visual interface with buttons
- ✅ Real-time logging
- ✅ Field status indicators
- ✅ Interactive testing
- ✅ No command line needed

## 🚀 **Quick Start**

### **Step 1: Run the Simple Checker**
```bash
npm run check-schema
```

### **Expected Output if Schema Exists:**
```
🏥 HYGRAPH APPOINTMENT SCHEMA CHECKER

ℹ Using Hygraph configuration from your project
ℹ Testing Hygraph connection...
✅ Hygraph connection successful
ℹ Checking if Appointment schema exists...
✅ Appointment schema exists in Hygraph
ℹ Found 0 existing appointments
ℹ Testing appointment creation...
✅ Appointment creation works!
ℹ Test appointment created with ID: cm4abc123def456
ℹ Test appointment cleaned up

📊 SUMMARY
✅ Your Appointment schema is fully configured and working!
✅ Your appointment booking system should work perfectly
```

### **Expected Output if Schema Missing:**
```
🏥 HYGRAPH APPOINTMENT SCHEMA CHECKER

ℹ Using Hygraph configuration from your project
ℹ Testing Hygraph connection...
✅ Hygraph connection successful
ℹ Checking if Appointment schema exists...
❌ Appointment schema does NOT exist in Hygraph

📊 SUMMARY
❌ Appointment schema does not exist in Hygraph
🏗️ You need to create the Appointment schema:
   1. Go to https://app.hygraph.com
   2. Select your dohani-medicare project
   3. Navigate to Schema → Add Model
   4. Follow the guide in HYGRAPH_APPOINTMENT_SCHEMA_SETUP.md
   5. Run this script again to verify
```

## 🏗️ **If Schema Doesn't Exist**

### **Create the Appointment Schema:**
1. **Go to Hygraph**: https://app.hygraph.com
2. **Select your project**: dohani-medicare
3. **Navigate to Schema** → **Add Model**
4. **Follow the detailed guide**: `HYGRAPH_APPOINTMENT_SCHEMA_SETUP.md`

### **Required Fields to Create:**
```
firstName: String (Required)
lastName: String (Required)
email: String (Required)
phone: String (Required)
appointmentType: String (Required)
preferredDate: String (Required)
preferredTime: String (Required)
reason: String (Required)
previousVisit: Boolean (Required, default: false)
hasInsurance: Boolean (Required, default: false)
status: String (Required, default: "PENDING")
```

### **Optional Fields:**
```
dateOfBirth: String
doctor: String
symptoms: String
emergencyContact: String
insuranceProvider: String
policyNumber: String
```

## 🧪 **Testing Your Schema**

### **After Creating the Schema:**
1. **Run the checker again**:
   ```bash
   npm run check-schema
   ```

2. **Test appointment booking** on your website:
   - Go to: https://dohani-medicare-560e6.web.app
   - Click "Book Appointment"
   - Fill out the form
   - Submit and check for success

3. **Check Hygraph CMS**:
   - Go to your Hygraph project
   - Navigate to Content → Appointments
   - Verify new appointments appear

## 🔧 **Troubleshooting**

### **Connection Issues:**
```
❌ Connection failed: fetch failed
```
**Solution**: Check your internet connection and Hygraph token

### **Schema Field Issues:**
```
❌ Appointment creation failed: Field 'firstName' of required type 'String!' was not provided
```
**Solution**: Ensure all required fields are created in your schema

### **Permission Issues:**
```
❌ Appointment creation failed: Not authorized
```
**Solution**: Check API permissions in Hygraph for the Appointment model

## 📊 **Understanding the Results**

### **✅ Success Indicators:**
- **Connection successful**: Hygraph is reachable
- **Schema exists**: Appointment model is created
- **Creation works**: All fields are properly configured
- **Test cleaned up**: Permissions are correct

### **❌ Error Indicators:**
- **Connection failed**: Network or token issues
- **Schema missing**: Need to create Appointment model
- **Creation failed**: Field or permission issues
- **Cleanup failed**: Delete permissions missing (okay)

## 🎯 **Next Steps After Success**

### **When Schema Check Passes:**
1. **Test real appointment booking** on your website
2. **Check admin dashboard** at `/admin/appointments`
3. **Verify email preparation** works
4. **Set up email service** (optional)

### **Your Appointment System Will:**
- ✅ **Save appointments directly** to Hygraph CMS
- ✅ **Show in admin dashboard** with real data
- ✅ **Prepare confirmation emails** automatically
- ✅ **Handle all appointment types** and fields
- ✅ **Provide professional experience** for patients

## 🔗 **Related Files**

- **`HYGRAPH_APPOINTMENT_SCHEMA_SETUP.md`** - Detailed schema creation guide
- **`APPOINTMENT_BOOKING_STATUS.md`** - Current system status
- **`src/graphql/queries.js`** - GraphQL mutations and queries
- **`src/services/appointmentService.js`** - Appointment booking service

## 🆘 **Need Help?**

If the schema checker shows issues:
1. **Follow the error messages** - they're specific and actionable
2. **Check the setup guide** - step-by-step instructions
3. **Verify field names match exactly** - case-sensitive
4. **Ensure API permissions** are set correctly

**Your appointment booking system is ready to work perfectly once the schema is created! 🏥✨**