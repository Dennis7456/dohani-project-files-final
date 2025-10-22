/**
 * Simple Hygraph Connection Test
 */

import fetch from 'node-fetch';

const HYGRAPH_ENDPOINT = 'https://us-west-2.cdn.hygraph.com/content/cmgr5l0iu00pf07wf9zpyrn3d/master';
const HYGRAPH_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NjEwNDM2MjQsImF1ZCI6WyJodHRwczovL2FwaS11cy13ZXN0LTIuaHlncmFwaC5jb20vdjIvY21ncjVsMGl1MDBwZjA3d2Y5enB5cm4zZC9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC51cy13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiZmZiNzFhZTUtN2UwOS00ZWZmLWFjNGEtZmFiNTU1MjViNTY0IiwianRpIjoiY21oMGZ3bDFuMDBoNzA3bG40enhoMXJyZCJ9.OW56pui0yR3jmghhIM2T4mu2z5B6a6d4NggXfu6mOv79jPzDxHxK7BIGF84hjS6mZZs0boOBu40gd_wtlLp6Mrvmjap_appLPCRhhRHW_5CORLL4x79erehs5pLb676UtGbudc-FNaiFjq3xEDjuI6IoCmQ-GqVrfGhPVUs36efBM5pVR6QxhCWfsNcURgjATSgmMlWAs1uRF3GNX4KBTffiDx0oyyfkUP2FX2K6onSizY2YqRm3W_855u6BmjH-ZSMr3rTfEOZKQ4rJ7XzQ8BKkNCY7rBtQK8cYoICkAhP6GZBQ1NUP1JetmpJX_uebtRfXJ7M110R4gwylz_KQ7adAkCE9B8aEy4Xv78WtE9cAK0nggIqB3Z0xxiIbU6x1eo84CLp0LnmGTgGe2BWrYWjT1pXnd1XD16czaexIdsTu-DtXT4WWody2XDBZvN6LC4GFNybV2j4P1J_wABjPLZC98MChm3OT3lalxXNd6be8aajbBMv5YbvMWvHHiXX3KcU25fXr8plXEhT2pZQjMEdLCufWI3vvSeHhdawFYfYIB0X3zOCWqGWnH12wKdaXySV3wupD6038iOvkrIDn1zegW53G7AmJBAosbbq2AUF6e3Axj1pdlitqyL59LM0_Kt6XPw1fhxXE-AzJCMV2bMNunXnjC2Famb-lxzbclZY';

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
        query: `query TestConnection { __typename }`
      })
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('📊 Response body:', JSON.stringify(result, null, 2));
    
    if (result.data && result.data.__typename) {
      console.log('✅ Connection successful!');
    } else if (result.errors) {
      console.log('❌ GraphQL errors:', result.errors);
    } else {
      console.log('⚠️ Unexpected response structure');
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  }
}

async function testAppointmentQuery() {
  console.log('\n🔍 Testing appointment query...');
  
  try {
    const response = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`
      },
      body: JSON.stringify({
        query: `query TestAppointments { appointments(first: 1) { id } }`
      })
    });

    const result = await response.json();
    console.log('📊 Appointment query result:', JSON.stringify(result, null, 2));
    
    if (result.errors) {
      result.errors.forEach(error => {
        if (error.message.includes('Cannot query field "appointments"')) {
          console.log('❌ Appointment schema does NOT exist');
        } else {
          console.log('❌ Other error:', error.message);
        }
      });
    } else if (result.data && result.data.appointments !== undefined) {
      console.log('✅ Appointment schema exists!');
    }
  } catch (error) {
    console.log('❌ Query failed:', error.message);
  }
}

async function main() {
  console.log('🏥 HYGRAPH CONNECTION TEST\n');
  
  await testConnection();
  await testAppointmentQuery();
  
  console.log('\n🎯 CONCLUSION:');
  console.log('If connection works but appointment query fails with "Cannot query field", you need to create the Appointment schema.');
  console.log('Follow the guide in HYGRAPH_APPOINTMENT_SCHEMA_SETUP.md');
}

main().catch(console.error);