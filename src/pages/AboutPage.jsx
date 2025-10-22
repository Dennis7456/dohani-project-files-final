import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Heart, Users, Award, Shield, Clock, MapPin } from 'lucide-react'
import { useHomepageData } from '@/hooks/useCMSData'
import { useNavigate } from 'react-router-dom'

function AboutPage() {
  const { contactInfo } = useHomepageData()
  const navigate = useNavigate()

  const values = [
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'We treat every patient with empathy, respect, and dignity, ensuring they feel valued and cared for throughout their healthcare journey.'
    },
    {
      icon: Award,
      title: 'Excellence in Medicine',
      description: 'Our commitment to medical excellence drives us to continuously improve our services, adopt latest technologies, and maintain the highest standards of care.'
    },
    {
      icon: Users,
      title: 'Patient-Centered Approach',
      description: 'We put our patients at the center of everything we do, tailoring our services to meet individual needs and preferences.'
    },
    {
      icon: Shield,
      title: 'Safety & Quality',
      description: 'Patient safety is our top priority. We maintain rigorous quality standards and follow best practices to ensure optimal outcomes.'
    }
  ]

  const stats = [
    { label: 'Years of Service', value: '5+' },
    { label: 'Medical Professionals', value: '20+' },
    { label: 'Patients Served', value: '10,000+' },
    { label: 'Success Rate', value: '98%' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About Dohani Medicare</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Dedicated to providing exceptional healthcare services to the Mombasa community and beyond. 
            Our mission is to deliver compassionate, quality medical care that improves lives and builds healthier communities.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-blue-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded with a vision to transform healthcare delivery in Mombasa, Dohani Medicare Hospital 
                  has been serving the community with dedication and excellence. Our journey began with a simple 
                  yet powerful mission: to provide accessible, quality healthcare to everyone who walks through our doors.
                </p>
                <p>
                  Over the years, we have grown from a small clinic to a comprehensive healthcare facility, 
                  expanding our services and expertise to meet the evolving needs of our community. Our team 
                  of skilled medical professionals is committed to delivering personalized care that addresses 
                  not just symptoms, but the whole person.
                </p>
                <p>
                  Today, we stand as a trusted healthcare partner, known for our innovative approach, 
                  state-of-the-art facilities, and unwavering commitment to patient satisfaction. We continue 
                  to invest in advanced medical technologies and ongoing staff training to ensure we provide 
                  the best possible care.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-6">
                To provide comprehensive, compassionate healthcare services that improve the quality of life 
                for our patients and strengthen our community's overall health and wellbeing.
              </p>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading healthcare provider in the region, recognized for excellence in patient care, 
                medical innovation, and community health improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These fundamental principles guide everything we do and shape the culture of care at Dohani Medicare.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-blue-900">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Visit Us</h2>
            <p className="text-xl text-gray-600">
              We're conveniently located in Mombasa and easily accessible to serve you better.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-900 flex items-center">
                  <MapPin className="h-6 w-6 mr-2" />
                  Location & Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                  <p className="text-gray-600">{contactInfo?.location || 'Mombasa, Kenya'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Operating Hours</h4>
                  <div className="space-y-1 text-gray-600">
                    <p><span className="font-medium">Emergency Services:</span> 24/7</p>
                    <p><span className="font-medium">Consultations:</span> Monday - Saturday, 8:00 AM - 6:00 PM</p>
                    <p><span className="font-medium">Pharmacy:</span> 24/7</p>
                    <p><span className="font-medium">Laboratory:</span> Monday - Saturday, 7:00 AM - 7:00 PM</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-1 text-gray-600">
                    <p><span className="font-medium">Phone:</span> {contactInfo?.phone || 'Loading...'}</p>
                    <p><span className="font-medium">Emergency:</span> {contactInfo?.emergencyPhone || contactInfo?.phone || 'Loading...'}</p>
                    <p><span className="font-medium">Email:</span> {contactInfo?.email || 'Loading...'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="bg-gray-200 rounded-2xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">Interactive Map</p>
                <p className="text-sm">Map integration coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Quality Healthcare?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied patients who trust Dohani Medicare for their healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/#contact')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Appointment
            </button>
            <button 
              onClick={() => navigate('/#contact')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage