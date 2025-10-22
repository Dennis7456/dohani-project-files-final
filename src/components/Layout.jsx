import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Menu, X, Phone, Mail, MapPin, Clock, Home as HomeIcon, Info, Contact, Newspaper, Stethoscope, Users, ArrowLeft } from 'lucide-react'
import { useHomepageData } from '@/hooks/useCMSData'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import ChatBot from '@/components/ChatBot'
// import ScrollPositionDebug from '@/components/ScrollPositionDebug'
import logo from '@/assets/official_dohani_logo.jpg'

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  
  // Get CMS data
  const { contactInfo, workingHours } = useHomepageData()
  
  // Initialize scroll position management
  useScrollPosition()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'About Us', href: '/about', icon: Info },
    { name: 'Services', href: '/#services', icon: Stethoscope },
    { name: 'Doctors', href: '/#doctors', icon: Users },
    { name: 'Contact', href: '/#contact', icon: Contact },
    { name: 'News', href: '/#news', icon: Newspaper },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-2"
                title="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Link to="/" className="flex items-center space-x-3">
                <img src={logo} alt="Dohani Medicare" className="h-12 w-auto" />
                <div>
                  <span className="text-xl font-bold text-blue-900">Dohani Medicare</span>
                  <p className="text-sm text-gray-600">Quality Healthcare for All</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <Button 
                onClick={() => navigate('/#contact')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
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

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                <Button 
                  onClick={() => {
                    navigate('/#contact')
                    setMobileMenuOpen(false)
                  }}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src={logo} alt="Dohani Medicare" className="h-10 w-auto" />
                <span className="text-xl font-bold">Dohani Medicare</span>
              </div>
              <p className="text-blue-100 mb-4">
                Providing quality healthcare services with compassion and excellence.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{contactInfo?.phone || 'Loading...'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{contactInfo?.email || 'Loading...'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{contactInfo?.location || 'Loading...'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
              <div className="space-y-2 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Emergency: 24/7</p>
                    <p className="text-sm">Consultation: Mon-Sat 8AM-6PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-blue-100 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-100">
            <p>&copy; 2024 Dohani Medicare Hospital. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI ChatBot Component */}
      <ChatBot />

      {/* Debug component for development - commented out for production */}
      {/* <ScrollPositionDebug /> */}
    </div>
  )
}

export default Layout