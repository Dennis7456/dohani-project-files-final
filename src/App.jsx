import { useState, useEffect } from 'react'
import { useHomepageData } from '@/hooks/useCMSData'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Menu, X, Phone, Mail, MapPin, Clock, ChevronRight, MessageCircle, Heart, Users, Award, Calendar, Stethoscope, Baby, Activity, Pill, Home as HomeIcon, Info, Briefcase, Contact, Newspaper } from 'lucide-react'
import ChatBot from '@/components/ChatBot'
import './App.css'
import logo from '@/assets/official_dohani_logo.jpg'
import reception from '@/assets/30e30f5b-7f8d-49be-84c2-258988ded82d(1).jpeg'
import doctor from '@/assets/e60976b0-01ab-4d9c-a15a-a18ff48a5ae5(1).jpeg'
import ward from '@/assets/78687735-b5fd-46af-a4cc-ca8ab3fcd7d1(1).jpeg'
import femaleWard from '@/assets/8f21a11f-099f-4d17-8457-84e46b933621(1).jpeg'
import hospital from '@/assets/f4c374e0-0e01-47fb-8f7c-e15fff2d37b8(1).jpeg'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null })
  
  // Get CMS data from Hygraph
  const { loading: cmsLoading, error: cmsError, services: cmsServices, contactInfo, workingHours, newsArticles } = useHomepageData()

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

  // Use CMS services or fallback to static data
  const services = cmsServices.length > 0 ? cmsServices.map(service => ({
    icon: getServiceIcon(service.name),
    title: service.name,
    description: service.description,
  })) : [
    {
      icon: Stethoscope,
      title: 'General Medicine',
      description: 'Comprehensive primary care services for all ages, including diagnosis, treatment, and preventive care.',
    },
    {
      icon: Heart,
      title: 'Cardiology',
      description: 'Expert cardiac care including ECG, stress tests, and heart disease management.',
    },
    {
      icon: Baby,
      title: 'Pediatrics',
      description: 'Specialized healthcare for infants, children, and adolescents with compassionate care.',
    },
    {
      icon: Activity,
      title: 'Laboratory Services',
      description: 'State-of-the-art diagnostic testing with accurate and timely results.',
    },
    {
      icon: Pill,
      title: 'Pharmacy',
      description: '24/7 pharmacy services with a wide range of medications and professional consultation.',
    },
    {
      icon: Users,
      title: 'Consultation Clinics',
      description: 'Specialist consultations across various medical disciplines for comprehensive care.',
    },
  ]

  // Helper function to get service icons
  function getServiceIcon(serviceName) {
    const iconMap = {
      'General Medicine': Stethoscope,
      'Cardiology': Heart,
      'Pediatrics': Baby,
      'Laboratory Services': Activity,
      'Pharmacy': Pill,
      'Consultation Clinics': Users,
    }
    return iconMap[serviceName] || Stethoscope
  }

  // Form submission handler
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormStatus({ loading: true, success: false, error: null })

    try {
      const response = await fetch('/api/submit-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setFormStatus({ loading: false, success: true, error: null })
        setFormData({ name: '', email: '', message: '' })
      } else {
        setFormStatus({ loading: false, success: false, error: result.error || 'Failed to send message' })
      }
    } catch (error) {
      setFormStatus({ loading: false, success: false, error: 'Network error. Please try again.' })
    }
  }

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target
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
                  onClick={() => setActiveSection(item.href.slice(1))}
                >
                  {item.name}
                </a>
              ))}
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
                  onClick={() => {
                    setActiveSection(item.href.slice(1))
                    setMobileMenuOpen(false)
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              ))}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
              <h1 className="text-5xl md:text-6xl font-bold text-blue-900 leading-tight">
                The Care You Deserve
              </h1>
              <p className="text-xl text-gray-600">
                Dohani Medicare provides comprehensive healthcare services with a commitment to excellence, compassion, and innovation. Your health is our priority.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Button>
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Learn More
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-none animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-blue-900">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
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
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
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
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
                        <p className="text-gray-600">{contactInfo?.phone || '+254-XXX-XXX-XXX'}</p>
                        <p className="text-sm text-gray-500">Available 24/7</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Email</h3>
                        <p className="text-gray-600">{contactInfo?.email || 'info@dohanmedicare.com'}</p>
                        <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Location</h3>
                        <p className="text-gray-600">{contactInfo?.location || 'Dohani Medicare Hospital'}</p>
                        <p className="text-sm text-gray-500">Open 24 Hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Working Hours</h3>
                        <p className="text-gray-600">{workingHours?.emergency || '24/7 Emergency Services'}</p>
                        <p className="text-sm text-gray-500">{workingHours?.consultation || 'Consultation: Mon-Sat 8AM-6PM'}</p>
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
                      <p className="text-green-600">Thank you for contacting us. We'll get back to you soon.</p>
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
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        required
                        disabled={formStatus.loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your Email"
                        required
                        disabled={formStatus.loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Your Message"
                        rows="4"
                        required
                        disabled={formStatus.loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      ></textarea>
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
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4"></div>
                  <CardTitle className="text-xl text-blue-900">Health Update</CardTitle>
                  <CardDescription>October 12, 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Important health information and updates from Dohani Medicare.
                  </p>
                  <Button variant="link" className="text-blue-600 p-0">
                    Read More <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
                    <a href={item.href} className="text-blue-200 hover:text-white transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2">
                {services.slice(0, 4).map((service) => (
                  <li key={service.title}>
                    <a href="#services" className="text-blue-200 hover:text-white transition-colors">
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-blue-200">
                <li>Phone: {contactInfo?.phone || '+254-XXX-XXX-XXX'}</li>
                <li>Email: {contactInfo?.email || 'info@dohanmedicare.com'}</li>
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
    </div>
  )
}

export default App

