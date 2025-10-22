#!/usr/bin/env node

/**
 * Hygraph Appointment Schema Checker
 * 
 * This script checks if the Appointment schema exists in Hygraph CMS
 * and verifies that all required fields are properly configured.
 */

import { gql } from '@apollo/client'
import { client } from '../src/lib/graphql.js'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
}

// Test queries to check schema
const SCHEMA_INTROSPECTION = gql`
  query SchemaIntrospection {
    __schema {
      types {
        name
        kind
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  }
`

const TEST_APPOINTMENT_QUERY = gql`
  query TestAppointmentQuery {
    appointments(first: 1) {
      id
      firstName
      lastName
      email
      phone
      appointmentType
      preferredDate
      preferredTime
      status
      createdAt
    }
  }
`

const TEST_CREATE_APPOINTMENT = gql`
  mutation TestCreateAppointment(
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
    $appointmentType: String!
    $preferredDate: String!
    $preferredTime: String!
    $reason: String!
    $previousVisit: Boolean!
    $hasInsurance: Boolean!
    $status: String!
  ) {
    createAppointment(
      data: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        phone: $phone
        appointmentType: $appointmentType
        preferredDate: $preferredDate
        preferredTime: $preferredTime
        reason: $reason
        previousVisit: $previousVisit
        hasInsurance: $hasInsurance
        status: $status
      }
    ) {
      id
      firstName
      lastName
      email
      status
      createdAt
    }
  }
`

// Required fields for appointment schema
const REQUIRED_FIELDS = [
  { name: 'firstName', type: 'String', required: true },
  { name: 'lastName', type: 'String', required: true },
  { name: 'email', type: 'String', required: true },
  { name: 'phone', type: 'String', required: true },
  { name: 'appointmentType', type: 'String', required: true },
  { name: 'preferredDate', type: 'String', required: true },
  { name: 'preferredTime', type: 'String', required: true },
  { name: 'reason', type: 'String', required: true },
  { name: 'previousVisit', type: 'Boolean', required: true },
  { name: 'hasInsurance', type: 'Boolean', required: true },
  { name: 'status', type: 'String', required: true }
]

const OPTIONAL_FIELDS = [
  { name: 'dateOfBirth', type: 'String', required: false },
  { name: 'doctor', type: 'String', required: false },
  { name: 'symptoms', type: 'String', required: false },
  { name: 'emergencyContact', type: 'String', required: false },
  { name: 'insuranceProvider', type: 'String', required: false },
  { name: 'policyNumber', type: 'String', required: false }
]

async function checkHygraphConnection() {
  log.title('🔍 HYGRAPH APPOINTMENT SCHEMA CHECKER')
  
  try {
    log.info('Testing Hygraph connection...')
    
    // Test basic connection with a simple query
    const result = await client.query({
      query: gql`
        query TestConnection {
          __typename
        }
      `,
      fetchPolicy: 'network-only'
    })
    
    if (result.data.__typename) {
      log.success('Hygraph connection successful')
      return true
    }
  } catch (error) {
    log.error(`Hygraph connection failed: ${error.message}`)
    log.error('Please check your Hygraph configuration in src/lib/graphql.js')
    return false
  }
}

async function checkAppointmentSchema() {
  log.info('Checking if Appointment schema exists...')
  
  try {
    // Try to query appointments to see if schema exists
    const result = await client.query({
      query: TEST_APPOINTMENT_QUERY,
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    })
    
    if (result.data && result.data.appointments !== undefined) {
      log.success('Appointment schema exists in Hygraph')
      log.info(`Found ${result.data.appointments.length} existing appointments`)
      return true
    }
  } catch (error) {
    if (error.message.includes('Cannot query field "appointments"')) {
      log.error('Appointment schema does NOT exist in Hygraph')
      log.warning('You need to create the Appointment model in your Hygraph CMS')
      return false
    } else {
      log.warning(`Schema check inconclusive: ${error.message}`)
      return false
    }
  }
}

async function testAppointmentMutation() {
  log.info('Testing appointment creation mutation...')
  
  const testData = {
    firstName: 'Schema',
    lastName: 'Test',
    email: 'schema.test@example.com',
    phone: '0700000000',
    appointmentType: 'general',
    preferredDate: '2025-01-20',
    preferredTime: '10:00',
    reason: 'Schema validation test',
    previousVisit: false,
    hasInsurance: false,
    status: 'PENDING'
  }
  
  try {
    const result = await client.mutate({
      mutation: TEST_CREATE_APPOINTMENT,
      variables: testData
    })
    
    if (result.data && result.data.createAppointment) {
      log.success('Appointment creation mutation works!')
      log.info(`Test appointment created with ID: ${result.data.createAppointment.id}`)
      
      // Clean up test appointment
      try {
        await client.mutate({
          mutation: gql`
            mutation DeleteTestAppointment($id: ID!) {
              deleteAppointment(where: { id: $id }) {
                id
              }
            }
          `,
          variables: { id: result.data.createAppointment.id }
        })
        log.info('Test appointment cleaned up')
      } catch (cleanupError) {
        log.warning('Could not clean up test appointment (this is okay)')
      }
      
      return true
    }
  } catch (error) {
    log.error(`Appointment creation failed: ${error.message}`)
    
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      log.error('GraphQL Errors:')
      error.graphQLErrors.forEach((gqlError, index) => {
        log.error(`  ${index + 1}. ${gqlError.message}`)
      })
    }
    
    return false
  }
}

async function checkSchemaFields() {
  log.info('Checking schema field structure...')
  
  try {
    const result = await client.query({
      query: SCHEMA_INTROSPECTION,
      fetchPolicy: 'network-only'
    })
    
    const appointmentType = result.data.__schema.types.find(
      type => type.name === 'Appointment'
    )
    
    if (!appointmentType) {
      log.error('Appointment type not found in schema')
      return false
    }
    
    log.success('Appointment type found in schema')
    
    // Check required fields
    log.info('Checking required fields...')
    const missingRequired = []
    const presentRequired = []
    
    REQUIRED_FIELDS.forEach(requiredField => {
      const field = appointmentType.fields?.find(f => f.name === requiredField.name)
      if (field) {
        presentRequired.push(requiredField.name)
      } else {
        missingRequired.push(requiredField.name)
      }
    })
    
    if (presentRequired.length > 0) {
      log.success(`Required fields present: ${presentRequired.join(', ')}`)
    }
    
    if (missingRequired.length > 0) {
      log.error(`Missing required fields: ${missingRequired.join(', ')}`)
    }
    
    // Check optional fields
    log.info('Checking optional fields...')
    const presentOptional = []
    
    OPTIONAL_FIELDS.forEach(optionalField => {
      const field = appointmentType.fields?.find(f => f.name === optionalField.name)
      if (field) {
        presentOptional.push(optionalField.name)
      }
    })
    
    if (presentOptional.length > 0) {
      log.info(`Optional fields present: ${presentOptional.join(', ')}`)
    }
    
    return missingRequired.length === 0
  } catch (error) {
    log.error(`Schema introspection failed: ${error.message}`)
    return false
  }
}

async function generateSchemaReport() {
  log.title('📊 SCHEMA STATUS REPORT')
  
  const connectionOk = await checkHygraphConnection()
  if (!connectionOk) {
    log.error('Cannot proceed without Hygraph connection')
    return
  }
  
  const schemaExists = await checkAppointmentSchema()
  
  if (schemaExists) {
    const fieldsOk = await checkSchemaFields()
    const mutationOk = await testAppointmentMutation()
    
    log.title('📋 SUMMARY')
    
    if (fieldsOk && mutationOk) {
      log.success('✅ Appointment schema is fully configured and working!')
      log.success('✅ Your appointment booking system should work perfectly')
      log.info('🎯 Next steps:')
      log.info('   • Test appointment booking on your website')
      log.info('   • Check admin dashboard for appointments')
      log.info('   • Set up email notifications if needed')
    } else {
      log.warning('⚠️ Appointment schema exists but has issues')
      log.info('🔧 Issues to fix:')
      if (!fieldsOk) log.info('   • Missing required fields in schema')
      if (!mutationOk) log.info('   • Appointment creation mutation not working')
    }
  } else {
    log.error('❌ Appointment schema does not exist')
    log.info('🏗️ You need to create the Appointment schema in Hygraph:')
    log.info('   1. Go to https://app.hygraph.com')
    log.info('   2. Select your dohani-medicare project')
    log.info('   3. Navigate to Schema → Add Model')
    log.info('   4. Follow the guide in HYGRAPH_APPOINTMENT_SCHEMA_SETUP.md')
    log.info('   5. Run this script again to verify')
  }
  
  log.title('🔗 HELPFUL RESOURCES')
  log.info('📖 Schema setup guide: HYGRAPH_APPOINTMENT_SCHEMA_SETUP.md')
  log.info('📊 Current status: APPOINTMENT_BOOKING_STATUS.md')
  log.info('🌐 Your website: https://dohani-medicare-560e6.web.app')
  log.info('⚙️ Hygraph console: https://app.hygraph.com')
}

// Run the schema checker
generateSchemaReport().catch(error => {
  log.error(`Script failed: ${error.message}`)
  process.exit(1)
})