#!/usr/bin/env node

/**
 * Add Sample Kenyan Doctors to Hygraph CMS
 * 
 * This script adds realistic sample doctors to your Hygraph CMS
 * that can be edited later with real doctor information.
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Hygraph configuration from your .env file
const HYGRAPH_ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT || 'https://us-west-2.cdn.hygraph.com/content/cmgr5l0iu00pf07wf9zpyrn3d/master';
const HYGRAPH_TOKEN = process.env.VITE_HYGRAPH_TOKEN;

if (!HYGRAPH_TOKEN) {
  console.error('❌ VITE_HYGRAPH_TOKEN environment variable is required');
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

// Sample Kenyan doctors data
const sampleDoctors = [
  {
    name: 'Dr. Grace Wanjiku',
    specialty: 'General Medicine',
    qualifications: ['MBChB (University of Nairobi)', 'Diploma in Family Medicine'],
    bio: 'Dr. Grace Wanjiku is a dedicated general practitioner with over 8 years of experience in primary healthcare. She specializes in preventive medicine, chronic disease management, and family health. Dr. Wanjiku is fluent in English, Swahili, and Kikuyu.',
    consultationHours: 'Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 8:00 AM - 1:00 PM',
    available: true
  },
  {
    name: 'Dr. James Ochieng',
    specialty: 'Cardiology',
    qualifications: ['MBChB (Moi University)', 'MMed Cardiology (University of Nairobi)', 'Fellowship in Interventional Cardiology'],
    bio: 'Dr. James Ochieng is a consultant cardiologist with expertise in heart disease prevention, diagnosis, and treatment. He has extensive experience in managing hypertension, heart failure, and coronary artery disease. Dr. Ochieng is committed to providing comprehensive cardiac care to the Mombasa community.',
    consultationHours: 'Tuesday, Thursday, Saturday: 9:00 AM - 4:00 PM',
    available: true
  },
  {
    name: 'Dr. Fatuma Hassan',
    specialty: 'Pediatrics',
    qualifications: ['MBChB (Aga Khan University)', 'MMed Pediatrics (University of Nairobi)', 'Certificate in Child Health'],
    bio: 'Dr. Fatuma Hassan is a pediatrician passionate about child health and development. She provides comprehensive care for infants, children, and adolescents, including vaccinations, growth monitoring, and treatment of childhood illnesses. Dr. Hassan speaks English, Swahili, and Arabic.',
    consultationHours: 'Monday-Friday: 8:00 AM - 4:00 PM, Saturday: 9:00 AM - 2:00 PM',
    available: true
  },
  {
    name: 'Dr. Michael Kiprop',
    specialty: 'Emergency Medicine',
    qualifications: ['MBChB (Moi University)', 'Diploma in Emergency Medicine', 'ACLS Certification'],
    bio: 'Dr. Michael Kiprop leads our emergency department with over 6 years of experience in emergency and trauma care. He is skilled in critical care management, emergency procedures, and trauma stabilization. Dr. Kiprop ensures our 24/7 emergency services maintain the highest standards.',
    consultationHours: '24/7 Emergency Coverage (Rotating Shifts)',
    available: true
  },
  {
    name: 'Dr. Amina Mohamed',
    specialty: 'Obstetrics & Gynecology',
    qualifications: ['MBChB (University of Nairobi)', 'MMed Obstetrics & Gynecology', 'Certificate in Reproductive Health'],
    bio: 'Dr. Amina Mohamed is an experienced obstetrician and gynecologist providing comprehensive women\'s health services. She specializes in prenatal care, delivery, family planning, and gynecological procedures. Dr. Mohamed is dedicated to supporting women through all stages of their reproductive health journey.',
    consultationHours: 'Monday, Wednesday, Friday: 9:00 AM - 5:00 PM, Tuesday, Thursday: 2:00 PM - 7:00 PM',
    available: true
  },
  {
    name: 'Dr. Samuel Mutua',
    specialty: 'Orthopedics',
    qualifications: ['MBChB (Kenyatta University)', 'MMed Orthopedic Surgery', 'Fellowship in Trauma Surgery'],
    bio: 'Dr. Samuel Mutua is an orthopedic surgeon specializing in bone, joint, and muscle disorders. He has extensive experience in fracture management, joint replacement, and sports medicine. Dr. Mutua combines surgical expertise with conservative treatment approaches for optimal patient outcomes.',
    consultationHours: 'Monday, Wednesday, Friday: 10:00 AM - 4:00 PM',
    available: true
  }
];

// GraphQL mutation to create doctors
const CREATE_DOCTOR = `
  mutation CreateDoctor(
    $name: String!
    $specialty: String!
    $qualifications: [String!]
    $bio: RichTextAST
    $consultationHours: String
    $available: Boolean!
  ) {
    createDoctor(
      data: {
        name: $name
        specialty: $specialty
        qualifications: $qualifications
        bio: $bio
        consultationHours: $consultationHours
        available: $available
      }
    ) {
      id
      name
      specialty
      available
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

async function checkExistingDoctors() {
  log.info('Checking for existing doctors in CMS...');
  
  try {
    const result = await makeGraphQLRequest(`
      query CheckDoctors {
        doctors {
          id
          name
          specialty
          available
        }
      }
    `);
    
    const existingDoctors = result.data.doctors || [];
    log.info(`Found ${existingDoctors.length} existing doctors in CMS`);
    
    if (existingDoctors.length > 0) {
      log.warning('Existing doctors found:');
      existingDoctors.forEach(doctor => {
        log.info(`  - ${doctor.name} (${doctor.specialty})`);
      });
      
      const proceed = process.argv.includes('--force');
      if (!proceed) {
        log.warning('Use --force flag to add sample doctors anyway');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    log.error(`Failed to check existing doctors: ${error.message}`);
    return false;
  }
}

async function addSampleDoctor(doctorData) {
  try {
    // Convert bio to RichText format
    const bioRichText = {
      children: [
        {
          type: 'paragraph',
          children: [
            { text: doctorData.bio }
          ]
        }
      ]
    };

    const variables = {
      name: doctorData.name,
      specialty: doctorData.specialty,
      qualifications: doctorData.qualifications,
      bio: bioRichText,
      consultationHours: doctorData.consultationHours,
      available: doctorData.available
    };

    const result = await makeGraphQLRequest(CREATE_DOCTOR, variables);
    
    if (result.data && result.data.createDoctor) {
      log.success(`Added: ${result.data.createDoctor.name} (${result.data.createDoctor.specialty})`);
      return result.data.createDoctor;
    } else {
      throw new Error('Unexpected response structure');
    }
  } catch (error) {
    log.error(`Failed to add ${doctorData.name}: ${error.message}`);
    return null;
  }
}

async function main() {
  log.title('👨‍⚕️ ADDING SAMPLE KENYAN DOCTORS TO HYGRAPH CMS');
  
  // Check for existing doctors
  const canProceed = await checkExistingDoctors();
  if (!canProceed) {
    log.info('Exiting without adding doctors');
    return;
  }
  
  log.info(`Adding ${sampleDoctors.length} sample doctors to your CMS...`);
  
  const results = [];
  
  for (const doctorData of sampleDoctors) {
    log.info(`Adding ${doctorData.name}...`);
    const result = await addSampleDoctor(doctorData);
    if (result) {
      results.push(result);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  log.title('📊 SUMMARY');
  
  if (results.length > 0) {
    log.success(`Successfully added ${results.length} doctors to your CMS!`);
    log.info('Added doctors:');
    results.forEach(doctor => {
      log.info(`  ✅ ${doctor.name} - ${doctor.specialty}`);
    });
    
    log.title('🎯 NEXT STEPS');
    log.info('1. Go to your website and refresh the page');
    log.info('2. Check the "Our Medical Team" section');
    log.info('3. You should see real doctors instead of placeholders');
    log.info('4. Go to Hygraph CMS to edit doctor information');
    log.info('5. Add professional photos for each doctor');
    
    log.title('🔗 USEFUL LINKS');
    log.info('🌐 Your website: https://dohani-medicare-560e6.web.app');
    log.info('⚙️ Hygraph CMS: https://app.hygraph.com');
    log.info('👨‍⚕️ Edit doctors: Content → Doctors');
  } else {
    log.error('No doctors were added successfully');
    log.info('Check your Hygraph token permissions and try again');
  }
}

// Run the script
main().catch(error => {
  log.error(`Script failed: ${error.message}`);
  process.exit(1);
});