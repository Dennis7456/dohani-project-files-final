// Test the exact query used by the React app
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

const HYGRAPH_ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT || 'https://us-west-2.cdn.hygraph.com/content/cmgr5l0iu00pf07wf9zpyrn3d/master';
const HYGRAPH_TOKEN = process.env.VITE_HYGRAPH_TOKEN;

if (!HYGRAPH_TOKEN) {
  console.error('❌ VITE_HYGRAPH_TOKEN environment variable is required');
  process.exit(1);
}

async function testAppServicesQuery() {
  console.log('🔍 Testing the exact query used by the React app...');
  
  try {
    // This is the exact query from GET_HOMEPAGE_DATA
    const response = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`
      },
      body: JSON.stringify({
        query: `
          query GetHomepageData {
            medicalServices(stage: PUBLISHED) {
              id
              name
              description {
                text
                html
              }
              keywords
              icon
              featured
              servicesOffered
              commonProcedures {
                text
                html
              }
            }
            contactInfos(first: 1) {
              id
              phone
              emergencyPhone
              email
              location
            }
            workingHours(first: 1) {
              id
              emergency
              consultation
              pharmacy
              laboratory
            }
            newsArticles(
              where: { publishedAt_not: null }
              orderBy: publishedAt_DESC
              first: 3
            ) {
              id
              title
              excerpt
              featuredImage {
                id
                url
                width
                height
              }
              author
              publishedAt
              featured
            }
            doctors(where: { available: true }, first: 3) {
              id
              name
              specialty
              available
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
    console.log(`✅ Homepage query successful! Found ${services.length} services`);
    
    if (services.length > 0) {
      console.log('\n📋 Services from homepage query:');
      services.forEach((service, index) => {
        console.log(`${index + 1}. ${service.name}`);
        console.log(`   ID: ${service.id}`);
        console.log(`   Icon: ${service.icon}`);
        console.log(`   Featured: ${service.featured}`);
        console.log(`   Description: ${service.description?.text ? 'Yes' : 'No'}`);
        console.log(`   Keywords: ${service.keywords?.join(', ') || 'None'}`);
        console.log(`   Services Offered: ${service.servicesOffered?.length || 0} items`);
        console.log('');
      });
    } else {
      console.log('⚠️ No services found in homepage query');
    }

    // Also test the GET_ALL_SERVICES query
    console.log('\n🔍 Testing GET_ALL_SERVICES query...');
    
    const allServicesResponse = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`
      },
      body: JSON.stringify({
        query: `
          query GetAllServices {
            medicalServices(orderBy: name_ASC, stage: PUBLISHED) {
              id
              name
              description {
                text
                html
              }
              keywords
              icon
              featured
              servicesOffered
              commonProcedures {
                text
                html
              }
            }
          }
        `
      })
    });

    const allServicesResult = await allServicesResponse.json();
    
    if (allServicesResult.errors) {
      console.error('❌ All services query failed:', allServicesResult.errors);
    } else {
      const allServices = allServicesResult.data?.medicalServices || [];
      console.log(`✅ All services query successful! Found ${allServices.length} services`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

// Run the test
testAppServicesQuery().then(success => {
  process.exit(success ? 0 : 1);
});