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

async function testDoctorsQuery() {
  console.log('🔍 Testing doctors query...');
  
  try {
    const response = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`
      },
      body: JSON.stringify({
        query: `
          query GetDoctors {
            doctors(where: { available: true }, orderBy: name_ASC) {
              id
              name
              specialty
              qualifications
              bio {
                text
              }
              photo {
                url
                width
                height
              }
              consultationHours
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
    
    const doctors = result.data?.doctors || [];
    console.log(`✅ Query successful! Found ${doctors.length} doctors`);
    
    if (doctors.length > 0) {
      console.log('\n📋 Doctors found:');
      doctors.forEach((doctor, index) => {
        console.log(`${index + 1}. ${doctor.name} - ${doctor.specialty}`);
        console.log(`   Available: ${doctor.available}`);
        console.log(`   Photo: ${doctor.photo ? 'Yes' : 'No'}`);
        console.log(`   Bio: ${doctor.bio?.text ? 'Yes' : 'No'}`);
        console.log('');
      });
    } else {
      console.log('⚠️ No doctors found in CMS');
      
      // Let's also try without the available filter
      console.log('\n🔍 Trying query without available filter...');
      const allDoctorsResponse = await fetch(HYGRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HYGRAPH_TOKEN}`
        },
        body: JSON.stringify({
          query: `
            query GetAllDoctors {
              doctors(orderBy: name_ASC) {
                id
                name
                specialty
                available
              }
            }
          `
        })
      });
      
      const allDoctorsResult = await allDoctorsResponse.json();
      const allDoctors = allDoctorsResult.data?.doctors || [];
      
      console.log(`📊 Total doctors in CMS (including unavailable): ${allDoctors.length}`);
      if (allDoctors.length > 0) {
        allDoctors.forEach((doctor, index) => {
          console.log(`${index + 1}. ${doctor.name} - Available: ${doctor.available}`);
        });
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

// Run the test
testDoctorsQuery().then(success => {
  process.exit(success ? 0 : 1);
});