#!/usr/bin/env node

/**
 * Add Sample Kenyan Health News Articles to Hygraph CMS
 * 
 * This script adds realistic health and medical news articles
 * relevant to Kenya that can be edited later.
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

// Hygraph configuration from .env file
// Note: For mutations, we need the API endpoint, not the CDN endpoint
const HYGRAPH_ENDPOINT = envVars.VITE_HYGRAPH_ENDPOINT?.replace('us-west-2.cdn.hygraph.com/content', 'api-us-west-2.hygraph.com/v2') || 'https://api-us-west-2.hygraph.com/v2/cmgr5l0iu00pf07wf9zpyrn3d/master';
const HYGRAPH_TOKEN = envVars.VITE_HYGRAPH_TOKEN;

if (!HYGRAPH_TOKEN) {
    console.error('❌ VITE_HYGRAPH_TOKEN not found in .env file');
    console.error('Please check your .env file and ensure the token is set');
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

// Sample Kenyan health news articles
const sampleNewsArticles = [
    {
        title: 'New Malaria Prevention Campaign Launched in Coastal Kenya',
        excerpt: 'The Ministry of Health launches a comprehensive malaria prevention campaign targeting coastal regions, including Mombasa County, with focus on bed net distribution and community education.',
        content: `The Ministry of Health, in partnership with international health organizations, has launched an ambitious malaria prevention campaign across Kenya's coastal regions. The initiative, which specifically targets Mombasa, Kilifi, and Kwale counties, aims to reduce malaria incidence by 40% over the next two years.

Key components of the campaign include:

**Community Education Programs**
Health workers will conduct door-to-door visits to educate families about malaria prevention, symptoms recognition, and the importance of seeking early treatment. Special emphasis will be placed on protecting pregnant women and children under five years old.

**Bed Net Distribution**
Over 500,000 long-lasting insecticidal nets (LLINs) will be distributed free of charge to households in high-risk areas. The nets have been treated with advanced insecticides that remain effective for up to three years.

**Healthcare Facility Strengthening**
Local health facilities, including Dohani Medicare Hospital, are being equipped with rapid diagnostic tests and artemisinin-based combination therapies (ACTs) to ensure quick and accurate malaria diagnosis and treatment.

**Environmental Management**
Community-based programs will focus on eliminating mosquito breeding sites through proper waste management and water storage practices.

Dr. Sarah Mwangi, County Director of Health for Mombasa, emphasized the importance of community participation: "This campaign's success depends on every household taking responsibility for malaria prevention. Simple actions like using bed nets consistently and eliminating stagnant water can save lives."

The campaign is expected to benefit over 2 million residents across the coastal region and serves as a model for similar initiatives in other parts of Kenya.`,
        author: 'Dr. Sarah Mwangi',
        featured: true,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
        title: 'Diabetes Management: A Growing Health Challenge in Urban Kenya',
        excerpt: 'Healthcare experts discuss the rising prevalence of diabetes in Kenyan cities and the importance of lifestyle changes, regular screening, and proper medical care.',
        content: `Diabetes has emerged as one of the fastest-growing health challenges in urban Kenya, with Mombasa recording a 35% increase in diagnosed cases over the past five years. Healthcare professionals are calling for increased awareness and proactive management strategies.

**Rising Prevalence**
According to recent data from the Kenya Ministry of Health, approximately 4.2% of Kenyan adults are living with diabetes, with urban areas showing significantly higher rates than rural regions. Mombasa County alone has over 45,000 registered diabetic patients.

**Risk Factors in Urban Settings**
Dr. James Ochieng, a consultant physician at Dohani Medicare Hospital, identifies several contributing factors:

- **Sedentary Lifestyles**: Office jobs and reduced physical activity
- **Dietary Changes**: Increased consumption of processed foods and sugary drinks
- **Stress**: Urban living pressures affecting blood sugar control
- **Genetic Predisposition**: Family history combined with environmental factors

**Prevention and Management Strategies**

**Regular Screening**
Adults over 35 should undergo diabetes screening annually, while those with risk factors should be tested more frequently. Early detection allows for better management and prevention of complications.

**Lifestyle Modifications**
- **Diet**: Emphasize whole grains, vegetables, lean proteins, and traditional Kenyan foods like sukuma wiki and ugali in moderation
- **Exercise**: At least 150 minutes of moderate activity weekly, including walking, swimming, or traditional dances
- **Weight Management**: Maintaining a healthy BMI reduces diabetes risk significantly

**Medical Care**
Proper medical management includes regular monitoring of blood sugar levels, medication adherence, and routine check-ups for complications affecting eyes, kidneys, and feet.

**Community Support Programs**
Several healthcare facilities in Mombasa, including Dohani Medicare Hospital, now offer diabetes support groups where patients share experiences and learn from healthcare professionals.

"Diabetes is manageable with the right approach," says Dr. Ochieng. "The key is early detection, lifestyle changes, and consistent medical care. We encourage all residents to take advantage of our screening programs."

For more information about diabetes screening and management, contact your local healthcare provider or visit Dohani Medicare Hospital's diabetes clinic.`,
        author: 'Dr. James Ochieng',
        featured: true,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    },
    {
        title: 'Maternal Health: Improving Pregnancy Outcomes in Mombasa',
        excerpt: 'New maternal health initiatives focus on reducing pregnancy complications and improving birth outcomes through enhanced prenatal care and community health programs.',
        content: `Mombasa County has launched comprehensive maternal health initiatives aimed at reducing maternal and infant mortality rates while improving overall pregnancy outcomes. The programs focus on accessible prenatal care and community education.

**Current Maternal Health Statistics**
Kenya has made significant progress in maternal health, with maternal mortality rates declining by 40% over the past decade. However, challenges remain, particularly in ensuring all women receive adequate prenatal care.

**Enhanced Prenatal Care Services**

**Early Pregnancy Detection**
Healthcare facilities across Mombasa are promoting early pregnancy testing and immediate enrollment in prenatal care programs. Early care allows for better monitoring and intervention when needed.

**Comprehensive Health Screenings**
Pregnant women receive thorough health assessments including:
- Blood pressure monitoring for preeclampsia prevention
- Anemia screening and iron supplementation
- HIV and syphilis testing with appropriate treatment
- Malaria prevention in pregnancy programs
- Nutritional counseling and support

**Skilled Birth Attendance**
Dr. Amina Mohamed, an obstetrician at Dohani Medicare Hospital, emphasizes the importance of skilled birth attendance: "Every woman deserves access to qualified healthcare professionals during delivery. Our 24/7 maternity services ensure that emergency care is always available."

**Community Health Programs**

**Traditional Birth Attendant Training**
Community health workers and traditional birth attendants receive training to recognize pregnancy complications and make appropriate referrals to healthcare facilities.

**Family Planning Education**
Comprehensive family planning services help women space pregnancies appropriately and plan for healthy families. Services include contraceptive counseling and provision of various family planning methods.

**Nutrition Programs**
Pregnant and breastfeeding mothers receive nutritional support including:
- Iron and folic acid supplementation
- Nutritional counseling focusing on local foods
- Support for exclusive breastfeeding

**Emergency Obstetric Care**
Healthcare facilities have strengthened their capacity to handle obstetric emergencies, with improved ambulance services and referral systems ensuring that women can access life-saving care when needed.

**Success Stories**
The initiatives have already shown positive results, with a 25% increase in facility-based deliveries and improved satisfaction rates among mothers receiving care.

"Our goal is to ensure that every mother and baby in Mombasa receives the best possible care," says Dr. Mohamed. "These programs represent our commitment to maternal health excellence."

For prenatal care services and family planning consultation, visit Dohani Medicare Hospital or your nearest healthcare facility.`,
        author: 'Dr. Amina Mohamed',
        featured: false,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week ago
    }
];

// GraphQL mutation to create news articles
const CREATE_NEWS_ARTICLE = `
  mutation CreateNewsArticle(
    $title: String!
    $excerpt: String!
    $content: RichTextAST!
    $author: String!
    $featured: Boolean!
  ) {
    createNewsArticle(
      data: {
        title: $title
        excerpt: $excerpt
        content: $content
        author: $author
        featured: $featured
      }
    ) {
      id
      title
      excerpt
      content {
        text
      }
      author
      featured
      createdAt
    }
  }
`;

// GraphQL query to check existing news articles
const GET_EXISTING_NEWS = `
  query GetExistingNews {
    newsArticles {
      id
      title
      author
    }
  }
`;

// Convert plain text to RichText AST format for Hygraph
function convertToRichText(text) {
    const paragraphs = text.split('\n\n').filter(p => p.trim());

    const children = paragraphs.map(paragraph => {
        // Handle bold text (**text**)
        if (paragraph.includes('**')) {
            const parts = paragraph.split('**');
            const textChildren = [];

            for (let i = 0; i < parts.length; i++) {
                if (i % 2 === 0) {
                    // Regular text
                    if (parts[i]) {
                        textChildren.push({ text: parts[i] });
                    }
                } else {
                    // Bold text
                    textChildren.push({ text: parts[i], bold: true });
                }
            }

            return {
                type: 'paragraph',
                children: textChildren.length > 0 ? textChildren : [{ text: '' }]
            };
        } else {
            // Regular paragraph
            return {
                type: 'paragraph',
                children: [{ text: paragraph }]
            };
        }
    });

    return {
        children: children.length > 0 ? children : [{ type: 'paragraph', children: [{ text: '' }] }]
    };
}

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

// Check for existing news articles
async function checkExistingNews() {
    try {
        const data = await makeGraphQLRequest(GET_EXISTING_NEWS);
        return data.newsArticles || [];
    } catch (error) {
        throw new Error(`Failed to check existing news: ${error.message}`);
    }
}

// Add a single news article
async function addNewsArticle(article) {
    const richTextContent = convertToRichText(article.content);

    const variables = {
        title: article.title,
        excerpt: article.excerpt,
        content: richTextContent,
        author: article.author,
        featured: article.featured
    };

    try {
        const data = await makeGraphQLRequest(CREATE_NEWS_ARTICLE, variables);
        return data.createNewsArticle;
    } catch (error) {
        throw new Error(`Failed to add news article: ${error.message}`);
    }
}

// Main function
async function main() {
    const forceAdd = process.argv.includes('--force');

    log.title('📰 ADDING SAMPLE KENYAN HEALTH NEWS ARTICLES TO HYGRAPH CMS');

    try {
        // Check for existing news articles
        log.info('Checking for existing news articles in CMS...');
        const existingNews = await checkExistingNews();

        log.info(`Found ${existingNews.length} existing news articles in CMS`);

        if (existingNews.length > 0 && !forceAdd) {
            log.warning('Existing news articles found:');
            existingNews.forEach(article => {
                log.info(`  - ${article.title} (by ${article.author})`);
            });
            log.warning('Use --force flag to add sample news articles anyway');
            return;
        }

        log.info(`Adding ${sampleNewsArticles.length} sample news articles to your CMS...`);

        let successCount = 0;
        let errorCount = 0;

        for (const article of sampleNewsArticles) {
            try {
                log.info(`Adding "${article.title}"...`);

                const result = await addNewsArticle(article);

                log.success(`Added: ${result.title} (by ${result.author})`);
                successCount++;

                // Add small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                log.error(`Failed to add "${article.title}": ${error.message}`);
                errorCount++;
            }
        }

        // Summary
        console.log(`\n${colors.bright}📊 SUMMARY${colors.reset}`);
        if (successCount > 0) {
            log.success(`Successfully added ${successCount} news articles to your CMS!`);
        }
        if (errorCount > 0) {
            log.error(`Failed to add ${errorCount} news articles`);
        }

        if (successCount > 0) {
            console.log(`\n${colors.cyan}🎯 Next Steps:${colors.reset}`);
            console.log('1. Visit your website to see the new news articles');
            console.log('2. Edit articles in Hygraph CMS to match your content needs');
            console.log('3. Add featured images to make articles more engaging');
            console.log('4. Customize content to reflect your hospital\'s news and updates');
        }

    } catch (error) {
        log.error(`Script failed: ${error.message}`);
        process.exit(1);
    }
}

// Run the script
main().catch(error => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
});