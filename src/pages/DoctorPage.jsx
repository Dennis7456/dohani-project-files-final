import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Calendar, Phone, Mail, MapPin, Clock, Award, GraduationCap, Stethoscope, Star } from 'lucide-react'
import { useDoctors } from '@/hooks/useCMSData'
import { PageLoading } from '@/components/LoadingSpinner'
import AppointmentBooking from '@/components/AppointmentBooking'

function DoctorPage() {
  const { id } = useParams()
  const { doctors, loading } = useDoctors()
  
  // Appointment booking state
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false)
  
  // Find the doctor by ID or slug
  const doctor = doctors?.find(d => 
    d.id === id || 
    d.name?.toLowerCase().replace(/\s+/g, '-') === id ||
    d.slug === id
  )

  // Fallback doctor data for development
  const fallbackDoctors = {
    'dr-sarah-mwangi': {
      name: 'Dr. Sarah Mwangi',
      title: 'General Practitioner & Family Medicine',
      specialization: 'General Medicine',
      image: '/api/placeholder/400/400',
      experience: '8 years',
      education: [
        'MBChB - University of Nairobi (2015)',
        'Diploma in Family Medicine - Kenya Medical Training College (2017)',
        'Certificate in Tropical Medicine - London School of Hygiene (2019)'
      ],
      certifications: [
        'Kenya Medical Practitioners Board License',
        'Basic Life Support (BLS) Certified',
        'Advanced Cardiac Life Support (ACLS) Certified',
        'Certified in Diabetes Management'
      ],
      bio: `Dr. Sarah Mwangi is a dedicated General Practitioner with over 8 years of experience in providing comprehensive primary healthcare services. She completed her medical degree at the University of Nairobi and has since specialized in family medicine, with particular expertise in preventive care, chronic disease management, and women's health.

Dr. Mwangi is passionate about building long-term relationships with her patients and believes in a holistic approach to healthcare that addresses not just physical symptoms but also the emotional and social factors that affect health. She is fluent in English, Swahili, and Kikuyu, allowing her to connect with patients from diverse backgrounds.

Her areas of special interest include diabetes management, hypertension care, women's reproductive health, and preventive medicine. She regularly attends medical conferences and continuing education programs to stay current with the latest medical advances and best practices.`,
      specialties: [
        'Preventive Medicine & Health Screenings',
        'Chronic Disease Management (Diabetes, Hypertension)',
        'Women\'s Health & Reproductive Care',
        'Family Planning & Contraceptive Counseling',
        'Acute Illness Diagnosis & Treatment',
        'Health Education & Lifestyle Counseling',
        'Vaccination & Immunization Services',
        'Minor Surgical Procedures'
      ],
      languages: ['English', 'Swahili', 'Kikuyu'],
      workingHours: 'Monday to Friday: 8:00 AM - 5:00 PM, Saturday: 8:00 AM - 1:00 PM',
      consultationFee: 'KSh 2,500',
      rating: 4.8,
      reviews: 156
    },
    'dr-james-ochieng': {
      name: 'Dr. James Ochieng',
      title: 'Consultant Physician & Diabetologist',
      specialization: 'Internal Medicine',
      image: '/api/placeholder/400/400',
      experience: '12 years',
      education: [
        'MBChB - Moi University (2011)',
        'MMed Internal Medicine - University of Nairobi (2016)',
        'Fellowship in Endocrinology - Aga Khan University (2018)'
      ],
      certifications: [
        'Kenya Medical Practitioners Board License',
        'East African College of Physicians Fellowship',
        'Certified Diabetes Educator (CDE)',
        'Advanced Life Support Provider'
      ],
      bio: `Dr. James Ochieng is a highly experienced Consultant Physician specializing in Internal Medicine with a subspecialty in Endocrinology and Diabetes Management. With over 12 years of clinical experience, he has established himself as a leading expert in the diagnosis and treatment of diabetes, thyroid disorders, and other endocrine conditions.

Dr. Ochieng completed his medical degree at Moi University and pursued advanced training in Internal Medicine at the University of Nairobi. He further specialized in Endocrinology through a fellowship at Aga Khan University, where he gained extensive experience in managing complex hormonal disorders.

He is particularly passionate about diabetes care and has helped hundreds of patients achieve better glucose control and improved quality of life. Dr. Ochieng believes in patient education and empowerment, working closely with individuals to develop personalized treatment plans that fit their lifestyle and goals.`,
      specialties: [
        'Diabetes Management & Education',
        'Thyroid Disorders',
        'Hypertension & Cardiovascular Risk Management',
        'Metabolic Syndrome',
        'Obesity Management',
        'Hormonal Disorders',
        'Preventive Cardiology',
        'Chronic Disease Management'
      ],
      languages: ['English', 'Swahili', 'Luo'],
      workingHours: 'Monday to Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM',
      consultationFee: 'KSh 3,500',
      rating: 4.9,
      reviews: 203
    },
    'dr-amina-mohamed': {
      name: 'Dr. Amina Mohamed',
      title: 'Obstetrician & Gynecologist',
      specialization: 'Obstetrics & Gynecology',
      image: '/api/placeholder/400/400',
      experience: '10 years',
      education: [
        'MBChB - University of Nairobi (2013)',
        'MMed Obstetrics & Gynecology - University of Nairobi (2018)',
        'Certificate in Reproductive Health - Johns Hopkins University (2020)'
      ],
      certifications: [
        'Kenya Medical Practitioners Board License',
        'East African College of Obstetricians & Gynecologists Fellowship',
        'Certified in Minimally Invasive Surgery',
        'Advanced Life Support in Obstetrics (ALSO) Provider'
      ],
      bio: `Dr. Amina Mohamed is a compassionate Obstetrician and Gynecologist with 10 years of experience in women's healthcare. She is dedicated to providing comprehensive care for women throughout all stages of life, from adolescence through menopause and beyond.

Dr. Mohamed completed her medical training at the University of Nairobi and specialized in Obstetrics and Gynecology, developing expertise in both routine and high-risk pregnancies. She has a special interest in minimally invasive surgical techniques and has helped many women with various gynecological conditions.

Her approach to patient care is centered on creating a comfortable, supportive environment where women feel heard and respected. She believes in shared decision-making and takes time to educate her patients about their health and treatment options. Dr. Mohamed is fluent in English, Swahili, and Arabic, enabling her to serve a diverse patient population.`,
      specialties: [
        'Prenatal Care & High-Risk Pregnancy Management',
        'Normal & Cesarean Deliveries',
        'Gynecological Examinations & Screenings',
        'Family Planning & Contraceptive Services',
        'Menstrual Disorders & Hormonal Issues',
        'Infertility Evaluation & Treatment',
        'Minimally Invasive Gynecological Surgery',
        'Menopause Management'
      ],
      languages: ['English', 'Swahili', 'Arabic'],
      workingHours: 'Monday to Friday: 8:00 AM - 6:00 PM, Saturday: 8:00 AM - 12:00 PM',
      consultationFee: 'KSh 3,000',
      rating: 4.9,
      reviews: 187
    }
  }

  const currentDoctor = doctor || fallbackDoctors[id] || fallbackDoctors['dr-sarah-mwangi']

  // Show loading state
  if (loading) {
    return <PageLoading message="Loading doctor information..." />
  }

  if (!currentDoctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h1>
          <p className="text-gray-600 mb-8">The doctor profile you're looking for doesn't exist.</p>
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">{currentDoctor.name}</h1>
              <p className="text-2xl text-blue-100 mb-6">{currentDoctor.title}</p>
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(currentDoctor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-2 text-blue-100">
                    {currentDoctor.rating} ({currentDoctor.reviews} reviews)
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setShowAppointmentBooking(true)}
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
                <Button 
                  onClick={() => window.location.href = 'tel:+254798057622'}
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Stethoscope className="h-24 w-24 mx-auto mb-4" />
                  <p className="text-lg font-medium">Dr. {currentDoctor.name.split(' ').pop()}</p>
                  <p className="text-sm">{currentDoctor.specialization}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Details */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-6">About Dr. {currentDoctor.name.split(' ').pop()}</h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                  <p className="whitespace-pre-line">{currentDoctor.bio}</p>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-6">Areas of Expertise</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentDoctor.specialties?.map((specialty, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Stethoscope className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{specialty}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Education & Certifications */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                    <GraduationCap className="h-6 w-6 mr-2" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    {currentDoctor.education?.map((edu, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <p className="font-medium text-gray-900">{edu}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                    <Award className="h-6 w-6 mr-2" />
                    Certifications
                  </h3>
                  <div className="space-y-3">
                    {currentDoctor.certifications?.map((cert, index) => (
                      <div key={index} className="border-l-4 border-green-200 pl-4">
                        <p className="font-medium text-gray-900">{cert}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                    <p className="text-gray-600">{currentDoctor.experience}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Specialization</h4>
                    <p className="text-gray-600">{currentDoctor.specialization}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Languages</h4>
                    <p className="text-gray-600">{currentDoctor.languages?.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Consultation Fee</h4>
                    <p className="text-gray-600">{currentDoctor.consultationFee}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{currentDoctor.workingHours}</p>
                  <Button 
                    onClick={() => setShowAppointmentBooking(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Hospital Phone</h4>
                    <p className="text-gray-600">+254 798 057 622</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                    <p className="text-gray-600">dohanimedicare@gmail.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                    <p className="text-gray-600">Dohani Medicare Hospital, Mombasa</p>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-blue-600" />
                    Patient Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-blue-600">{currentDoctor.rating}</div>
                    <div className="flex justify-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(currentDoctor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">Based on {currentDoctor.reviews} reviews</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="border-l-4 border-blue-200 pl-3">
                      <p className="text-gray-600">"Excellent doctor, very thorough and caring."</p>
                      <p className="text-gray-500 text-xs mt-1">- Patient Review</p>
                    </div>
                    <div className="border-l-4 border-blue-200 pl-3">
                      <p className="text-gray-600">"Professional and knowledgeable. Highly recommended."</p>
                      <p className="text-gray-500 text-xs mt-1">- Patient Review</p>
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
          <h2 className="text-4xl font-bold mb-6">Ready to Schedule Your Appointment?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Book a consultation with Dr. {currentDoctor.name.split(' ').pop()} today and take the first step towards better health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowAppointmentBooking(true)}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Book Appointment Now
            </Button>
            <Button 
              onClick={() => window.location.href = 'tel:+254798057622'}
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Call Hospital
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

export default DoctorPage