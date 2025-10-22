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

async function exploreSchema() {
  console.log('🔍 Exploring Hygraph schema...');
  
  // Try different possible model names
  const possibleModels = [
    'medicalServices',
    'services', 
    'medicalService',
    'service',
    'MedicalServices',
    'Services'
  ];
  
  for (const modelName of possibleModels) {
    console.log(`\n🔍 Testing model: ${modelName}`);
    
    try {
      const response = await fetch(HYGRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HYGRAPH_TOKEN}`
        },
        body: JSON.stringify({
          query: `
            query Test${modelName} {
              ${modelName} {
                id
              }
            }
          `
        })
      });

      const result = await response.json();
      
      if (result.errors) {
        console.log(`   ❌ ${modelName}: ${result.errors[0].message}`);
      } else {
        const items = result.data?.[modelName] || [];
        console.log(`   ✅ ${modelName}: Found ${items.length} items`);
        
        if (items.length > 0) {
          // Try to get more details about this model
          console.log(`\n🔍 Getting details for ${modelName}...`);
          
          try {
            const detailResponse = await fetch(HYGRAPH_ENDPOINT, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HYGRAPH_TOKEN}`
              },
              body: JSON.stringify({
                query: `
                  query Detail${modelName} {
                    ${modelName}(first: 3) {
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

            const detailResult = await detailResponse.json();
            
            if (detailResult.errors) {
              console.log(`   ⚠️ Detail query failed: ${detailResult.errors[0].message}`);
            } else {
              const detailItems = detailResult.data?.[modelName] || [];
              console.log(`   📋 Sample items from ${modelName}:`);
              detailItems.forEach((item, index) => {
                console.log(`   ${index + 1}. ${item.name || item.id}`);
                console.log(`      ID: ${item.id}`);
                console.log(`      Icon: ${item.icon || 'N/A'}`);
                console.log(`      Featured: ${item.featured}`);
                console.log(`      Keywords: ${item.keywords?.join(', ') || 'None'}`);
                console.log(`      Services Offered: ${item.servicesOffered?.length || 0} items`);
                console.log('');
              });
            }
          } catch (error) {
            console.log(`   ❌ Detail query error: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.log(`   ❌ ${modelName}: Connection error - ${error.message}`);
    }
  }
  
  // Also try introspection query to see available types
  console.log('\n🔍 Trying schema introspection...');
  
  try {
    const response = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`
      },
      body: JSON.stringify({
        query: `
          query IntrospectionQuery {
            __schema {
              types {
                name
                kind
                fields {
                  name
                  type {
                    name
                  }
                }
              }
            }
          }
        `
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log(`   ❌ Introspection failed: ${result.errors[0].message}`);
    } else {
      const types = result.data?.__schema?.types || [];
      const relevantTypes = types.filter(type => 
        type.name && 
        (type.name.toLowerCase().includes('service') || 
         type.name.toLowerCase().includes('medical')) &&
        type.kind === 'OBJECT' &&
        !type.name.startsWith('__')
      );
      
      console.log(`   📋 Found ${relevantTypes.length} relevant types:`);
      relevantTypes.forEach(type => {
        console.log(`   - ${type.name}`);
        if (type.fields) {
          const fieldNames = type.fields.map(f => f.name).slice(0, 5);
          console.log(`     Fields: ${fieldNames.join(', ')}${type.fields.length > 5 ? '...' : ''}`);
        }
      });
    }
  } catch (error) {
    console.log(`   ❌ Introspection error: ${error.message}`);
  }
}

// Run the exploration
exploreSchema().then(() => {
  console.log('\n✅ Schema exploration complete');
  process.exit(0);
}).catch(error => {
  console.error('❌ Exploration failed:', error.message);
  process.exit(1);
});