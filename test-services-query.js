// Load environment variables
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

const HYGRAPH_ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT || 'https://us-west-2.cdn.hygraph.com/content/cmgr5l0iu00pf07wf9zpyrn3d/master';
const HYGRAPH_TOKEN = process.env.VITE_HYGRAPH_TOKEN;

if (!HYGRAPH_TOKEN) {
  console.error('❌ VITE_HYGRAPH_TOKEN environment variable is required');
  process.exit(1);
}

async function testServicesQuery() {
  console.log('🔍 Testing services query...');
  
  try {
    const response = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`
      },
      body: JSON.stringify({
        query: `
          query GetServices {
            medicalServices(orderBy: name_ASC) {
              id
              name
              description {
                text
              }
              keywords
              icon
              featured
              servicesOffered
              commonProcedures {
                text
              }
            }
          }
        `
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ Query failed:', result.errors);
      return false;
    }
    
    const services = result.data?.medicalServices || [];
    console.log(`✅ Query successful! Found ${services.length} services`);
    
    if (services.length > 0) {
      console.log('\n📋 Services found:');
      services.forEach((service, index) => {
        console.log(`${index + 1}. ${service.name}`);
        console.log(`   ID: ${service.id}`);
        console.log(`   Icon: ${service.icon}`);
        console.log(`   Featured: ${service.featured}`);
        console.log(`   Description: ${service.description?.text ? 'Yes' : 'No'}`);
        console.log(`   Keywords: ${service.keywords?.join(', ') || 'None'}`);
        console.log(`   Services Offered: ${service.servicesOffered?.length || 0} items`);
        console.log(`   Common Procedures: ${service.commonProcedures?.text ? 'Yes' : 'No'}`);
        console.log('');
      });
    } else {
      console.log('⚠️ No services found in CMS');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

// Run the test
testServicesQuery().then(success => {
  process.exit(success ? 0 : 1);
});