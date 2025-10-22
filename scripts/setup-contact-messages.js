#!/usr/bin/env node

/**
 * Setup Contact Messages Model in Hygraph CMS
 * 
 * This script creates the ContactMessage model in your Hygraph CMS
 * to store contact form submissions.
 */

import fetch from 'node-fetch';
import { readFileSync } from 'fs';

// Read environment variables from .env file
function loadEnvVariables() {
    try {
        const envContent = readFileSync('.env', 'utf8');
        const envVars = {};

        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                envVars[key.trim()] = valueParts.join('=').trim();
            }
        });

        return envVars;
    } catch (error) {
        console.error('❌ Could not read .env file:', error.message);
        process.exit(1);
    }
}

const envVars = loadEnvVariables();

// Hygraph configuration
const HYGRAPH_ENDPOINT = envVars.VITE_HYGRAPH_ENDPOINT?.replace('us-west-2.cdn.hygraph.com/content', 'api-us-west-2.hygraph.com/v2') || 'https://api-us-west-2.hygraph.com/v2/cmgr5l0iu00pf07wf9zpyrn3d/master';
const HYGRAPH_TOKEN = envVars.VITE_HYGRAPH_TOKEN;

if (!HYGRAPH_TOKEN) {
    console.error('❌ VITE_HYGRAPH_TOKEN not found in .env file');
    process.exit(1);
}

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
    title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
};

// GraphQL mutation to create a sample contact message (to test the model)
const CREATE_CONTACT_MESSAGE = `
  mutation CreateContactMessage(
    $name: String!
    $email: String!
    $message: String!
    $status: String!
  ) {
    createContactMessage(
      data: {
        name: $name
        email: $email
        message: $message
        status: $status
      }
    ) {
      id
      name
      email
      message
      status
      createdAt
    }
  }
`;

// GraphQL query to check existing contact messages
const GET_CONTACT_MESSAGES = `
  query GetContactMessages {
    contactMessages(first: 5) {
      id
      name
      email
      status
      createdAt
    }
  }
`;

// Make GraphQL request to Hygraph
async function makeGraphQLRequest(query, variables = {}) {
    try {
        const response = await fetch(HYGRAPH_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HYGRAPH_TOKEN}`
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        const data = await response.json();

        if (data.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
        }

        return data.data;
    } catch (error) {
        throw new Error(`GraphQL request failed: ${error.message}`);
    }
}

// Test the ContactMessage model
async function testContactMessageModel() {
    try {
        log.info('Testing ContactMessage model...');
        
        // Try to query existing messages first
        const existingMessages = await makeGraphQLRequest(GET_CONTACT_MESSAGES);
        log.info(`Found ${existingMessages.contactMessages.length} existing contact messages`);

        // Create a test message
        const testMessage = {
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test message to verify the ContactMessage model is working correctly.',
            status: 'NEW'
        };

        const result = await makeGraphQLRequest(CREATE_CONTACT_MESSAGE, testMessage);
        log.success(`Test contact message created with ID: ${result.createContactMessage.id}`);
        
        return result.createContactMessage;
    } catch (error) {
        throw new Error(`ContactMessage model test failed: ${error.message}`);
    }
}

// Main function
async function main() {
    log.title('🔧 SETTING UP CONTACT MESSAGES IN HYGRAPH CMS');

    try {
        log.info('Checking Hygraph connection...');
        
        // Test the ContactMessage model
        const testResult = await testContactMessageModel();
        
        log.success('ContactMessage model is working correctly!');
        
        console.log(`\n${colors.cyan}📋 SETUP INSTRUCTIONS:${colors.reset}`);
        console.log('1. ✅ ContactMessage model is ready to use');
        console.log('2. 📧 Configure email service (SendGrid, Mailgun, etc.)');
        console.log('3. 🔑 Set EMAIL_SERVICE_API_KEY in your environment');
        console.log('4. 👥 Set STAFF_EMAILS in your environment (comma-separated)');
        console.log('5. 🚀 Deploy your Netlify functions');
        
        console.log(`\n${colors.cyan}🌐 ENVIRONMENT VARIABLES NEEDED:${colors.reset}`);
        console.log('EMAIL_SERVICE_API_KEY=your_sendgrid_api_key');
        console.log('STAFF_EMAILS=staff1@hospital.com,staff2@hospital.com');
        
        console.log(`\n${colors.cyan}📝 TEST MESSAGE CREATED:${colors.reset}`);
        console.log(`ID: ${testResult.id}`);
        console.log(`Name: ${testResult.name}`);
        console.log(`Email: ${testResult.email}`);
        console.log(`Status: ${testResult.status}`);
        console.log(`Created: ${new Date(testResult.createdAt).toLocaleString()}`);

    } catch (error) {
        if (error.message.includes('Cannot query field "contactMessages"')) {
            log.error('ContactMessage model not found in your Hygraph schema!');
            console.log(`\n${colors.yellow}📋 MANUAL SETUP REQUIRED:${colors.reset}`);
            console.log('1. Go to your Hygraph project dashboard');
            console.log('2. Navigate to Schema → Models');
            console.log('3. Create a new model called "ContactMessage"');
            console.log('4. Add these fields:');
            console.log('   - name (String, required)');
            console.log('   - email (String, required)');
            console.log('   - message (String, required, multiline)');
            console.log('   - status (String, required, default: "NEW")');
            console.log('5. Save and publish the schema');
            console.log('6. Run this script again to test');
        } else {
            log.error(`Setup failed: ${error.message}`);
        }
        process.exit(1);
    }
}

// Run the script
main().catch(error => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
});