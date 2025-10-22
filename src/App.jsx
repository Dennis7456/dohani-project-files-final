import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useHomepageData, useDoctors, useNewsArticles } from '@/hooks/useCMSData'
import { useScrollPosition, useSmoothScroll } from '@/hooks/useScrollPosition'
import { DoctorCardSkeleton, NewsCardSkeleton } from '@/components/LoadingSpinner'
import AppointmentBooking from '@/components/AppointmentBooking'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Menu, X, Phone, Mail, MapPin, Clock, ChevronRight, Heart, Users, Award, Calendar, Stethoscope, Home as HomeIcon, Info, Contact, Newspaper } from 'lucide-react'
import ChatBot from '@/components/ChatBot'
import ServicesCarousel from '@/components/ServicesCarousel'
// import ScrollPositionDebug from '@/components/ScrollPositionDebug'
import './App.css'
import logo from '@/assets/official_dohani_logo.jpg'
import reception from '@/assets/30e30f5b-7f8d-49be-84c2-258988ded82d(1).jpeg'
import doctor from '@/assets/e60976b0-01ab-4d9c-a15a-a18ff48a5ae5(1).jpeg'
import ward from '@/assets/78687735-b5fd-46af-a4cc-ca8ab3fcd7d1(1).jpeg'
import femaleWard from '@/assets/8f21a11f-099f-4d17-8457-84e46b933621(1).jpeg'
import hospital from '@/assets/f4c374e0-0e01-47fb-8f7c-e15fff2d37b8(1).jpeg'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null })

  // Appointment booking state
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false)

  // Scroll position management
  const { saveCurrentPosition, scrollToElement } = useScrollPosition()
  const { handleSmoothScroll } = useSmoothScroll()

  // Get CMS data from Hygraph - pure CMS integration, no hardcoded fallbacks
  const {
    loading: cmsLoading,
    services: cmsServices,
    contactInfo,
    workingHours
  } = useHomepageData()
  const { doctors: cmsDoctors, loading: doctorsLoading } = useDoctors()
  const { articles: allNewsArticles, loading: newsLoading } = useNewsArticles(6)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '#home', icon: HomeIcon },
    { name: 'About Us', href: '#about', icon: Info },
    { name: 'Services', href: '#services', icon: Stethoscope },
    { name: 'Doctors', href: '#doctors', icon: Users },
    { name: 'Contact', href: '#contact', icon: Contact },
    { name: 'News', href: '#news', icon: Newspaper },
  ]

  // Pure CMS services - no hardcoded fallbacks
  const services = cmsServices || []

  // Service icons are now handled in CMS hooks

  // Form validation helper
  const validateForm = () => {
    const errors = []

    // Name validation
    if (!formData.name.trim()) {
      errors.push('Name is required')
    } else if (formData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long')
    } else if (formData.name.trim().length > 100) {
      errors.push('Name must be less than 100 characters')
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.push('Email is required')
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email.trim())) {
        errors.push('Please enter a valid email address')
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.push('Message is required')
    } else if (formData.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long')
    } else if (formData.message.trim().length > 1000) {
      errors.push('Message must be less than 1000 characters')
    }

    return errors
  }

  // Form submission handler - Temporary fallback until ContactMessage model is created
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormStatus({ loading: true, success: false, error: null })

    try {
      // Validate form
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0]) // Show first error
      }

      // Real CMS integration - ContactMessage model is now created
      // console.log('Submitting to Hygraph CMS...')

      /*
      // Temporary fallback - commented out since CMS is now ready
      await new Promise(resolve => setTimeout(resolve, 1500))
      const messageId = `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      // console.log('Contact Form Submission:', {
        id: messageId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        timestamp: new Date().toISOString()
      })
      setFormStatus({
        loading: false,
        success: true,
        error: null,
        message: 'Message received successfully! We will respond within 24 hours.',
        id: messageId
      })
      setFormData({ name: '', email: '', message: '' })
      */
      const hygraphEndpoint = import.meta.env.VITE_HYGRAPH_ENDPOINT?.replace('us-west-2.cdn.hygraph.com/content', 'api-us-west-2.hygraph.com/v2') || 'https://api-us-west-2.hygraph.com/v2/cmgr5l0iu00pf07wf9zpyrn3d/master'
      const hygraphToken = import.meta.env.VITE_HYGRAPH_TOKEN

      // console.log('Hygraph config:', {
      //   endpoint: hygraphEndpoint,
      //   hasToken: !!hygraphToken,
      //   tokenLength: hygraphToken?.length
      // })

      if (!hygraphToken) {
        throw new Error('CMS configuration error. Please contact support.')
      }

      const CREATE_MESSAGE = `
        mutation CreateMessage(
          $name: String!
          $email: String!
          $message: RichTextAST!
          $messageStatus: Messagestatus!
          $messageSource: Source!
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
      `

      // Convert message to RichText format for Hygraph
      const messageRichText = {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: formData.message.trim()
              }
            ]
          }
        ]
      }

      const response = await fetch(hygraphEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hygraphToken}`
        },
        body: JSON.stringify({
          query: CREATE_MESSAGE,
          variables: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: messageRichText,
            messageStatus: 'unread', // New messages should be unread
            messageSource: 'website' // Confirmed from error message
          }
        })
      })

      const result = await response.json()
      // console.log('Hygraph response:', result)

      if (result.errors) {
        // console.error('GraphQL errors:', result.errors)
        throw new Error(`CMS Error: ${result.errors[0]?.message || 'Failed to save message'}`)
      }

      if (result.data?.createMessage) {
        // console.log('Message saved successfully:', result.data.createMessage)
        setFormStatus({
          loading: false,
          success: true,
          error: null,
          message: 'Message received successfully! We will respond within 24 hours.',
          id: result.data.createMessage.id
        })
        setFormData({ name: '', email: '', message: '' })
      } else {
        throw new Error('Failed to save message to our system')
      }

    } catch (error) {
      // console.error('Form submission error:', error)
      setFormStatus({
        loading: false,
        success: false,
        error: error.message || 'Failed to send message. Please try again or contact us directly.'
      })
    }
  }

  // Form input handler with real-time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Clear any existing errors when user starts typing
    if (formStatus.error) {
      setFormStatus(prev => ({ ...prev, error: null }))
    }

    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const stats = [
    { label: 'Years of Service', value: '5+' },
    { label: 'Medical Professionals', value: '20+' },
    { label: 'Patients Served', value: '10,000+' },
    { label: 'Success Rate', value: '98%' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Dohani Medicare" className="h-12 w-auto" />
              <span className="text-2xl font-bold text-blue-900">Dohani Medicare</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={(e) => {
                    e.preventDefault()
                    const sectionId = item.href.slice(1) // Remove the #
                    setActiveSection(sectionId)
                    handleSmoothScroll(sectionId)
                  }}
                >
                  {item.name}
                </a>
              ))}
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowAppointmentBooking(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 py-2"
                  onClick={(e) => {
                    e.preventDefault()
                    const sectionId = item.href.slice(1) // Remove the #
                    setActiveSection(sectionId)
                    setMobileMenuOpen(false)
                    handleSmoothScroll(sectionId)
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              ))}
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowAppointmentBooking(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Clock className="mr-2 h-4 w-4" />
                Open 24 Hours | Quality • Compassion • Care
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-blue-900 leading-tight">
                The Care You Deserve
              </h1>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Located along <strong>Bamburi Mwembeni Road</strong>, just a few metres from Kaziandani Police Station,
                  Dohani Medicare Hospital is your trusted neighborhood healthcare center in Mwembeni, Mombasa.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We provide comprehensive medical services — from emergency care and outpatient consultations to
                  laboratory tests, maternity care, and pharmacy services — all delivered by a dedicated team of
                  professionals who truly care.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  At Dohani Medicare, your health, comfort, and safety are our top priorities. 💙
                </p>
                <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-3 rounded-lg">
                  <Phone className="mr-3 h-5 w-5" />
                  <span className="font-medium">Always here when you need us — open 24/7.</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowAppointmentBooking(true)}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Button>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    Learn More
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img
                src={hospital}
                alt="Dohani Medicare Hospital"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Open 24/7</p>
                    <p className="font-bold text-blue-900">Emergency Services</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-800">Quality Care</p>
                    <p className="text-xs text-gray-600">Trusted by thousands</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-blue-900">About Dohani Medicare</h2>
              <p className="text-lg text-gray-600">
                Dohani Medicare is a modern healthcare facility dedicated to providing exceptional medical services to our community. Established with a vision of bringing hope and a new approach to healthcare, we combine state-of-the-art technology with compassionate care.
              </p>
              <p className="text-lg text-gray-600">
                Our team of experienced medical professionals is committed to ensuring that every patient receives personalized attention and the highest quality treatment. We believe that the greatest gift you can give your family and the world is a healthy you.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Award className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Accredited Facility</h3>
                    <p className="text-sm text-gray-600">Certified healthcare standards</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Expert Team</h3>
                    <p className="text-sm text-gray-600">Qualified professionals</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src={reception} alt="Reception" className="rounded-xl shadow-lg" />
              <img src={doctor} alt="Doctor" className="rounded-xl shadow-lg mt-8" />
              <img src={ward} alt="Ward" className="rounded-xl shadow-lg" />
              <img src={femaleWard} alt="Female Ward" className="rounded-xl shadow-lg mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare services tailored to meet your medical needs with excellence and care.
            </p>
          </div>
          <ServicesCarousel services={services} loading={cmsLoading} />
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Our Medical Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet our dedicated team of healthcare professionals committed to your well-being.
            </p>
          </div>
          {/* Debug info - commented out for production */}
          {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 text-sm">
              <strong>Debug Info:</strong>
              {doctorsLoading ? ' Loading doctors...' :
                cmsDoctors?.length > 0 ? ` Found ${cmsDoctors.length} doctors in CMS` :
                  ' No doctors found in CMS - showing fallback placeholders'}
            </p>
          </div> */}

          {doctorsLoading ? (
            // Show loading skeletons while loading
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <DoctorCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {cmsDoctors && cmsDoctors.length > 0 ? (
                cmsDoctors.slice(0, 6).map((doctor) => (
                  <Card key={doctor.id} className="text-center hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      {doctor.photo ? (
                        <img
                          src={doctor.photo.url}
                          alt={doctor.name}
                          className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <Users className="h-16 w-16 text-white" />
                        </div>
                      )}
                      <CardTitle className="text-xl text-blue-900">{doctor.name}</CardTitle>
                      <CardDescription>{doctor.specialty}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        {doctor.bio || 'Experienced healthcare provider dedicated to patient care and medical excellence.'}
                      </p>
                      {doctor.consultationHours && (
                        <p className="text-sm text-blue-600 mb-4">
                          Available: {doctor.consultationHours}
                        </p>
                      )}
                      <Link to={`/doctor/${doctor.id || doctor.name?.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                          View Profile
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Fallback doctors if CMS data is not available
                [1, 2, 3].map((_, index) => (
                  <Card key={`fallback-${index}`} className="text-center hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <Users className="h-16 w-16 text-white" />
                      </div>
                      <CardTitle className="text-xl text-blue-900">Dr. Medical Professional</CardTitle>
                      <CardDescription>Specialist Physician</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Experienced healthcare provider dedicated to patient care and medical excellence.
                      </p>
                      <Link to={`/doctor/dr-medical-professional-${index + 1}`}>
                        <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                          View Profile
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get in touch with us for appointments, inquiries, or emergency services.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Phone</h3>
                        <p className="text-gray-600">{contactInfo?.phone || 'Loading...'}</p>
                        <p className="text-sm text-gray-500">Available 24/7</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Email</h3>
                        <p className="text-gray-600">{contactInfo?.email || 'Loading...'}</p>
                        <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Location</h3>
                        <p className="text-gray-600">{contactInfo?.location || 'Loading...'}</p>
                        <p className="text-sm text-gray-500">Open 24 Hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Working Hours</h3>
                        <p className="text-gray-600">{workingHours?.emergency || 'Loading...'}</p>
                        <p className="text-sm text-gray-500">{workingHours?.consultation || 'Loading...'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900">Send us a message</CardTitle>
                <CardDescription>Fill out the form and we'll get back to you soon.</CardDescription>
              </CardHeader>
              <CardContent>
                {formStatus.success ? (
                  <div className="text-center py-8">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-green-100 rounded-full p-2">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
                      <p className="text-green-600">
                        {formStatus.message || 'Thank you for contacting us. We\'ll get back to you soon.'}
                      </p>
                      {formStatus.id && (
                        <p className="text-green-500 text-sm mt-2">
                          Reference ID: {formStatus.id}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setFormStatus({ loading: false, success: false, error: null })}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleFormSubmit}>
                    {formStatus.error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 text-sm">{formStatus.error}</p>
                      </div>
                    )}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        minLength={2}
                        maxLength={100}
                        disabled={formStatus.loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-describedby="name-help"
                      />
                      <p id="name-help" className="text-xs text-gray-500 mt-1">
                        Please enter your full name (2-100 characters)
                      </p>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        required
                        disabled={formStatus.loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-describedby="email-help"
                      />
                      <p id="email-help" className="text-xs text-gray-500 mt-1">
                        We'll use this to respond to your message
                      </p>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please describe your inquiry or how we can help you..."
                        rows="4"
                        required
                        minLength={10}
                        maxLength={1000}
                        disabled={formStatus.loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-vertical"
                        aria-describedby="message-help"
                      ></textarea>
                      <p id="message-help" className="text-xs text-gray-500 mt-1">
                        Please provide details about your inquiry (10-1000 characters)
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={formStatus.loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    >
                      {formStatus.loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">News & Updates</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay informed about our latest news, health tips, and community initiatives.
            </p>
          </div>
          {newsLoading ? (
            // Show loading skeletons while loading
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <NewsCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {allNewsArticles && allNewsArticles.length > 0 ? (
                allNewsArticles.slice(0, 6).map((article) => (
                  <Card key={article.id} className="hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      {article.featuredImage ? (
                        <img
                          src={article.featuredImage.url}
                          alt={article.title}
                          className="h-48 w-full object-cover rounded-lg mb-4"
                        />
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                          <Newspaper className="h-16 w-16 text-white" />
                        </div>
                      )}
                      <CardTitle className="text-xl text-blue-900">{article.title}</CardTitle>
                      <CardDescription>
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recent'}
                        {article.author && ` • By ${article.author}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        {article.excerpt || 'Stay informed with the latest health information and updates from Dohani Medicare.'}
                      </p>
                      <Link to={`/news/${article.id || article.title?.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Button variant="link" className="text-blue-600 p-0">
                          Read More <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Fallback news if CMS data is not available
                [1, 2, 3].map((_, index) => (
                  <Card key={`fallback-news-${index}`} className="hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                        <Newspaper className="h-16 w-16 text-white" />
                      </div>
                      <CardTitle className="text-xl text-blue-900">Health Update</CardTitle>
                      <CardDescription>Recent</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Important health information and updates from Dohani Medicare.
                      </p>
                      <Link to={`/news/health-update-${index + 1}`}>
                        <Button variant="link" className="text-blue-600 p-0">
                          Read More <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src={logo} alt="Dohani Medicare" className="h-12 w-auto mb-4" />
              <p className="text-blue-200">
                Quality healthcare services with compassion and excellence.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-blue-200 hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2">
                {services.slice(0, 4).map((service) => (
                  <li key={service.title}>
                    <Link
                      to={`/service/${service.name || service.id}`}
                      className="text-blue-200 hover:text-white transition-colors"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-blue-200">
                <li>Phone: {contactInfo?.phone || 'Loading...'}</li>
                <li>Email: {contactInfo?.email || 'Loading...'}</li>
                <li>Open 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; 2025 Dohani Medicare. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI ChatBot Component */}
      <ChatBot />

      {/* Appointment Booking Modal */}
      <AppointmentBooking
        isOpen={showAppointmentBooking}
        onClose={() => setShowAppointmentBooking(false)}
      />

      {/* Debug component for development - commented out for production */}
      {/* <ScrollPositionDebug /> */}
    </div>
  )
}

export default App

