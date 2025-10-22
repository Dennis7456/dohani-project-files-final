# Debug Services Not Displaying Issue

## 🔍 **Step 1: Check if Services Exist in Hygraph**

Run this query in your **Hygraph API Playground**:

```graphql
query TestMedicalServices {
  medicalServices {
    id
    name
    featured
    description {
      text
    }
    keywords
    icon
    servicesOffered
  }
}
```

**Expected Result:** Should return your 5 services (cardiology, pharmacy, etc.)

## 🔍 **Step 2: Check Publication Status**

In Hygraph, make sure your services are **PUBLISHED**:

1. Go to **Content** tab in Hygraph
2. Find your **MedicalService** entries
3. Check if they show **"Published"** status
4. If not, click **"Publish"** on each service

## 🔍 **Step 3: Check Browser Console**

1. Open your website
2. Open **Developer Tools** (F12)
3. Go to **Console** tab
4. Look for debug logs:
   - `Homepage Data Debug:`
   - `All Services Debug:`

**What to look for:**
- `loading: false` (should not be stuck loading)
- `error: null` (should not have GraphQL errors)
- `medicalServices: [...]` (should contain your services)
- `medicalServicesCount: 5` (should show correct count)

## 🔍 **Step 4: Check Network Tab**

1. In Developer Tools, go to **Network** tab
2. Refresh the page
3. Look for GraphQL requests to your Hygraph endpoint
4. Click on the GraphQL request
5. Check the **Response** tab

**What to look for:**
- Response should contain `medicalServices` array
- No GraphQL errors in the response

## 🔍 **Step 5: Test Different Queries**

If the main query doesn't work, try these in API Playground:

### **Test 1: Simple Query**
```graphql
query SimpleMedicalServices {
  medicalServices {
    id
    name
  }
}
```

### **Test 2: Include Draft Content**
```graphql
query AllMedicalServices {
  medicalServices(stage: DRAFT) {
    id
    name
    featured
  }
}
```

### **Test 3: Check Schema**
```graphql
query CheckSchema {
  __schema {
    types {
      name
      kind
    }
  }
}
```
Look for `MedicalService` in the results.

## 🔧 **Common Issues & Solutions**

### **Issue 1: Services Not Published**
**Solution:** Publish all MedicalService entries in Hygraph

### **Issue 2: Wrong Model Name**
**Solution:** Check if your model is called `MedicalService` or something else

### **Issue 3: API Permissions**
**Solution:** Check that your API token has `Read` permissions for MedicalService

### **Issue 4: Field Name Mismatch**
**Solution:** Verify field names match between your schema and queries

### **Issue 5: Cache Issues**
**Solution:** Clear browser cache or add `fetchPolicy: 'network-only'` to queries

## 🚀 **Quick Fixes to Try**

### **Fix 1: Force Network Fetch**
Update the query to bypass cache:

```javascript
const { loading, error, data, refetch } = useQuery(GET_HOMEPAGE_DATA, {
  errorPolicy: 'all',
  fetchPolicy: 'network-only', // Force fresh data
  notifyOnNetworkStatusChange: true
})
```

### **Fix 2: Remove Stage Filter**
Try removing `stage: PUBLISHED` from queries temporarily:

```graphql
query GetHomepageData {
  medicalServices {
    # ... fields
  }
}
```

### **Fix 3: Check API Endpoint**
Verify your `.env` file has the correct Hygraph endpoint:
```
VITE_HYGRAPH_ENDPOINT=https://us-west-2.cdn.hygraph.com/content/YOUR_PROJECT_ID/master
```

## 📋 **Debugging Checklist**

- [ ] Services exist in Hygraph CMS
- [ ] Services are published (not draft)
- [ ] API token has correct permissions
- [ ] GraphQL query returns data in API Playground
- [ ] Browser console shows debug logs
- [ ] Network tab shows successful GraphQL requests
- [ ] No JavaScript errors in console

## 🆘 **If Still Not Working**

1. **Share the console logs** from the debug output
2. **Share the API Playground response** for the test query
3. **Check if the model name is exactly `MedicalService`** in Hygraph
4. **Verify the API endpoint URL** in your .env file

The debug logs I added will help identify exactly where the issue is occurring!