# 🔑 Token Troubleshooting Guide

## 🚨 **Current Issue**
Even with the updated token, we're still getting:
```
❌ token verification failed: crypto/rsa: verification error
```

## 🔍 **Possible Causes & Solutions**

### **1. Token Permissions Issue**
The token might not have the correct permissions.

#### **Fix: Check Token Permissions**
1. **Go to Hygraph**: https://app.hygraph.com
2. **Navigate to**: Settings → API Access
3. **Find your token** and check permissions:

**Required Permissions:**
```
Content API Permissions:
✅ Read
✅ Create
✅ Update
✅ Delete (optional)

Management API Permissions:
✅ Read (for schema introspection)
```

### **2. Wrong API Endpoint**
The token might be for a different environment or project.

#### **Fix: Verify Endpoint & Project**
1. **In Hygraph Console**: Check your project URL
2. **Verify Project ID**: Should be `cmgr5l0iu00pf07wf9zpyrn3d`
3. **Check Environment**: Should be `master`

**Current Endpoint:**
```
https://us-west-2.cdn.hygraph.com/content/cmgr5l0iu00pf07wf9zpyrn3d/master
```

### **3. Token Type Mismatch**
You might have created a Management API token instead of Content API token.

#### **Fix: Create Content API Token**
1. **In Hygraph**: Settings → API Access
2. **Click "Create Token"**
3. **Select "Permanent Auth Token"** (not Management API)
4. **Set Permissions** as listed above
5. **Copy the new token**

### **4. Token Format Issue**
The token might be corrupted or incomplete.

#### **Fix: Generate Fresh Token**
1. **Delete existing token** in Hygraph
2. **Create completely new token**
3. **Copy entire token** (starts with `eyJ...`)
4. **Update .env file** carefully

## 🧪 **Step-by-Step Token Recreation**

### **Step 1: Delete Old Token**
1. Go to Hygraph → Settings → API Access
2. Find your current token
3. Click "Delete" to remove it

### **Step 2: Create New Token**
1. Click **"Create Token"**
2. **Name**: `Dohani Medicare Website`
3. **Type**: **Permanent Auth Token** (not Management API)

### **Step 3: Set Permissions**
```
Content API:
✅ Read - Allow
✅ Create - Allow  
✅ Update - Allow
✅ Delete - Allow (optional)

Management API:
✅ Read - Allow (for schema introspection)
❌ Create - Deny
❌ Update - Deny
❌ Delete - Deny
```

### **Step 4: Copy Token Carefully**
1. **Copy the ENTIRE token** (very long string)
2. **Starts with**: `eyJhbGciOiJSUzI1NiIs...`
3. **Ends with**: `...long string of characters`

### **Step 5: Update .env File**
```env
VITE_HYGRAPH_TOKEN=your_complete_new_token_here
```

### **Step 6: Restart Everything**
```bash
# Stop dev server (Ctrl+C)
npm run dev
```

### **Step 7: Test Connection**
```bash
node test-hygraph-connection.js
```

**Expected Success Output:**
```
✅ Connection successful!
❌ Appointment schema does NOT exist (or ✅ exists)
```

## 🔄 **Alternative: Test with Hygraph Playground**

### **Verify Token in Hygraph Console:**
1. **Go to**: Your Hygraph project → API Playground
2. **Test this query**:
```graphql
query TestConnection {
  __typename
}
```
3. **Should return**: `{ "data": { "__typename": "Query" } }`

If this fails in Hygraph's own playground, the token definitely has issues.

## 🎯 **Quick Verification Steps**

### **Check 1: Token Length**
Your token should be **very long** (1000+ characters). If it's short, it's incomplete.

### **Check 2: Token Format**
Should have this structure:
```
eyJ[header].[payload].[signature]
```
Three parts separated by dots.

### **Check 3: Project Match**
In the token payload (middle section), verify it contains your project ID.

### **Check 4: Permissions**
Token must have **Content API Create** permission for appointment booking.

## 🚨 **If Still Failing**

### **Option 1: Use Different Token Type**
Try creating a **Management API token** instead:
1. Settings → API Access → Management API
2. Create token with full permissions
3. Test connection

### **Option 2: Check Project Status**
1. Verify your Hygraph project is active
2. Check if there are any billing issues
3. Ensure project hasn't been suspended

### **Option 3: Contact Hygraph Support**
If token creation keeps failing, there might be an account issue.

## 🎉 **Expected Result After Fix**

Once the token is working:
```bash
npm run check-schema
```

**Should show:**
```
✅ Hygraph connection successful
✅ Appointment schema exists
✅ Appointment creation works!
🎉 Your Appointment schema is fully configured and working!
```

## 📞 **Next Steps**

1. **Follow the token recreation steps above**
2. **Test with `node test-hygraph-connection.js`**
3. **If successful, test appointment booking**
4. **If still failing, try Management API token**

**The token issue is the only thing preventing your appointment system from working perfectly! 🔑✨**