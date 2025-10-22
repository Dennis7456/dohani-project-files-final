import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Clock, Phone, Calendar, CheckCircle, ArrowRight, Users, Award, Shield } from 'lucide-react'
import { useHomepageData, useMedicalService } from '@/hooks/useCMSData'
import { PageLoading } from '@/components/LoadingSpinner'
import AppointmentBooking from '@/components/AppointmentBooking'

function ServicePage() {
  const { id } = useParams()
  const { contactInfo } = useHomepageData()
  
  // Appointment booking state
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false)
  
  // Try to get service by name first, then by ID
  const { service: cmsService, loading } = useMedicalService(null, id)
  const { service: cmsServiceById, loading: loadingById } = useMedicalService(id, null)
  
  // Use whichever service was found
  const service = cmsService || cmsServiceById

  // Fallback service data for development
  const fallbackServices = {
    'general-medicine': {
      title: 'General Medicine',
      description: 'Comprehensive primary healthcare services for patients of all ages, providing diagnosis, treatment, and preventive care for a wide range of medical conditions.',
      fullDescription: `Our General Medicine department serves as the foundation of healthcare at Dohani Medicare Hospital. Our experienced general practitioners provide comprehensive primary care services, serving as your first point of contact for all health concerns.

We believe in building long-term relationships with our patients, understanding their medical history, lifestyle, and health goals to provide personalized care. Our approach focuses on not just treating illness, but promoting overall wellness and preventing disease.

Our general medicine services include routine health screenings, management of chronic conditions like diabetes and hypertension, acute illness treatment, and coordination of care with specialists when needed. We also provide health education and lifestyle counseling to help you maintain optimal health.`,
      features: [
        'Comprehensive health assessments and physical examinations',
        'Management of chronic diseases (diabetes, hypertension, heart disease)',
        'Acute illness diagnosis and treatment',
        'Preventive care and health screenings',
        'Vaccination and immunization services',
        'Health education and lifestyle counseling',
        'Referral coordination with specialists',
        'Annual wellness visits and check-ups'
      ],
      procedures: [
        'Complete Physical Examinations',
        'Blood Pressure Monitoring',
        'Blood Sugar Testing',
        'Basic Diagnostic Tests',
        'Wound Care and Minor Procedures',
        'Health Risk Assessments',
        'Medication Management',
        'Chronic Disease Monitoring'
      ],
      workingHours: 'Monday to Saturday: 8:00 AM - 6:00 PM',
      emergencyAvailable: true,
      appointmentRequired: true
    },
    'cardiology': {
      title: 'Cardiology',
      description: 'Specialized cardiac care including diagnosis, treatment, and management of heart conditions with state-of-the-art equipment and experienced cardiologists.',
      fullDescription: `Our Cardiology department provides comprehensive cardiac care using the latest diagnostic and treatment technologies. Our team of experienced cardiologists specializes in preventing, diagnosing, and treating diseases of the heart and blood vessels.

We offer a full range of cardiac services, from routine screenings to complex interventions. Our approach combines cutting-edge medical technology with compassionate care to ensure the best possible outcomes for our patients.

Whether you're dealing with a chronic heart condition, recovering from a cardiac event, or seeking preventive care, our cardiology team is dedicated to helping you maintain optimal heart health throughout your life.`,
      features: [
        'Comprehensive cardiac evaluations and risk assessments',
        'ECG (Electrocardiogram) and stress testing',
        'Echocardiography and cardiac imaging',
        'Hypertension management and monitoring',
        'Cholesterol management and lipid disorders',
        'Heart failure diagnosis and treatment',
        'Arrhythmia evaluation and management',
        'Cardiac rehabilitation programs'
      ],
      procedures: [
        'Electrocardiogram (ECG/EKG)',
        'Echocardiography',
        'Stress Testing',
        'Holter Monitoring',
        'Blood Pressure Assessment',
        'Cardiac Risk Stratification',
        'Lipid Profile Analysis',
        'Heart Rhythm Monitoring'
      ],
      workingHours: 'Monday to Saturday: 8:00 AM - 6:00 PM',
      emergencyAvailable: true,
      appointmentRequired: true
    },
    'pediatrics': {
      title: 'Pediatrics',
      description: 'Specialized healthcare for infants, children, and adolescents with a focus on growth, development, and age-appropriate medical care.',
      fullDescription: `Our Pediatrics department is dedicated to providing comprehensive healthcare for children from birth through adolescence. We understand that children have unique medical needs and require specialized care that differs from adult medicine.

Our pediatric team creates a child-friendly environment where young patients feel comfortable and safe. We work closely with parents and caregivers to ensure that children receive the best possible care while maintaining their emotional well-being.

From routine check-ups and vaccinations to managing childhood illnesses and developmental concerns, our pediatricians are committed to supporting your child's healthy growth and development at every stage.`,
      features: [
        'Well-child visits and developmental screenings',
        'Complete vaccination and immunization programs',
        'Growth and development monitoring',
        'Acute illness diagnosis and treatment',
        'Chronic condition management',
        'Nutritional counseling and guidance',
        'Behavioral and developmental assessments',
        'Adolescent health and counseling services'
      ],
      procedures: [
        'Routine Physical Examinations',
        'Growth and Development Assessment',
        'Vaccination Administration',
        'Vision and Hearing Screenings',
        'Developmental Milestone Evaluation',
        'Nutritional Assessment',
        'Basic Diagnostic Tests',
        'Minor Wound Care'
      ],
      workingHours: 'Monday to Saturday: 8:00 AM - 6:00 PM',
      emergencyAvailable: true,
      appointmentRequired: true
    },
    'laboratory-services': {
      title: 'Laboratory Services',
      description: 'State-of-the-art diagnostic laboratory providing accurate and timely test results with a comprehensive range of medical testing services.',
      fullDescription: `Our Laboratory Services department is equipped with state-of-the-art diagnostic equipment and staffed by experienced laboratory technicians and pathologists. We provide a comprehensive range of laboratory tests to support accurate diagnosis and effective treatment planning.

We understand the importance of accurate and timely test results in healthcare decision-making. Our laboratory maintains the highest standards of quality control and follows strict protocols to ensure reliable results that healthcare providers can trust.

From routine blood work to specialized diagnostic tests, our laboratory services support all departments within the hospital and serve as a crucial component in patient care and treatment monitoring.`,
      features: [
        'Complete blood count (CBC) and blood chemistry panels',
        'Microbiology and infectious disease testing',
        'Hormone and endocrine function tests',
        'Cardiac markers and lipid profiles',
        'Liver and kidney function tests',
        'Diabetes monitoring and glucose testing',
        'Pregnancy and fertility testing',
        'Cancer markers and tumor screening'
      ],
      procedures: [
        'Blood Sample Collection',
        'Urine Analysis',
        'Stool Examination',
        'Microbiological Cultures',
        'Biochemical Analysis',
        'Hematological Testing',
        'Immunological Assays',
        'Molecular Diagnostics'
      ],
      workingHours: 'Monday to Saturday: 7:00 AM - 7:00 PM, Sunday: 8:00 AM - 2:00 PM',
      emergencyAvailable: true,
      appointmentRequired: false
    },
    'pharmacy': {
      title: 'Pharmacy Services',
      description: '24/7 pharmacy services providing a comprehensive range of medications, health products, and professional pharmaceutical consultation.',
      fullDescription: `Our Pharmacy Services operate 24/7 to ensure that patients have access to essential medications and pharmaceutical care whenever needed. Our licensed pharmacists are available to provide medication counseling, drug interaction checks, and answer questions about your prescriptions.

We maintain a comprehensive inventory of medications, including both brand-name and generic options, to meet diverse patient needs and budgets. Our pharmacy also stocks medical supplies, health and wellness products, and over-the-counter medications.

Our pharmacists work closely with healthcare providers to ensure optimal medication therapy outcomes. We provide medication management services, including dosage optimization, side effect monitoring, and patient education to promote safe and effective medication use.`,
      features: [
        '24/7 prescription dispensing services',
        'Medication counseling and education',
        'Drug interaction and allergy screening',
        'Generic medication alternatives',
        'Medication therapy management',
        'Over-the-counter health products',
        'Medical supplies and equipment',
        'Insurance and payment assistance'
      ],
      procedures: [
        'Prescription Verification and Dispensing',
        'Medication Counseling',
        'Drug Interaction Screening',
        'Dosage Calculation and Optimization',
        'Medication Reconciliation',
        'Patient Education Services',
        'Insurance Processing',
        'Medication Storage and Handling'
      ],
      workingHours: '24/7 - Open all day, every day',
      emergencyAvailable: true,
      appointmentRequired: false
    },
    'emergency-services': {
      title: 'Emergency Services',
      description: '24/7 emergency medical services providing immediate care for urgent and life-threatening conditions with fully equipped emergency department.',
      fullDescription: `Our Emergency Services department operates 24 hours a day, 7 days a week, providing immediate medical care for urgent and life-threatening conditions. Our emergency team is trained to handle a wide range of medical emergencies with speed, efficiency, and compassion.

Our emergency department is fully equipped with advanced life support equipment, diagnostic capabilities, and direct access to all hospital services. We maintain rapid response protocols and work seamlessly with ambulance services to ensure patients receive timely care.

Whether you're experiencing a medical emergency, accident-related injuries, or urgent health concerns that cannot wait for a regular appointment, our emergency team is ready to provide the immediate care you need.`,
      features: [
        '24/7 emergency medical care',
        'Trauma and accident injury treatment',
        'Cardiac emergency management',
        'Respiratory distress and breathing problems',
        'Severe pain and acute illness treatment',
        'Poisoning and overdose management',
        'Pediatric emergency care',
        'Ambulance coordination and transport'
      ],
      procedures: [
        'Emergency Triage and Assessment',
        'Advanced Life Support',
        'Trauma Stabilization',
        'Emergency Diagnostic Imaging',
        'Cardiac Monitoring and Support',
        'Wound Care and Suturing',
        'Emergency Medications',
        'Critical Care Coordination'
      ],
      workingHours: '24/7 - Always available',
      emergencyAvailable: true,
      appointmentRequired: false
    }
  }

  // Convert CMS service to the expected format
  const currentService = service ? {
    title: service.title,
    description: service.description,
    fullDescription: service.description, // Use description as full description
    features: service.servicesOffered || [],
    procedures: service.servicesOffered || [], // Use servicesOffered as procedures for now
    workingHours: 'Monday to Saturday: 8:00 AM - 6:00 PM', // Default hours
    emergencyAvailable: true,
    appointmentRequired: true
  } : fallbackServices[id] || fallbackServices['general-medicine']

  // Show loading state
  if (loading || loadingById) {
    return <PageLoading message="Loading service information..." />
  }

  if (!currentService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">{currentService.title}</h1>
            <p className="text-xl text-blue-100 mb-8">
              {currentService.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setShowAppointmentBooking(true)}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
              <Button 
                onClick={() => window.location.href = `tel:${contactInfo?.phone}`}
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-blue-900 mb-6">About This Service</h2>
                <div className="text-gray-600 whitespace-pre-line mb-8">
                  {currentService.fullDescription}
                </div>

                {/* Features */}
                <h3 className="text-2xl font-bold text-blue-900 mb-6">What We Offer</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {currentService.features?.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Procedures */}
                <h3 className="text-2xl font-bold text-blue-900 mb-6">Common Procedures</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentService.procedures?.map((procedure, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{procedure}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Service Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Service Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Working Hours</h4>
                    <p className="text-gray-600">{currentService.workingHours}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Emergency Available</h4>
                    <p className="text-gray-600">
                      {currentService.emergencyAvailable ? 'Yes, 24/7 emergency care' : 'No, scheduled appointments only'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Appointment Required</h4>
                    <p className="text-gray-600">
                      {currentService.appointmentRequired ? 'Yes, please book in advance' : 'No, walk-ins welcome'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
                    <p className="text-gray-600">{contactInfo?.phone || 'Loading...'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Emergency</h4>
                    <p className="text-gray-600">{contactInfo?.emergencyPhone || contactInfo?.phone || 'Loading...'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                    <p className="text-gray-600">{contactInfo?.email || 'Loading...'}</p>
                  </div>
                  <Button 
                    onClick={() => setShowAppointmentBooking(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>

              {/* Why Choose Us */}
              <Card>
                <CardHeader>
                  <CardTitle>Why Choose Dohani Medicare?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Experienced Team</h4>
                      <p className="text-sm text-gray-600">Qualified medical professionals with years of experience</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Award className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Quality Care</h4>
                      <p className="text-sm text-gray-600">Committed to providing the highest standard of medical care</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Patient Safety</h4>
                      <p className="text-sm text-gray-600">Your safety and well-being are our top priorities</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your appointment today and experience quality healthcare at Dohani Medicare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowAppointmentBooking(true)}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Book Appointment Now
            </Button>
            <Button 
              onClick={() => window.location.href = `tel:${contactInfo?.phone}`}
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Call Us Today
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

export default ServicePage