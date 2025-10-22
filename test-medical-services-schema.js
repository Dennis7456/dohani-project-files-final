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

async function testMedicalServicesSchema() {
  console.log('🔍 Testing medical services schema and data...');
  
  try {
    // First, let's try a basic query to see what fields are available
    const basicResponse = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`
      },
      body: JSON.stringify({
        query: `
          query GetBasicServices {
            medicalServices {
              id
              name
              description {
                text
              }
            }
          }
        `
      })
    });

    const basicResult = await basicResponse.json();
    
    if (basicResult.errors) {
      console.error('❌ Basic query failed:', basicResult.errors);
      return false;
    }
    
    const basicServices = basicResult.data?.medicalServices || [];
    console.log(`✅ Basic query successful! Found ${basicServices.length} services`);
    
    if (basicServices.length > 0) {
      console.log('\n📋 Basic services found:');
      basicServices.forEach((service, index) => {
        console.log(`${index + 1}. ${service.name}`);
        console.log(`   ID: ${service.id}`);
        console.log(`   Description: ${service.description?.text ? 'Yes' : 'No'}`);
        console.log('');
      });
    }

    // Now let's try with all possible fields
    const fullResponse = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`
      },
      body: JSON.stringify({
        query: `
          query GetFullServices {
            medicalServices(orderBy: name_ASC) {
              id
              name
              description
              keywords
              featured
              servicesOffered
              commonProcedures
            }
          }
        `
      })
    });

    const fullResult = await fullResponse.json();
    
    if (fullResult.errors) {
      console.log('\n⚠️ Full query with all fields failed:');
      fullResult.errors.forEach(error => {
        console.log(`   - ${error.message}`);
      });
      
      // Let's try to identify which fields exist by testing them individually
      console.log('\n🔍 Testing individual fields...');
      
      const fieldsToTest = ['title', 'keywords', 'featured', 'servicesOffered', 'commonProcedures'];
      const workingFields = ['id', 'name', 'description { text }']; // We know these work
      
      for (const field of fieldsToTest) {
        try {
          const testResponse = await fetch(HYGRAPH_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${HYGRAPH_TOKEN}`
            },
            body: JSON.stringify({
              query: `
                query TestField {
                  medicalServices(first: 1) {
                    id
                    ${field}
                  }
                }
              `
            })
          });

          const testResult = await testResponse.json();
          
          if (!testResult.errors) {
            console.log(`   ✅ Field '${field}' exists`);
            workingFields.push(field);
          } else {
            console.log(`   ❌ Field '${field}' does not exist`);
          }
        } catch (error) {
          console.log(`   ❌ Field '${field}' test failed: ${error.message}`);
        }
      }
      
      // Now query with only working fields
      console.log('\n🔍 Querying with working fields only...');
      const workingQuery = `
        query GetWorkingServices {
          medicalServices(orderBy: name_ASC) {
            ${workingFields.join('\n            ')}
          }
        }
      `;
      
      const workingResponse = await fetch(HYGRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HYGRAPH_TOKEN}`
        },
        body: JSON.stringify({
          query: workingQuery
        })
      });

      const workingResult = await workingResponse.json();
      
      if (workingResult.errors) {
        console.error('❌ Even working fields query failed:', workingResult.errors);
        return false;
      }
      
      const workingServices = workingResult.data?.medicalServices || [];
      console.log(`✅ Working fields query successful! Found ${workingServices.length} services`);
      
      if (workingServices.length > 0) {
        console.log('\n📋 Services with working fields:');
        workingServices.forEach((service, index) => {
          console.log(`${index + 1}. ${service.name}`);
          console.log(`   ID: ${service.id}`);
          console.log(`   Description: ${service.description || 'No description'}`);
          if (service.featured !== undefined) console.log(`   Featured: ${service.featured}`);
          if (service.keywords) console.log(`   Keywords: ${service.keywords}`);
          if (service.servicesOffered) console.log(`   Services Offered: ${service.servicesOffered}`);
          if (service.commonProcedures) console.log(`   Common Procedures: ${service.commonProcedures}`);
          console.log('');
        });
      }
      
      return true;
    } else {
      const fullServices = fullResult.data?.medicalServices || [];
      console.log(`✅ Full query successful! Found ${fullServices.length} services`);
      
      if (fullServices.length > 0) {
        console.log('\n📋 All services with full details:');
        fullServices.forEach((service, index) => {
          console.log(`${index + 1}. ${service.name}`);
          console.log(`   ID: ${service.id}`);
          console.log(`   Description: ${service.description || 'No description'}`);
          console.log(`   Featured: ${service.featured}`);
          console.log(`   Keywords: ${service.keywords || 'None'}`);
          console.log(`   Services Offered: ${service.servicesOffered || 'None'}`);
          console.log(`   Common Procedures: ${service.commonProcedures || 'None'}`);
          console.log('');
        });
      }
      
      return true;
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

// Run the test
testMedicalServicesSchema().then(success => {
  process.exit(success ? 0 : 1);
});