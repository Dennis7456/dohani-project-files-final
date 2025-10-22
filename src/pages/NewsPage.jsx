import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Mail } from 'lucide-react'
import { useNewsArticles } from '@/hooks/useCMSData'
import { PageLoading } from '@/components/LoadingSpinner'
import AppointmentBooking from '@/components/AppointmentBooking'

function NewsPage() {
  const { id } = useParams()
  const { articles, loading } = useNewsArticles()
  
  // Appointment booking state
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false)
  
  // Find the article by ID or slug
  const article = articles?.find(a => 
    a.id === id || 
    a.title?.toLowerCase().replace(/\s+/g, '-') === id ||
    a.slug === id
  )

  // Fallback article data for development
  const fallbackArticles = {
    'malaria-prevention-campaign': {
      title: 'New Malaria Prevention Campaign Launched in Coastal Kenya',
      excerpt: 'The Ministry of Health launches a comprehensive malaria prevention campaign targeting coastal regions, including Mombasa County, with focus on bed net distribution and community education.',
      content: `The Ministry of Health, in partnership with international health organizations, has launched an ambitious malaria prevention campaign across Kenya's coastal regions. The initiative, which specifically targets Mombasa, Kilifi, and Kwale counties, aims to reduce malaria incidence by 40% over the next two years.

**Community Education Programs**

Health workers will conduct door-to-door visits to educate families about malaria prevention, symptoms recognition, and the importance of seeking early treatment. Special emphasis will be placed on protecting pregnant women and children under five years old.

**Bed Net Distribution**

Over 500,000 long-lasting insecticidal nets (LLINs) will be distributed free of charge to households in high-risk areas. The nets have been treated with advanced insecticides that remain effective for up to three years.

**Healthcare Facility Strengthening**

Local health facilities, including Dohani Medicare Hospital, are being equipped with rapid diagnostic tests and artemisinin-based combination therapies (ACTs) to ensure quick and accurate malaria diagnosis and treatment.

**Environmental Management**

Community-based programs will focus on eliminating mosquito breeding sites through proper waste management and water storage practices.

Dr. Sarah Mwangi, County Director of Health for Mombasa, emphasized the importance of community participation: "This campaign's success depends on every household taking responsibility for malaria prevention. Simple actions like using bed nets consistently and eliminating stagnant water can save lives."

The campaign is expected to benefit over 2 million residents across the coastal region and serves as a model for similar initiatives in other parts of Kenya.

**How Dohani Medicare is Contributing**

As part of this initiative, Dohani Medicare Hospital has:
- Trained additional staff in malaria diagnosis and treatment
- Stocked up on rapid diagnostic tests and ACT medications
- Established a dedicated malaria treatment center
- Partnered with community health workers for outreach programs

**Prevention Tips for Families**

1. **Use bed nets every night** - Ensure all family members sleep under treated mosquito nets
2. **Eliminate standing water** - Remove water from containers, gutters, and other breeding sites
3. **Seek early treatment** - Visit a healthcare facility immediately if you experience fever, chills, or other malaria symptoms
4. **Take preventive medication** - Pregnant women should take prescribed antimalarial drugs
5. **Wear protective clothing** - Use long sleeves and pants during peak mosquito hours (dusk and dawn)

The campaign represents a significant step forward in Kenya's fight against malaria and demonstrates the power of community-based health interventions.`,
      author: 'Dr. Sarah Mwangi',
      publishedAt: '2024-10-20T08:00:00Z',
      readTime: '5 min read',
      category: 'Public Health',
      tags: ['malaria', 'prevention', 'coastal-kenya', 'public-health']
    },
    'diabetes-management-urban-kenya': {
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

**Dohani Medicare's Diabetes Care Program**

Our comprehensive diabetes management program includes:

- **Regular Health Screenings**: HbA1c testing, lipid profiles, and kidney function tests
- **Nutritional Counseling**: Personalized meal planning with registered dietitians
- **Exercise Programs**: Supervised physical activity sessions
- **Patient Education**: Diabetes self-management classes
- **Support Groups**: Peer support and motivation
- **Complication Screening**: Regular eye, foot, and kidney examinations

**Warning Signs of Diabetes**

Seek medical attention if you experience:
- Excessive thirst and frequent urination
- Unexplained weight loss
- Fatigue and weakness
- Blurred vision
- Slow-healing wounds
- Frequent infections

**Living Well with Diabetes**

With proper management, people with diabetes can live full, healthy lives. The key is working closely with healthcare providers, maintaining healthy lifestyle habits, and staying informed about the condition.

For more information about diabetes screening and management, contact Dohani Medicare Hospital's diabetes clinic or speak with your healthcare provider.`,
      author: 'Dr. James Ochieng',
      publishedAt: '2024-10-17T10:30:00Z',
      readTime: '7 min read',
      category: 'Chronic Diseases',
      tags: ['diabetes', 'urban-health', 'lifestyle', 'prevention']
    },
    'maternal-health-mombasa': {
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

**Dohani Medicare's Maternity Services**

Our comprehensive maternity care includes:

**Prenatal Care**
- Regular check-ups and monitoring
- Ultrasound services
- High-risk pregnancy management
- Nutritional counseling
- Birth preparation classes

**Delivery Services**
- 24/7 maternity ward
- Natural birth support
- Cesarean section capabilities
- Pain management options
- Immediate newborn care

**Postnatal Care**
- Recovery support
- Breastfeeding assistance
- Newborn health checks
- Family planning counseling
- Postpartum depression screening

**When to Seek Immediate Care**

Contact your healthcare provider immediately if you experience:
- Severe headaches or vision changes
- Persistent vomiting
- Decreased fetal movement
- Vaginal bleeding
- Severe abdominal pain
- Signs of preterm labor

**Preparing for Pregnancy**

Before conception, consider:
- Folic acid supplementation
- Health screenings and vaccinations
- Lifestyle modifications
- Managing chronic conditions
- Genetic counseling if needed

For prenatal care services and family planning consultation, visit Dohani Medicare Hospital or your nearest healthcare facility.`,
      author: 'Dr. Amina Mohamed',
      publishedAt: '2024-10-15T14:15:00Z',
      readTime: '6 min read',
      category: 'Maternal Health',
      tags: ['maternal-health', 'pregnancy', 'prenatal-care', 'mombasa']
    }
  }

  const currentArticle = article || fallbackArticles[id] || fallbackArticles['malaria-prevention-campaign']

  // Show loading state
  if (loading) {
    return <PageLoading message="Loading article..." />
  }

  if (!currentArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const shareUrl = window.location.href
  const shareTitle = currentArticle.title

  return (
    <div className="min-h-screen">
      {/* Article Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link 
              to="/#news" 
              className="inline-flex items-center text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Link>
          </div>
          
          <div className="mb-6">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentArticle.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {currentArticle.title}
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            {currentArticle.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-blue-100">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{currentArticle.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(currentArticle.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{currentArticle.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="prose prose-lg max-w-none">
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {currentArticle.content.split('**').map((part, index) => {
                    if (index % 2 === 1) {
                      return <strong key={index} className="font-bold text-gray-900">{part}</strong>
                    }
                    return part
                  })}
                </div>
              </article>

              {/* Tags */}
              {currentArticle.tags && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentArticle.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
                <div className="flex space-x-4">
                  <Button
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </Button>
                  <Button
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank')}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Twitter className="h-4 w-4" />
                    <span>Twitter</span>
                  </Button>
                  <Button
                    onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Author Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About the Author</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{currentArticle.author}</h4>
                      <p className="text-sm text-gray-600">
                        Medical professional at Dohani Medicare Hospital
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Services */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link 
                      to="/service/general-medicine"
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <h5 className="font-medium text-gray-900">General Medicine</h5>
                      <p className="text-sm text-gray-600">Comprehensive primary healthcare</p>
                    </Link>
                    <Link 
                      to="/service/laboratory-services"
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <h5 className="font-medium text-gray-900">Laboratory Services</h5>
                      <p className="text-sm text-gray-600">Diagnostic testing services</p>
                    </Link>
                    <Link 
                      to="/service/emergency-services"
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <h5 className="font-medium text-gray-900">Emergency Services</h5>
                      <p className="text-sm text-gray-600">24/7 emergency medical care</p>
                    </Link>
                  </CardContent>
                </Card>

                {/* Contact CTA */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Need Medical Advice?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Consult with our medical professionals for personalized healthcare advice.
                    </p>
                    <Button 
                      onClick={() => setShowAppointmentBooking(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Stay Informed About Your Health</h2>
          <p className="text-xl text-blue-100 mb-8">
            Subscribe to our newsletter for the latest health news and tips from Dohani Medicare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowAppointmentBooking(true)}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Book Appointment
            </Button>
            <Button 
              onClick={() => window.location.href = '/#news'}
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Read More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Appointment Booking Modal */}
      <AppointmentBooking
        isOpen={showAppointmentBooking}
        onClose={() => setShowAppointmentBooking(false)}
      />
    </div>
  )
}

export default NewsPage