# 📰 Add Sample Kenyan Health News Articles Guide

## 🎯 **Purpose**
This script adds realistic Kenyan health news articles to your Hygraph CMS to populate your news/blog section with relevant medical content.

## 📰 **Sample News Articles Included**

### **1. New Malaria Prevention Campaign Launched in Coastal Kenya**
- **Author**: Dr. Sarah Mwangi
- **Topic**: Malaria prevention, bed net distribution, community health
- **Focus**: Coastal Kenya malaria prevention initiatives
- **Status**: Featured article

### **2. Diabetes Management: A Growing Health Challenge in Urban Kenya**
- **Author**: Dr. James Ochieng
- **Topic**: Diabetes prevention, lifestyle changes, screening
- **Focus**: Urban diabetes challenges and management strategies
- **Status**: Featured article

### **3. Maternal Health: Improving Pregnancy Outcomes in Mombasa**
- **Author**: Dr. Amina Mohamed
- **Topic**: Prenatal care, maternal health, pregnancy outcomes
- **Focus**: Mombasa maternal health initiatives
- **Status**: Regular article

## 🚀 **How to Run the Script**

### **Method 1: Using npm script (Recommended)**
```bash
npm run add-sample-news
```

### **Method 2: Direct node command**
```bash
node scripts/add-sample-news.js
```

### **Method 3: Force add (if articles already exist)**
```bash
npm run add-sample-news:force
```

## 🔍 **What the Script Does**

### **Safety Checks:**
1. ✅ **Checks existing news articles** in your CMS
2. ✅ **Warns if articles already exist** (prevents duplicates)
3. ✅ **Requires --force flag** to add anyway
4. ✅ **Tests Hygraph connection** before proceeding

### **Adding Process:**
1. ✅ **Converts content to RichText** format for Hygraph
2. ✅ **Sets proper publication dates** (recent dates)
3. ✅ **Marks featured articles** appropriately
4. ✅ **Includes author information** from your doctors
5. ✅ **Adds small delays** to avoid rate limiting

## 📊 **Expected Output**

### **Successful Run:**
```
📰 ADDING SAMPLE KENYAN HEALTH NEWS ARTICLES TO HYGRAPH CMS

ℹ Checking for existing news articles in CMS...
ℹ Found 0 existing news articles in CMS
ℹ Adding 3 sample news articles to your CMS...
ℹ Adding "New Malaria Prevention Campaign Launched in Coastal Kenya"...
✅ Added: New Malaria Prevention Campaign Launched in Coastal Kenya (by Dr. Sarah Mwangi)
ℹ Adding "Diabetes Management: A Growing Health Challenge in Urban Kenya"...
✅ Added: Diabetes Management: A Growing Health Challenge in Urban Kenya (by Dr. James Ochieng)
...

📊 SUMMARY
✅ Successfully added 3 news articles to your CMS!
```

### **If Articles Already Exist:**
```
⚠️ Existing news articles found:
ℹ   - New Malaria Prevention Campaign Launched in Coastal Kenya (by Dr. Sarah Mwangi)
⚠️ Use --force flag to add sample news articles anyway
```

## 🎯 **After Running the Script**

### **1. Check Your Website**
1. **Go to**: https://dohani-medicare-560e6.web.app
2. **Navigate to**: News/Blog section
3. **Verify**: Real health articles instead of placeholders

### **2. Expected Changes:**
- ✅ **Professional health articles** with Kenyan context
- ✅ **Relevant medical topics** (malaria, diabetes, maternal health)
- ✅ **Author attribution** to your doctors
- ✅ **Featured articles** prominently displayed
- ✅ **Rich content** with proper formatting

### **3. Debug Info (Development Mode):**
```
Debug Info: Found 3 news articles in CMS
```

## ✏️ **Customizing the Articles**

### **Edit in Hygraph CMS:**
1. **Go to**: https://app.hygraph.com
2. **Navigate to**: Content → News Articles
3. **Edit each article** to match your needs:
   - **Update titles** to reflect current events
   - **Change content** to match your hospital's news
   - **Upload featured images** for visual appeal
   - **Adjust publication dates**
   - **Modify author information**

### **Add Featured Images:**
1. **Click on each article** in Hygraph
2. **Upload image** in the \"featuredImage\" field
3. **Use relevant health images** (recommended: 800x400px)
4. **Save and publish** changes

## 🔧 **Article Content Features**

### **Professional Medical Content:**
- ✅ **Evidence-based information** about health topics
- ✅ **Local context** relevant to Kenya and Mombasa
- ✅ **Practical health advice** for community members
- ✅ **Professional medical terminology** appropriately used

### **Kenyan Health Focus:**
- ✅ **Malaria prevention** in coastal regions
- ✅ **Urban diabetes challenges** in Kenyan cities
- ✅ **Maternal health initiatives** in Mombasa
- ✅ **Community health programs** and education

### **SEO-Friendly Structure:**
- ✅ **Compelling headlines** for engagement
- ✅ **Informative excerpts** for previews
- ✅ **Well-structured content** with headings
- ✅ **Author attribution** for credibility

## 🎉 **Benefits**

### **Professional Content:**
- ✅ **Establishes medical authority** for your hospital
- ✅ **Provides valuable health information** to community
- ✅ **Showcases doctor expertise** through authored articles
- ✅ **Improves website engagement** with quality content

### **Local Relevance:**
- ✅ **Addresses health challenges** specific to Kenya
- ✅ **Uses familiar medical context** for local audience
- ✅ **References local healthcare facilities** and programs
- ✅ **Promotes community health awareness**

### **Easy Maintenance:**
- ✅ **Template structure** ready for your real news
- ✅ **Professional formatting** already applied
- ✅ **Author system** connected to your doctors
- ✅ **CMS integration** for easy updates

## 📋 **Next Steps After Adding Articles**

1. **Run the script** to add sample articles
2. **Verify on website** that articles appear correctly
3. **Edit in Hygraph** to match your real news and updates
4. **Add featured images** for each article
5. **Update publication dates** to reflect current timing
6. **Customize content** with your hospital's actual news
7. **Create new articles** using the same structure

## 🔧 **Troubleshooting**

### **Token Permission Error:**
```
❌ Failed to add news article: Mutation failed due to permission errors
```
**Solution**: Ensure your Hygraph token has **Create** permission for NewsArticles

### **Schema Field Error:**
```
❌ Field 'content' of required type 'RichTextAST' was not provided
```
**Solution**: The script handles RichText conversion automatically

### **Network Error:**
```
❌ GraphQL request failed: fetch failed
```
**Solution**: Check internet connection and Hygraph endpoint

## 💡 **Content Ideas for Future Articles**

### **Health Topics Relevant to Kenya:**
- **Tuberculosis prevention** and treatment
- **HIV/AIDS awareness** and testing
- **Child nutrition** and growth monitoring
- **Mental health** in Kenyan communities
- **Hypertension management** in adults
- **Vaccination campaigns** and schedules
- **Water sanitation** and disease prevention
- **Emergency preparedness** for health crises

### **Hospital-Specific Content:**
- **New services** launched at your hospital
- **Doctor achievements** and certifications
- **Community health outreach** programs
- **Medical equipment** upgrades
- **Patient success stories** (with consent)
- **Health screening** events and campaigns

**Your news section will transform from empty to professionally populated with relevant health content! 📰✨**