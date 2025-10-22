# 🔑 Hygraph Token Refresh Guide

## 🚨 **Current Issue**
Your Hygraph API token has expired, causing:
- ❌ **400 Bad Request** errors in appointment booking
- ❌ **Token verification failed** in schema checker
- ⚠️ **Fallback storage** being used instead of CMS

## 🔧 **Fix: Refresh Your Hygraph Token**

### **Step 1: Go to Hygraph Console**
1. Open: https://app.hygraph.com
2. Sign in to your account
3. Select your **dohani-medicare** project

### **Step 2: Generate New API Token**
1. Go to **Settings** → **API Access**
2. Find your existing token or create a new one
3. Click **"Create Token"** or **"Regenerate"**

### **Step 3: Configure Token Permissions**
Make sure your token has these permissions:
```
Content API:
✅ Read (for querying data)
✅ Create (for appointment booking)
✅ Update (for status changes)
✅ Delete (for cleanup/testing)

Management API:
✅ Read (for schema introspection)
```

### **Step 4: Copy the New Token**
1. **Copy the full token** (starts with `eyJ...`)
2. **Save it securely** - you won't see it again

### **Step 5: Update Your .env File**
Replace the old token in your `.env` file:

```env
# OLD TOKEN (expired):
VITE_HYGRAPH_TOKEN=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NjA2NTYyNzAsImF1ZCI6WyJodHRwczovL2FwaS11cy13ZXN0LTIuaHlncmFwaC5jb20vdjIvY21ncjVsMGl1MDBwZjA3d2Y5enB5cm4zZC9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC51cy13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiY2FiMTY5NDktNzQwZC00NmUwLWJjN2ItNjhiNWVkYjI5NTBmIiwianRpIjoiY21ndTFhOHp3MGVqMzA3bjBjbmMxMWk3cyJ9.1tzeUM9M_QbyvZPa3Oi2dwySLm0w40tK5dD4nu-KF3zi5SjIbfl_EgCpPSbbS9GfRmaT-5ps2pgA90GfU5_X3SwKaSybYN0f9Ooq8GZ0TEZkTSWlrC2jQ6au-z2YsajdE8oyFF84Oc7oVDfYU59983PBI-vMV8i_tFz9j4ubRdVgYkU63ir4oGbznNkjovzcz_A-cIV_i_nTHhkEMR8PvqpSNoYICjGL3-6sRedwps1PRbMaYpbrW7CAYyZ-Z7_V7IBP-1TnViVzns_FmuP5MQ_ERVMAZIeLwRvVwE8FlR6M2_OxCqpoP0CmsmgUNRBcjGT6S5YS6zSB1Y1Xdyms82RSSPMt-j1P237sjR_OM_AdZQ78dratBIb7UC2obEA6RTjUrmLtAOlZzbWe11cVaguCpSBjQT3zKj8Umm-2FSdsMMQ5LO9QU5EGHRWjbdh9GD1CIBNI3HOEv7GPfymjW5vNrFLWq74-No-bKCppQMRICXWgGltSx8SZIdRZFiVq9o403KiDF_22T5ub8NxWaDJt5lskKwd6UL-4qixTT4n5ZrYsWK9MbZh8spQVznR6eNlEe_Y11_7YM8HpImP-h2WCFO9m4vA_bfIFj5o5Zx9Q0UwrNyAuBT_SBkyBIUeDmJKAnx6PtSeY8LLkDN8tqhobsmk1tELUbl0owJlZleM

# NEW TOKEN (replace with your fresh token):
VITE_HYGRAPH_TOKEN=your_new_token_here
```

### **Step 6: Restart Your Development Server**
```bash
# Stop your dev server (Ctrl+C)
# Then restart:
npm run dev
```

## 🧪 **Test the New Token**

### **Test 1: Connection Test**
```bash
node test-hygraph-connection.js
```

**Expected Output:**
```
✅ Connection successful!
❌ Appointment schema does NOT exist
```

### **Test 2: Schema Checker**
```bash
npm run check-schema
```

**Expected Output:**
```
✅ Hygraph connection successful
❌ Appointment schema does NOT exist in Hygraph
```

## 🏗️ **After Token Refresh: Create Appointment Schema**

Once your token works, you need to create the Appointment schema:

### **Step 1: Go to Schema Section**
1. In Hygraph console: **Schema** → **Add Model**
2. **Model Name**: Appointment
3. **API ID**: appointment

### **Step 2: Add Required Fields**
```
firstName: Single Line Text (Required)
lastName: Single Line Text (Required)
email: Single Line Text (Required)
phone: Single Line Text (Required)
appointmentType: Single Line Text (Required)
preferredDate: Single Line Text (Required)
preferredTime: Single Line Text (Required)
reason: Multi Line Text (Required)
previousVisit: Boolean (Required, default: false)
hasInsurance: Boolean (Required, default: false)
status: Single Line Text (Required, default: "PENDING")
```

### **Step 3: Add Optional Fields**
```
dateOfBirth: Single Line Text (Optional)
doctor: Single Line Text (Optional)
symptoms: Multi Line Text (Optional)
emergencyContact: Single Line Text (Optional)
insuranceProvider: Single Line Text (Optional)
policyNumber: Single Line Text (Optional)
```

### **Step 4: Set API Permissions**
```
Public API Permissions:
✅ Create (for appointment booking)
❌ Read, Update, Delete (for privacy)

Management API Permissions:
✅ All operations (for admin)
```

### **Step 5: Save and Deploy**
1. **Save Model**
2. **Deploy Schema** changes

## 🎯 **Final Test**

### **Test Appointment Booking:**
1. **Go to your website**: https://dohani-medicare-560e6.web.app
2. **Click "Book Appointment"**
3. **Fill out the form**
4. **Submit** - should work without errors!

### **Verify in CMS:**
1. **Go to Hygraph** → **Content** → **Appointments**
2. **Check for new appointments**

## 📊 **Expected Results**

### **After Token Refresh + Schema Creation:**
- ✅ **No more 400 errors** in appointment booking
- ✅ **Appointments save directly** to Hygraph CMS
- ✅ **Admin dashboard** shows real appointments
- ✅ **Schema checker** passes all tests
- ✅ **Professional appointment workflow**

## 🔄 **Current Fallback System**

While you fix the token and create the schema:
- ✅ **Appointments are preserved** in local storage
- ✅ **Users get success confirmations**
- ✅ **Email preparation** continues working
- ✅ **No appointments are lost**

### **View Stored Appointments:**
```javascript
// In browser console:
console.log('Stored appointments:', JSON.parse(localStorage.getItem('appointments') || '[]'))
```

## 🆘 **Troubleshooting**

### **Token Still Not Working:**
- **Check token permissions** in Hygraph
- **Verify project ID** matches your endpoint
- **Try creating a completely new token**

### **Schema Creation Issues:**
- **Follow exact field names** (case-sensitive)
- **Set correct field types** (String, Boolean)
- **Check API permissions** are enabled

## 🎉 **Success Indicators**

You'll know everything is working when:
- ✅ **Schema checker** shows all green checkmarks
- ✅ **Appointment booking** works without console errors
- ✅ **New appointments** appear in Hygraph CMS
- ✅ **Admin dashboard** shows real data

**Your appointment booking system will be fully functional once the token is refreshed and schema is created! 🏥✨**