import { useState } from 'react'
import { useMessages, useAppointments, useDoctors, useServices, useNewsArticles } from '@/hooks/useCMSData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Stethoscope, 
  Newspaper,
  Clock,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

const CMSAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Get all CMS data
  const { messages, refetch: refetchMessages } = useMessages()
  const { appointments, refetch: refetchAppointments } = useAppointments()
  const { doctors } = useDoctors()
  const { services } = useServices()
  const { articles } = useNewsArticles()

  // Calculate statistics
  const stats = {
    totalMessages: messages?.length || 0,
    unreadMessages: messages?.filter(m => m.status === 'UNREAD')?.length || 0,
    totalAppointments: appointments?.length || 0,
    pendingAppointments: appointments?.filter(a => a.status === 'PENDING')?.length || 0,
    totalDoctors: doctors?.length || 0,
    availableDoctors: doctors?.filter(d => d.available)?.length || 0,
    totalServices: services?.length || 0,
    featuredServices: services?.filter(s => s.featured)?.length || 0,
    totalArticles: articles?.length || 0,
    publishedArticles: articles?.filter(a => a.publishedAt)?.length || 0
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'UNREAD': { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      'READ': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      'REPLIED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'CONFIRMED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'COMPLETED': { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      'CANCELLED': { color: 'bg-red-100 text-red-800', icon: XCircle }
    }
    
    const config = statusConfig[status] || statusConfig['PENDING']
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'services', label: 'Services', icon: Stethoscope },
    { id: 'news', label: 'News', icon: Newspaper }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dohani Medicare CMS Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage all your healthcare content and data</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMessages}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.unreadMessages} unread
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingAppointments} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doctors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDoctors}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.availableDoctors} available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalServices}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.featuredServices} featured
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Messages</h2>
              <Button onClick={refetchMessages}>Refresh</Button>
            </div>
            <div className="grid gap-4">
              {messages && messages.length > 0 ? (
                messages.map((message) => (
                  <Card key={message.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{message.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {message.email}
                            <span>•</span>
                            <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {getStatusBadge(message.status)}
                          <Badge variant="outline">{message.source}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{message.message}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No messages found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Appointments</h2>
              <Button onClick={refetchAppointments}>Refresh</Button>
            </div>
            <div className="grid gap-4">
              {appointments && appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {appointment.firstName} {appointment.lastName}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {appointment.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {appointment.phone}
                            </span>
                          </CardDescription>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p><strong>Type:</strong> {appointment.appointmentType}</p>
                          <p><strong>Date:</strong> {new Date(appointment.preferredDate).toLocaleDateString()}</p>
                          <p><strong>Time:</strong> {appointment.preferredTime}</p>
                          {appointment.doctor && <p><strong>Doctor:</strong> {appointment.doctor}</p>}
                        </div>
                        <div>
                          <p><strong>Reason:</strong> {appointment.reason}</p>
                          {appointment.symptoms && <p><strong>Symptoms:</strong> {appointment.symptoms}</p>}
                          <p><strong>Previous Visit:</strong> {appointment.previousVisit ? 'Yes' : 'No'}</p>
                          <p><strong>Insurance:</strong> {appointment.hasInsurance ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Doctors</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors && doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <Card key={doctor.id}>
                    <CardHeader className="text-center">
                      {doctor.photo ? (
                        <img 
                          src={doctor.photo.url} 
                          alt={doctor.name}
                          className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                        />
                      ) : (
                        <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                          <Users className="h-12 w-12 text-blue-600" />
                        </div>
                      )}
                      <CardTitle>{doctor.name}</CardTitle>
                      <CardDescription>{doctor.specialty}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {doctor.qualifications && doctor.qualifications.length > 0 && (
                        <div className="mb-3">
                          <p className="font-semibold text-sm">Qualifications:</p>
                          <p className="text-sm text-gray-600">{doctor.qualifications.join(', ')}</p>
                        </div>
                      )}
                      {doctor.consultationHours && (
                        <div className="mb-3">
                          <p className="font-semibold text-sm">Hours:</p>
                          <p className="text-sm text-gray-600">{doctor.consultationHours}</p>
                        </div>
                      )}
                      <Badge className={doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {doctor.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No doctors found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Medical Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {services && services.length > 0 ? (
                services.map((service) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <service.icon className="h-5 w-5 text-blue-600" />
                            {service.title}
                          </CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </div>
                        <Badge className={service.featured ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                          {service.featured ? 'Featured' : 'Standard'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {service.keywords && service.keywords.length > 0 && (
                        <div>
                          <p className="font-semibold text-sm mb-2">Keywords:</p>
                          <div className="flex flex-wrap gap-1">
                            {service.keywords.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="text-center py-8">
                    <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No services found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">News Articles</h2>
            <div className="grid gap-6">
              {articles && articles.length > 0 ? (
                articles.map((article) => (
                  <Card key={article.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{article.title}</CardTitle>
                          <CardDescription>
                            {article.author && `By ${article.author} • `}
                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={article.featured ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                            {article.featured ? 'Featured' : 'Standard'}
                          </Badge>
                          <Badge className={article.publishedAt ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {article.publishedAt ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {article.featuredImage && (
                        <img 
                          src={article.featuredImage.url} 
                          alt={article.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <p className="text-gray-600">{article.excerpt}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No articles found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CMSAdminDashboard