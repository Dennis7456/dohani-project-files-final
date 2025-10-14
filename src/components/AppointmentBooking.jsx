import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, User, Phone, Mail, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'

const AppointmentBooking = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    
    // Appointment Details
    appointmentType: '',
    preferredDate: '',
    preferredTime: '',
    doctor: '',
    
    // Additional Information
    reason: '',
    symptoms: '',
    previousVisit: false,
    emergencyContact: '',
    
    // Insurance
    hasInsurance: false,
    insuranceProvider: '',
    policyNumber: ''
  })
  
  const [availableSlots, setAvailableSlots] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null })

  const appointmentTypes = [
    { id: 'general', name: 'General Consultation', duration: '30 min' },
    { id: 'cardiology', name: 'Cardiology', duration: '45 min' },
    { id: 'pediatrics', name: 'Pediatrics', duration: '30 min' },
    { id: 'laboratory', name: 'Laboratory Tests', duration: '15 min' },
    { id: 'pharmacy', name: 'Pharmacy Consultation', duration: '15 min' },
    { id: 'emergency', name: 'Emergency Consultation', duration: '60 min' }
  ]

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ]

  useEffect(() => {
    // Load doctors data (this would come from Hygraph in production)
    setDoctors([
      { id: 1, name: 'Dr. Sarah Johnson', specialty: 'General Medicine', available: true },
      { id: 2, name: 'Dr. Michael Chen', specialty: 'Cardiology', available: true },
      { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Pediatrics', available: true },
      { id: 4, name: 'Dr. James Wilson', specialty: 'Emergency Medicine', available: true }
    ])
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setSubmitStatus({ success: false, error: null })

    try {
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({ success: true, error: null })
        setStep(5) // Success step
      } else {
        setSubmitStatus({ success: false, error: result.error || 'Failed to book appointment' })
      }
    } catch (error) {
      setSubmitStatus({ success: false, error: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
      appointmentType: '', preferredDate: '', preferredTime: '', doctor: '',
      reason: '', symptoms: '', previousVisit: false, emergencyContact: '',
      hasInsurance: false, insuranceProvider: '', policyNumber: ''
    })
    setSubmitStatus({ success: false, error: null })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Book Appointment</CardTitle>
              <CardDescription className="text-blue-100">
                {step < 5 ? `Step ${step} of 4` : 'Confirmation'}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 bg-white">
          {/* Progress Bar */}
          {step < 5 && (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stepNum <= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNum}
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Emergency contact name and phone"
                />
              </div>
            </div>
          )}

          {/* Step 2: Appointment Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Appointment Details
              </h3>

              <div>
                <Label>Appointment Type *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {appointmentTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.appointmentType === type.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleInputChange('appointmentType', type.id)}
                    >
                      <div className="font-medium text-sm">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.duration}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Preferred Doctor</Label>
                <div className="grid gap-2 mt-2">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.doctor === doctor.id.toString()
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleInputChange('doctor', doctor.id.toString())}
                    >
                      <div className="font-medium text-sm">{doctor.name}</div>
                      <div className="text-xs text-gray-500">{doctor.specialty}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferredDate">Preferred Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <Label>Preferred Time *</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2 max-h-32 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`p-2 text-xs border rounded transition-colors ${
                          formData.preferredTime === time
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => handleInputChange('preferredTime', time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Medical Information */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Medical Information
              </h3>

              <div>
                <Label htmlFor="reason">Reason for Visit *</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Please describe the reason for your appointment"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="symptoms">Current Symptoms</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => handleInputChange('symptoms', e.target.value)}
                  placeholder="Please describe any current symptoms (optional)"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="previousVisit"
                  checked={formData.previousVisit}
                  onChange={(e) => handleInputChange('previousVisit', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="previousVisit">I have visited Dohani Medicare before</Label>
              </div>
            </div>
          )}

          {/* Step 4: Insurance Information */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Insurance Information
              </h3>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasInsurance"
                  checked={formData.hasInsurance}
                  onChange={(e) => handleInputChange('hasInsurance', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="hasInsurance">I have health insurance</Label>
              </div>

              {formData.hasInsurance && (
                <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                  <div>
                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                    <Input
                      id="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                      placeholder="Enter your insurance provider name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input
                      id="policyNumber"
                      value={formData.policyNumber}
                      onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                      placeholder="Enter your policy number"
                    />
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Payment Information</h4>
                <p className="text-sm text-blue-700">
                  We accept cash, mobile money (M-Pesa), and major credit cards. 
                  If you have insurance, please bring your insurance card and ID to your appointment.
                </p>
              </div>

              {submitStatus.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-600 text-sm">{submitStatus.error}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-800">Appointment Booked Successfully!</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 mb-2">
                  Your appointment has been scheduled for <strong>{formData.preferredDate}</strong> at <strong>{formData.preferredTime}</strong>.
                </p>
                <p className="text-green-600 text-sm">
                  You will receive a confirmation email shortly with all the details and instructions.
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={resetForm} className="w-full">
                  Book Another Appointment
                </Button>
                <Button variant="outline" onClick={onClose} className="w-full">
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
              >
                Previous
              </Button>
              
              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.dateOfBirth)) ||
                    (step === 2 && (!formData.appointmentType || !formData.preferredDate || !formData.preferredTime)) ||
                    (step === 3 && !formData.reason)
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AppointmentBooking