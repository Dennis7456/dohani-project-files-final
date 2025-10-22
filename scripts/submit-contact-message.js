#!/usr/bin/env node

/**
 * Submit Contact Message to Hygraph CMS
 * 
 * This script provides a simple API endpoint simulation for development
 * that saves contact messages to Hygraph CMS without email notifications.
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

// GraphQL mutation to create contact message
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

// Function to save message to Hygraph CMS
async function saveMessageToCMS(messageData) {
    try {
        const response = await fetch(HYGRAPH_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HYGRAPH_TOKEN}`
            },
            body: JSON.stringify({
                query: CREATE_CONTACT_MESSAGE,
                variables: {
                    name: messageData.name,
                    email: messageData.email,
                    message: messageData.message,
                    status: 'NEW'
                }
            })
        });

        const data = await response.json();

        if (data.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
        }

        return data.data.createContactMessage;
    } catch (error) {
        console.error('Error saving to CMS:', error);
        throw error;
    }
}

// Export function for use in other modules
export async function submitContactMessage(messageData) {
    // Validate required fields
    if (!messageData.name || !messageData.email || !messageData.message) {
        throw new Error('Missing required fields: name, email, message');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(messageData.email)) {
        throw new Error('Invalid email format');
    }

    // Save message to Hygraph CMS
    const cmsRecord = await saveMessageToCMS(messageData);
    
    return {
        success: true,
        message: 'Message received successfully. We will respond within 24 hours.',
        id: cmsRecord.id,
        data: cmsRecord
    };
}

// CLI usage (if run directly)
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.log('Usage: node scripts/submit-contact-message.js "Name" "email@example.com" "Message"');
        process.exit(1);
    }

    const messageData = {
        name: args[0],
        email: args[1],
        message: args[2]
    };

    submitContactMessage(messageData)
        .then(result => {
            console.log('✅ Message submitted successfully!');
            console.log(`ID: ${result.id}`);
            console.log(`Status: ${result.data.status}`);
            console.log(`Created: ${new Date(result.data.createdAt).toLocaleString()}`);
        })
        .catch(error => {
            console.error('❌ Error:', error.message);
            process.exit(1);
        });
}