import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

const AppointmentAdmin = () => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const statusOptions = [
    { value: 'all', label: 'All Appointments', color: 'gray' },
    { value: 'PENDING', label: 'Pending', color: 'yellow' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'blue' },
    { value: 'COMPLETED', label: 'Completed', color: 'green' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
    { value: 'NO_SHOW', label: 'No Show', color: 'gray' }
  ]

  useEffect(() => {
    loadAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, searchTerm, statusFilter, dateFilter])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      // In production, this would fetch from Hygraph
      // For now, using mock data
      const mockAppointments = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          phone: '0712345678',
          dateOfBirth: '1990-05-15',
          appointmentType: 'General Consultation',
          preferredDate: '2025-10-20',
          preferredTime: '10:00',
          doctor: 'Dr. Sarah Johnson',
          reason: 'Regular checkup',
          symptoms: 'Mild headache',
          status: 'PENDING',
          hasInsurance: true,
          insuranceProvider: 'NHIF',
          policyNumber: 'NH123456',
          createdAt: '2025-10-14T08:30:00Z',
          emergencyContact: 'Jane Doe - 0723456789'
        },
        {
          id: '2',
          firstName: 'Mary',
          lastName: 'Smith',
          email: 'mary.smith@email.com',
          phone: '0734567890',
          dateOfBirth: '1985-08-22',
          appointmentType: 'Cardiology',
          preferredDate: '2025-10-21',
          preferredTime: '14:30',
          doctor: 'Dr. Michael Chen',
          reason: 'Chest pain evaluation',
          symptoms: 'Chest discomfort, shortness of breath',
          status: 'CONFIRMED',
          hasInsurance: false,
          createdAt: '2025-10-14T09:15:00Z',
          emergencyContact: 'Robert Smith - 0745678901'
        },
        {
          id: '3',
          firstName: 'Peter',
          lastName: 'Johnson',
          email: 'peter.j@email.com',
          phone: '0756789012',
          dateOfBirth: '1978-12-03',
          appointmentType: 'Laboratory Tests',
          preferredDate: '2025-10-19',
          preferredTime: '08:00',
          doctor: null,
          reason: 'Blood work',
          symptoms: null,
          status: 'COMPLETED',
          hasInsurance: true,
          insuranceProvider: 'AAR',
          policyNumber: 'AAR789012',
          createdAt: '2025-10-13T16:45:00Z',
          emergencyContact: null
        }
      ]
      setAppointments(mockAppointments)
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.phone.includes(searchTerm)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter)
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(apt => apt.preferredDate === dateFilter)
    }

    setFilteredAppointments(filtered)
  }

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // In production, this would update in Hygraph
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        )
      )
      
      // Send status update email to patient
      const appointment = appointments.find(apt => apt.id === appointmentId)
      if (appointment) {
        await sendStatusUpdateEmail(appointment, newStatus)
      }
    } catch (error) {
      console.error('Error updating appointment status:', error)
    }
  }

  const sendStatusUpdateEmail = async (appointment, newStatus) => {
    try {
      await fetch('/api/appointment-status-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointment,
          newStatus
        }),
      })
    } catch (error) {
      console.error('Error sending status update email:', error)
    }
  }

  const getStatusColor = (status) => {
    const statusConfig = statusOptions.find(opt => opt.value === status)
    return statusConfig?.color || 'gray'
  }

  const getStatusBadge = (status) => {
    const colors = {
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800'
    }
    
    const colorClass = colors[getStatusColor(status)]
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  const exportAppointments = () => {
    const csvContent = [
      ['Date', 'Time', 'Patient Name', 'Email', 'Phone', 'Type', 'Doctor', 'Status'],
      ...filteredAppointments.map(apt => [
        apt.preferredDate,
        apt.preferredTime,
        `${apt.firstName} ${apt.lastName}`,
        apt.email,
        apt.phone,
        apt.appointmentType,
        apt.doctor || 'Not assigned',
        apt.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `appointments-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 flex items-center">
            <Calendar className="mr-3 h-10 w-10" />
            Appointment Management
          </h1>
          <p className="text-gray-600 mt-2">Manage patient appointments and schedules</p>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">All Appointments</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>
                      {filteredAppointments.length} of {appointments.length} appointments
                    </CardDescription>
                  </div>
                  <Button onClick={exportAppointments} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('')
                        setStatusFilter('all')
                        setDateFilter('')
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>

                {/* Appointments List */}
                <div className="space-y-4">
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-4 text-gray-500">No appointments found</p>
                    </div>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <h3 className="font-semibold text-blue-900">
                                  {appointment.firstName} {appointment.lastName}
                                </h3>
                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {appointment.email}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {appointment.phone}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-gray-900 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(appointment.preferredDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {appointment.preferredTime}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {appointment.appointmentType}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {appointment.doctor || 'Not assigned'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {appointment.reason}
                                </p>
                              </div>
                              
                              <div>
                                {getStatusBadge(appointment.status)}
                                <p className="text-xs text-gray-500 mt-2">
                                  Booked: {new Date(appointment.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setShowDetails(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {appointment.status === 'PENDING' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              
                              {appointment.status === 'CONFIRMED' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>View appointments in calendar format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-500">Calendar view coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{appointments.length}</div>
                  <p className="text-sm text-gray-600">All time</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">
                    {appointments.filter(apt => apt.status === 'PENDING').length}
                  </div>
                  <p className="text-sm text-gray-600">Awaiting confirmation</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {appointments.filter(apt => 
                      apt.preferredDate === new Date().toISOString().split('T')[0]
                    ).length}
                  </div>
                  <p className="text-sm text-gray-600">Scheduled for today</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Appointment Details Modal */}
        {showDetails && selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Appointment Details</CardTitle>
                    <CardDescription className="text-blue-100">
                      {selectedAppointment.firstName} {selectedAppointment.lastName}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDetails(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Patient Information</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><strong>Name:</strong> {selectedAppointment.firstName} {selectedAppointment.lastName}</p>
                      <p><strong>Email:</strong> {selectedAppointment.email}</p>
                      <p><strong>Phone:</strong> {selectedAppointment.phone}</p>
                      <p><strong>DOB:</strong> {selectedAppointment.dateOfBirth || 'Not provided'}</p>
                      <p><strong>Emergency Contact:</strong> {selectedAppointment.emergencyContact || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">Appointment Details</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><strong>Date:</strong> {new Date(selectedAppointment.preferredDate).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {selectedAppointment.preferredTime}</p>
                      <p><strong>Type:</strong> {selectedAppointment.appointmentType}</p>
                      <p><strong>Doctor:</strong> {selectedAppointment.doctor || 'Not assigned'}</p>
                      <p><strong>Status:</strong> {getStatusBadge(selectedAppointment.status)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Medical Information</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <p><strong>Reason for visit:</strong> {selectedAppointment.reason}</p>
                    {selectedAppointment.symptoms && (
                      <p><strong>Symptoms:</strong> {selectedAppointment.symptoms}</p>
                    )}
                    <p><strong>Previous visit:</strong> {selectedAppointment.previousVisit ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                
                {selectedAppointment.hasInsurance && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Insurance Information</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><strong>Provider:</strong> {selectedAppointment.insuranceProvider}</p>
                      <p><strong>Policy Number:</strong> {selectedAppointment.policyNumber}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2 pt-4 border-t">
                  {selectedAppointment.status === 'PENDING' && (
                    <>
                      <Button
                        onClick={() => {
                          updateAppointmentStatus(selectedAppointment.id, 'CONFIRMED')
                          setShowDetails(false)
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Confirm Appointment
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          updateAppointmentStatus(selectedAppointment.id, 'CANCELLED')
                          setShowDetails(false)
                        }}
                      >
                        Cancel Appointment
                      </Button>
                    </>
                  )}
                  
                  {selectedAppointment.status === 'CONFIRMED' && (
                    <Button
                      onClick={() => {
                        updateAppointmentStatus(selectedAppointment.id, 'COMPLETED')
                        setShowDetails(false)
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Mark as Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentAdmin