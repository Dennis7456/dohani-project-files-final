#!/usr/bin/env node

// Test all implemented schemas
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const HYGRAPH_ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT
const HYGRAPH_TOKEN = process.env.VITE_HYGRAPH_TOKEN

console.log('🧪 Testing All Implemented Schemas...')

// Test queries for each schema
const testQueries = {
  medicalServices: `
    query TestMedicalServices {
      medicalServices {
        id
        name
        description {
          text
        }
        keywords
        icon
        featured
      }
    }
  `,
  contactInfos: `
    query TestContactInfos {
      contactInfos {
        id
        phone
        emergencyPhone
        email
        location
      }
    }
  `,
  workingHours: `
    query TestWorkingHours {
      workingHours {
        id
        emergency
        consultation
        pharmacy
        laboratory
      }
    }
  `,
  doctors: `
    query TestDoctors {
      doctors {
        id
        name
        specialty
        qualifications
        available
      }
    }
  `,
  newsArticles: `
    query TestNewsArticles {
      newsArticles {
        id
        title
        excerpt
        author
        featured
        publishedAt
      }
    }
  `,
  messages: `
    query TestMessages {
      messages {
        id
        name
        email
        status
        source
        createdAt
      }
    }
  `,
  appointments: `
    query TestAppointments {
      appointments {
        id
        firstName
        lastName
        email
        phone
        appointmentType
        status
        createdAt
      }
    }
  `
}

async function testSchema(schemaName, query) {
  try {
    const response = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`
      },
      body: JSON.stringify({ query })
    })

    const result = await response.json()
    
    if (response.ok && !result.errors) {
      const data = result.data[schemaName]
      console.log(`✅ ${schemaName}: ${data?.length || 0} records found`)
      return { success: true, count: data?.length || 0 }
    } else {
      console.log(`❌ ${schemaName}: ${result.errors?.[0]?.message || 'Query failed'}`)
      return { success: false, error: result.errors?.[0]?.message }
    }
  } catch (error) {
    console.log(`❌ ${schemaName}: Network error - ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function testAllSchemas() {
  console.log('\n📊 Schema Test Results:')
  console.log('========================')
  
  const results = {}
  
  for (const [schemaName, query] of Object.entries(testQueries)) {
    results[schemaName] = await testSchema(schemaName, query)
  }
  
  console.log('\n📈 Summary:')
  console.log('===========')
  
  const successful = Object.values(results).filter(r => r.success).length
  const total = Object.keys(results).length
  
  console.log(`✅ Successful schemas: ${successful}/${total}`)
  
  if (successful === total) {
    console.log('🎉 All schemas are working perfectly!')
  } else {
    console.log('⚠️  Some schemas need attention')
  }
  
  console.log('\n🔧 Recommendations:')
  console.log('===================')
  
  Object.entries(results).forEach(([schema, result]) => {
    if (result.success) {
      if (result.count === 0) {
        console.log(`📝 ${schema}: Schema working but no data - add content in Hygraph`)
      } else {
        console.log(`✅ ${schema}: Ready with ${result.count} records`)
      }
    } else {
      console.log(`🔧 ${schema}: Fix schema structure - ${result.error}`)
    }
  })
  
  return results
}

testAllSchemas()