/**
 * Simple Hygraph Schema Checker
 * Run with: node check-schema.js
 */

import fetch from 'node-fetch';

// Hygraph configuration from your .env file
const HYGRAPH_ENDPOINT = 'https://us-west-2.cdn.hygraph.com/content/cmgr5l0iu00pf07wf9zpyrn3d/master';
const HYGRAPH_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NjEwNDM2MjQsImF1ZCI6WyJodHRwczovL2FwaS11cy13ZXN0LTIuaHlncmFwaC5jb20vdjIvY21ncjVsMGl1MDBwZjA3d2Y5enB5cm4zZC9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC51cy13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiZmZiNzFhZTUtN2UwOS00ZWZmLWFjNGEtZmFiNTU1MjViNTY0IiwianRpIjoiY21oMGZ3bDFuMDBoNzA3bG40enhoMXJyZCJ9.OW56pui0yR3jmghhIM2T4mu2z5B6a6d4NggXfu6mOv79jPzDxHxK7BIGF84hjS6mZZs0boOBu40gd_wtlLp6Mrvmjap_appLPCRhhRHW_5CORLL4x79erehs5pLb676UtGbudc-FNaiFjq3xEDjuI6IoCmQ-GqVrfGhPVUs36efBM5pVR6QxhCWfsNcURgjATSgmMlWAs1uRF3GNX4KBTffiDx0oyyfkUP2FX2K6onSizY2YqRm3W_855u6BmjH-ZSMr3rTfEOZKQ4rJ7XzQ8BKkNCY7rBtQK8cYoICkAhP6GZBQ1NUP1JetmpJX_uebtRfXJ7M110R4gwylz_KQ7adAkCE9B8aEy4Xv78WtE9cAK0nggIqB3Z0xxiIbU6x1eo84CLp0LnmGTgGe2BWrYWjT1pXnd1XD16czaexIdsTu-DtXT4WWody2XDBZvN6LC4GFNybV2j4P1J_wABjPLZC98MChm3OT3lalxXNd6be8aajbBMv5YbvMWvHHiXX3KcU25fXr8plXEhT2pZQjMEdLCufWI3vvSeHhdawFYfYIB0X3zOCWqGWnH12wKdaXySV3wupD6038iOvkrIDn1zegW53G7AmJBAosbbq2AUF6e3Axj1pdlitqyL59LM0_Kt6XPw1fhxXE-AzJCMV2bMNunXnjC2Famb-lxzbclZY';

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

// GraphQL queries
const TEST_CONNECTION = `
  query TestConnection {
    __typename
  }
`;

const TEST_APPOINTMENTS_QUERY = `
  query TestAppointments {
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
`;

const TEST_CREATE_APPOINTMENT = `
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
`;

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

        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors.map(e => e.message).join(', '));
        }

        return result;
    } catch (error) {
        throw new Error(`GraphQL request failed: ${error.message}`);
    }
}

async function checkConnection() {
    log.info('Testing Hygraph connection...');

    try {
        const result = await makeGraphQLRequest(TEST_CONNECTION);

        if (result.data && result.data.__typename) {
            log.success('Hygraph connection successful');
            return true;
        } else {
            log.error('Unexpected response from Hygraph');
            return false;
        }
    } catch (error) {
        log.error(`Connection failed: ${error.message}`);
        log.error('Please check your HYGRAPH_ENDPOINT and HYGRAPH_TOKEN');
        return false;
    }
}

async function checkAppointmentSchema() {
    log.info('Checking if Appointment schema exists...');

    try {
        const result = await makeGraphQLRequest(TEST_APPOINTMENTS_QUERY);

        if (result.data && result.data.appointments !== undefined) {
            log.success('Appointment schema exists in Hygraph');
            log.info(`Found ${result.data.appointments.length} existing appointments`);
            return true;
        } else {
            log.error('Unexpected response structure');
            return false;
        }
    } catch (error) {
        if (error.message.includes('Cannot query field "appointments"')) {
            log.error('Appointment schema does NOT exist in Hygraph');
            return false;
        } else {
            log.warning(`Schema check inconclusive: ${error.message}`);
            return false;
        }
    }
}

async function testAppointmentCreation() {
    log.info('Testing appointment creation...');

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
    };

    try {
        const result = await makeGraphQLRequest(TEST_CREATE_APPOINTMENT, testData);

        if (result.data && result.data.createAppointment) {
            log.success('Appointment creation works!');
            log.info(`Test appointment created with ID: ${result.data.createAppointment.id}`);

            // Try to clean up test appointment
            try {
                await makeGraphQLRequest(`
          mutation DeleteTestAppointment($id: ID!) {
            deleteAppointment(where: { id: $id }) {
              id
            }
          }
        `, { id: result.data.createAppointment.id });
                log.info('Test appointment cleaned up');
            } catch (cleanupError) {
                log.warning('Could not clean up test appointment (this is okay)');
            }

            return true;
        } else {
            log.error('Unexpected response structure');
            return false;
        }
    } catch (error) {
        log.error(`Appointment creation failed: ${error.message}`);
        return false;
    }
}

async function main() {
    log.title('🏥 HYGRAPH APPOINTMENT SCHEMA CHECKER');

    // Configuration is already set from your .env file
    log.info('Using Hygraph configuration from your project');

    // Run checks
    const connectionOk = await checkConnection();
    if (!connectionOk) {
        log.error('Cannot proceed without Hygraph connection');
        process.exit(1);
    }

    const schemaExists = await checkAppointmentSchema();

    if (schemaExists) {
        const mutationOk = await testAppointmentCreation();

        log.title('📊 SUMMARY');

        if (mutationOk) {
            log.success('✅ Your Appointment schema is fully configured and working!');
            log.success('✅ Your appointment booking system should work perfectly');
            log.info('🎯 Next steps:');
            log.info('   • Test appointment booking on your website');
            log.info('   • Check admin dashboard for appointments');
            log.info('   • Set up email notifications if needed');
        } else {
            log.warning('⚠️ Schema exists but appointment creation has issues');
            log.info('🔧 Check the error messages above for details');
        }
    } else {
        log.title('📊 SUMMARY');
        log.error('❌ Appointment schema does not exist in Hygraph');
        log.info('🏗️ You need to create the Appointment schema:');
        log.info('   1. Go to https://app.hygraph.com');
        log.info('   2. Select your dohani-medicare project');
        log.info('   3. Navigate to Schema → Add Model');
        log.info('   4. Follow the guide in HYGRAPH_APPOINTMENT_SCHEMA_SETUP.md');
        log.info('   5. Run this script again to verify');
    }

    log.title('🔗 HELPFUL RESOURCES');
    log.info('📖 Schema setup guide: HYGRAPH_APPOINTMENT_SCHEMA_SETUP.md');
    log.info('📊 Current status: APPOINTMENT_BOOKING_STATUS.md');
    log.info('🌐 Your website: https://dohani-medicare-560e6.web.app');
    log.info('⚙️ Hygraph console: https://app.hygraph.com');
}

// Run the checker
main().catch(error => {
    log.error(`Script failed: ${error.message}`);
    process.exit(1);
});