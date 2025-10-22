#!/usr/bin/env node

// Test updated queries with correct field names
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const HYGRAPH_ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT
const HYGRAPH_TOKEN = process.env.VITE_HYGRAPH_TOKEN

// Test updated queries
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
  messages: `
    query TestMessages {
      messages {
        id
        name
        email
        message {
          text
        }
        messageStatus
        messageSource
        createdAt
        updatedAt
      }
    }
  `
}

async function testQuery(name, query) {
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
      console.log(`✅ ${name}: Query successful!`)
      return true
    } else {
      console.log(`❌ ${name}: ${result.errors?.[0]?.message || 'Query failed'}`)
      return false
    }
  } catch (error) {
    console.log(`❌ ${name}: Network error - ${error.message}`)
    return false
  }
}

async function testUpdatedQueries() {
  console.log('🧪 Testing Updated Queries...')
  console.log('============================')
  
  for (const [name, query] of Object.entries(testQueries)) {
    await testQuery(name, query)
  }
}

testUpdatedQueries()