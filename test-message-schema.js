#!/usr/bin/env node

// Test Message schema structure
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const HYGRAPH_ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT
const HYGRAPH_TOKEN = process.env.VITE_HYGRAPH_TOKEN

// Test what fields are available in Message schema
const testQuery = `
  query TestMessageFields {
    messages {
      id
      name
      email
      message {
        text
      }
      source
      createdAt
      updatedAt
    }
  }
`

async function testMessageSchema() {
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
      console.log('✅ Message schema test successful!')
      console.log('Available fields work correctly')
      return true
    } else {
      console.log('❌ Message schema test failed:')
      console.log(result.errors?.[0]?.message || 'Unknown error')
      return false
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
    return false
  }
}

testMessageSchema()