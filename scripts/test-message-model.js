#!/usr/bin/env node

/**
 * Test Message Model in Hygraph CMS
 * 
 * This script tests the Message model and helps determine the correct enum values.
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
        return data;
    } catch (error) {
        throw new Error(`GraphQL request failed: ${error.message}`);
    }
}

// Test different enum values
async function testEnumValues() {
    const testCases = [
        { messageStatus: 'NEW', messageSource: 'WEBSITE' },
        { messageStatus: 'new', messageSource: 'website' },
        { messageStatus: 'New', messageSource: 'Website' },
        { messageStatus: 'PENDING', messageSource: 'WEB' },
        { messageStatus: 'OPEN', messageSource: 'CONTACT_FORM' }
    ];

    const messageRichText = {
        children: [
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'Test message from enum testing script'
                    }
                ]
            }
        ]
    };

    const CREATE_MESSAGE = `
        mutation CreateMessage(
            $name: String!
            $email: String!
            $message: RichTextAST!
            $messageStatus: MessageStatus!
            $messageSource: MessageSource!
        ) {
            createMessage(
                data: {
                    name: $name
                    email: $email
                    message: $message
                    messageStatus: $messageStatus
                    messageSource: $messageSource
                }
            ) {
                id
                name
                email
                messageStatus
                messageSource
                createdAt
            }
        }
    `;

    for (const testCase of testCases) {
        try {
            log.info(`Testing: messageStatus="${testCase.messageStatus}", messageSource="${testCase.messageSource}"`);
            
            const result = await makeGraphQLRequest(CREATE_MESSAGE, {
                name: 'Test User',
                email: 'test@example.com',
                message: messageRichText,
                messageStatus: testCase.messageStatus,
                messageSource: testCase.messageSource
            });

            if (result.errors) {
                log.error(`Failed: ${result.errors[0]?.message}`);
            } else if (result.data?.createMessage) {
                log.success(`Success! Created message with ID: ${result.data.createMessage.id}`);
                log.success(`✅ Correct values: messageStatus="${testCase.messageStatus}", messageSource="${testCase.messageSource}"`);
                return testCase;
            }
        } catch (error) {
            log.error(`Error: ${error.message}`);
        }
    }

    return null;
}

// Get schema information
async function getSchemaInfo() {
    const SCHEMA_QUERY = `
        query {
            __schema {
                types {
                    name
                    kind
                    enumValues {
                        name
                    }
                }
            }
        }
    `;

    try {
        const result = await makeGraphQLRequest(SCHEMA_QUERY);
        
        if (result.data) {
            const enums = result.data.__schema.types.filter(type => 
                type.kind === 'ENUM' && 
                (type.name === 'MessageStatus' || type.name === 'MessageSource')
            );

            log.info('Found enum types:');
            enums.forEach(enumType => {
                console.log(`\n${colors.cyan}${enumType.name}:${colors.reset}`);
                enumType.enumValues.forEach(value => {
                    console.log(`  - ${value.name}`);
                });
            });

            return enums;
        }
    } catch (error) {
        log.warning('Could not fetch schema info');
    }

    return [];
}

// Main function
async function main() {
    log.title('🧪 TESTING MESSAGE MODEL IN HYGRAPH CMS');

    try {
        log.info('Fetching schema information...');
        const enums = await getSchemaInfo();

        if (enums.length === 0) {
            log.warning('Could not determine enum values from schema. Testing common values...');
        }

        log.info('Testing different enum value combinations...');
        const workingValues = await testEnumValues();

        if (workingValues) {
            console.log(`\n${colors.green}🎯 SUCCESS! Use these values in your code:${colors.reset}`);
            console.log(`messageStatus: "${workingValues.messageStatus}"`);
            console.log(`messageSource: "${workingValues.messageSource}"`);
        } else {
            log.error('None of the test cases worked. Please check your Message model configuration in Hygraph.');
            console.log(`\n${colors.yellow}📋 Please verify in Hygraph:${colors.reset}`);
            console.log('1. Message model exists');
            console.log('2. messageStatus enum values');
            console.log('3. messageSource enum values');
            console.log('4. API permissions are set correctly');
        }

    } catch (error) {
        log.error(`Test failed: ${error.message}`);
        process.exit(1);
    }
}

// Run the script
main().catch(error => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
});