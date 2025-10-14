import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Settings, Save, Plus, Trash2, Mail, Clock, Phone, MapPin } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function CMSAdmin() {
  const [services, setServices] = useState([])
  const [workingHours, setWorkingHours] = useState({})
  const [contact, setContact] = useState({})
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load CMS data
      const cmsResponse = await fetch(`${API_BASE_URL}/cms/data`)
      const cmsData = await cmsResponse.json()
      
      setServices(cmsData.services || [])
      setWorkingHours(cmsData.workingHours || {})
      setContact(cmsData.contact || {})
      
      // Load messages
      const messagesResponse = await fetch(`${API_BASE_URL}/messages`)
      const messagesData = await messagesResponse.json()
      setMessages(messagesData || [])
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveWorkingHours = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cms/working-hours`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workingHours)
      })
      if (response.ok) {
        alert('Working hours updated successfully!')
      }
    } catch (error) {
      console.error('Error saving working hours:', error)
      alert('Failed to save working hours')
    }
  }

  const saveContact = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cms/contact`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      })
      if (response.ok) {
        alert('Contact information updated successfully!')
      }
    } catch (error) {
      console.error('Error saving contact:', error)
      alert('Failed to save contact information')
    }
  }

  const saveService = async (service) => {
    try {
      const method = service.id ? 'PUT' : 'POST'
      const url = service.id 
        ? `${API_BASE_URL}/cms/services/${service.id}`
        : `${API_BASE_URL}/cms/services`
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      })
      
      if (response.ok) {
        alert('Service saved successfully!')
        loadData()
        setEditingService(null)
      }
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Failed to save service')
    }
  }

  const deleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/cms/services/${serviceId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        alert('Service deleted successfully!')
        loadData()
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service')
    }
  }

  const markMessageAsRead = async (messageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' })
      })
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Error updating message:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CMS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 flex items-center">
            <Settings className="mr-3 h-10 w-10" />
            Dohani Medicare CMS
          </h1>
          <p className="text-gray-600 mt-2">Manage your clinic information and messages</p>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="hours">Working Hours</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
            <TabsTrigger value="messages">
              Messages
              {messages.filter(m => m.status === 'unread').length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {messages.filter(m => m.status === 'unread').length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Medical Services</CardTitle>
                    <CardDescription>Manage the services offered by your clinic</CardDescription>
                  </div>
                  <Button onClick={() => setEditingService({ name: '', description: '', keywords: [] })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <Card key={service.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-blue-900">{service.name}</h3>
                            <p className="text-gray-600 mt-2">{service.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {service.keywords?.map((keyword, idx) => (
                                <span key={idx} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button variant="outline" size="sm" onClick={() => setEditingService(service)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteService(service.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Edit Service Modal */}
            {editingService && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>{editingService.id ? 'Edit Service' : 'Add New Service'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Service Name</Label>
                      <Input
                        value={editingService.name}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        placeholder="e.g., General Medicine"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={editingService.description}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        placeholder="Describe the service..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Keywords (comma-separated)</Label>
                      <Input
                        value={editingService.keywords?.join(', ') || ''}
                        onChange={(e) => setEditingService({ 
                          ...editingService, 
                          keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                        })}
                        placeholder="e.g., general, medicine, primary care"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setEditingService(null)}>
                        Cancel
                      </Button>
                      <Button onClick={() => saveService(editingService)}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Working Hours Tab */}
          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Working Hours
                </CardTitle>
                <CardDescription>Update your clinic's operating hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Emergency Services</Label>
                  <Input
                    value={workingHours.emergency || ''}
                    onChange={(e) => setWorkingHours({ ...workingHours, emergency: e.target.value })}
                    placeholder="e.g., 24/7 - Open all day"
                  />
                </div>
                <div>
                  <Label>Consultation Hours</Label>
                  <Input
                    value={workingHours.consultation || ''}
                    onChange={(e) => setWorkingHours({ ...workingHours, consultation: e.target.value })}
                    placeholder="e.g., Monday to Saturday: 8:00 AM - 6:00 PM"
                  />
                </div>
                <div>
                  <Label>Pharmacy Hours</Label>
                  <Input
                    value={workingHours.pharmacy || ''}
                    onChange={(e) => setWorkingHours({ ...workingHours, pharmacy: e.target.value })}
                    placeholder="e.g., 24/7 - Open all day"
                  />
                </div>
                <div>
                  <Label>Laboratory Hours</Label>
                  <Input
                    value={workingHours.laboratory || ''}
                    onChange={(e) => setWorkingHours({ ...workingHours, laboratory: e.target.value })}
                    placeholder="e.g., Monday to Saturday: 7:00 AM - 7:00 PM"
                  />
                </div>
                <Button onClick={saveWorkingHours} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Working Hours
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Update your clinic's contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={contact.phone || ''}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="+254-XXX-XXX-XXX"
                  />
                </div>
                <div>
                  <Label>Emergency Phone</Label>
                  <Input
                    value={contact.emergencyPhone || ''}
                    onChange={(e) => setContact({ ...contact, emergencyPhone: e.target.value })}
                    placeholder="+254-XXX-XXX-XXX"
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={contact.email || ''}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="dohanimedicare@gmail.com"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={contact.location || ''}
                    onChange={(e) => setContact({ ...contact, location: e.target.value })}
                    placeholder="Dohani Medicare Hospital"
                  />
                </div>
                <Button onClick={saveContact} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Contact Information
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Messages & Inquiries
                </CardTitle>
                <CardDescription>View and manage messages from patients and chatbot requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No messages yet</p>
                  ) : (
                    messages.map((message) => (
                      <Card key={message.id} className={message.status === 'unread' ? 'border-blue-500 border-2' : ''}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-blue-900">{message.name}</h3>
                                {message.status === 'unread' && (
                                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">New</span>
                                )}
                                {message.source === 'chatbot' && (
                                  <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded">Chatbot</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{message.email}</p>
                              <p className="text-gray-800 mt-3">{message.message}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(message.timestamp).toLocaleString()}
                              </p>
                            </div>
                            {message.status === 'unread' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markMessageAsRead(message.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CMSAdmin

