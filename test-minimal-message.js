#!/usr/bin/env node

// Test minimal Message schema
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const HYGRAPH_ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT
const HYGRAPH_TOKEN = process.env.VITE_HYGRAPH_TOKEN

// Test minimal fields
const testQuery = `
  query TestMinimalMessage {
    messages {
      id
      name
      email
    }
  }
`

async function testMinimalMessage() {
  try {
    const response = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`
      },
      body: JSON.stringify({ query: testQuery })
    })

    const result = await response.json()
    
    if (response.ok && !result.errors) {
      console.log('✅ Minimal message query works!')
      console.log('Messages found:', result.data.messages?.length || 0)
      return true
    } else {
      console.log('❌ Even minimal query failed:')
      console.log(result.errors?.[0]?.message || 'Unknown error')
      return false
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
    return false
  }
}

testMinimalMessage()