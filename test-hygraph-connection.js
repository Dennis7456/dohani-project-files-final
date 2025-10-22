// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const HYGRAPH_ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT || 'https://us-west-2.cdn.hygraph.com/content/cmgr5l0iu00pf07wf9zpyrn3d/master';
const HYGRAPH_TOKEN = process.env.VITE_HYGRAPH_TOKEN;

if (!HYGRAPH_TOKEN) {
  console.error('❌ VITE_HYGRAPH_TOKEN environment variable is required');
  process.exit(1);
}

async function testConnection() {
  console.log('🔍 Testing Hygraph connection...');
  
  try {
    const response = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`
      },
      body: JSON.stringify({
        query: `
          query TestConnection {
            __schema {
              types {
                name
              }
            }
          }
        `
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ Connection failed:', result.errors);
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log(`📊 Found ${result.data.__schema.types.length} schema types`);
    return true;
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

// Run the test
testConnection().then(success => {
  process.exit(success ? 0 : 1);
});