// Full CMS integration with your implemented Hygraph schema
import { useQuery } from '@apollo/client'
import {
  Stethoscope,
  Heart,
  Baby,
  Activity,
  Pill,
  Users,
  Microscope,
  Truck,
  Shield,
  Clock
} from 'lucide-react'
import {
  GET_HOMEPAGE_DATA,
  GET_ALL_SERVICES,
  GET_MEDICAL_SERVICE,
  GET_CONTACT_INFO,
  GET_WORKING_HOURS,
  GET_DOCTORS,
  GET_DOCTOR,
  GET_NEWS_ARTICLES,
  GET_ALL_MESSAGES,
  GET_ALL_APPOINTMENTS
} from '@/graphql/queries.js'

// Helper function to format service names to display titles
function formatServiceTitle(serviceName) {
  const titleMap = {
    'cardiology': 'Cardiology',
    'pharmacy': 'Pharmacy Services',
    'pediatrics': 'Pediatrics',
    'laboratory-services': 'Laboratory Services',
    'general-medicine': 'General Medicine'
  }
  return titleMap[serviceName] || serviceName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Helper function to get service icons
function getServiceIcon(serviceName) {
  const iconMap = {
    'cardiology': Heart,
    'pharmacy': Pill,
    'pediatrics': Baby,
    'laboratory-services': Microscope,
    'general-medicine': Stethoscope,
    // Legacy mappings for backward compatibility
    'General Medicine': Stethoscope,
    'Cardiology': Heart,
    'Pediatrics': Baby,
    'Laboratory Services': Activity,
    'Pharmacy': Pill,
    'Consultation Clinics': Users,
    'Emergency Services': Truck,
    'Radiology': Microscope,
    'Surgery': Shield,
    'Outpatient Services': Clock,
  }
  
  return iconMap[serviceName] || Stethoscope
}

// Homepage data from your implemented schema
export const useHomepageData = () => {
  const { loading, error, data, refetch } = useQuery(GET_HOMEPAGE_DATA, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  // Debug logging
  // console.log('Homepage Data Debug:', {
  //   loading,
  //   error: error?.message,
  //   data,
  //   medicalServices: data?.medicalServices,
  //   medicalServicesCount: data?.medicalServices?.length,
  //   endpoint: import.meta.env.VITE_HYGRAPH_ENDPOINT,
  //   hasToken: !!import.meta.env.VITE_HYGRAPH_TOKEN,
  //   cmsServicesLength: data?.medicalServices?.map(service => ({
  //     id: service.id,
  //     name: service.name,
  //     title: formatServiceTitle(service.name),
  //     description: service.description?.text || service.description || '',
  //     keywords: service.keywords || [],
  //     icon: getServiceIcon(service.name),
  //     featured: service.featured || false,
  //     servicesOffered: service.servicesOffered || [],
  //     commonProcedures: service.commonProcedures
  //   }))?.length || 0
  // })
  
  if (error) {
    console.error('GraphQL Error Details:', error)
  }

  // Temporary fallback services for debugging
  const fallbackServices = !loading && (!data?.medicalServices || data.medicalServices.length === 0) ? [
    {
      id: 'temp-1',
      name: 'cardiology',
      title: 'Cardiology',
      description: 'Heart and cardiovascular care services',
      keywords: ['heart', 'cardiology'],
      icon: getServiceIcon('cardiology'),
      featured: true,
      servicesOffered: ['ECG Testing', 'Heart Monitoring'],
      commonProcedures: null
    },
    {
      id: 'temp-2', 
      name: 'general-medicine',
      title: 'General Medicine',
      description: 'Primary healthcare and family medicine',
      keywords: ['general', 'medicine'],
      icon: getServiceIcon('general-medicine'),
      featured: true,
      servicesOffered: ['Health Check-ups', 'Medical Consultations'],
      commonProcedures: null
    }
  ] : []

  const cmsServices = data?.medicalServices?.map(service => ({
    id: service.id,
    name: service.name,
    title: formatServiceTitle(service.name),
    description: service.description?.text || service.description || '',
    keywords: service.keywords || [],
    icon: getServiceIcon(service.name),
    featured: service.featured || false,
    servicesOffered: service.servicesOffered || [],
    commonProcedures: service.commonProcedures
  })) || []

  return {
    loading,
    error,
    services: cmsServices.length > 0 ? cmsServices : fallbackServices,
    contactInfo: data?.contactInfos?.[0] || null,
    workingHours: data?.workingHours?.[0] || null,
    newsArticles: data?.newsArticles?.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage,
      author: article.author,
      publishedAt: article.publishedAt,
      featured: article.featured
    })) || [],
    doctors: data?.doctors?.map(doctor => ({
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      available: doctor.available
    })) || [],
    refetch
  }
}

// All services from your MedicalService schema
export const useServices = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_SERVICES, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  // Debug logging
  // console.log('All Services Debug:', {
  //   loading,
  //   error,
  //   data,
  //   medicalServices: data?.medicalServices,
  //   medicalServicesCount: data?.medicalServices?.length
  // })

  return {
    loading,
    error,
    services: data?.medicalServices?.map(service => ({
      id: service.id,
      name: service.name,
      title: formatServiceTitle(service.name),
      description: service.description?.text || service.description || '',
      keywords: service.keywords || [],
      icon: getServiceIcon(service.name),
      featured: service.featured || false,
      servicesOffered: service.servicesOffered || [],
      commonProcedures: service.commonProcedures
    })) || [],
    refetch
  }
}

// Single medical service
export const useMedicalService = (id, name) => {
  const { loading, error, data, refetch } = useQuery(GET_MEDICAL_SERVICE, {
    variables: { id, name },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !id && !name
  })

  const service = data?.medicalService

  return {
    loading,
    error,
    service: service ? {
      id: service.id,
      name: service.name,
      title: formatServiceTitle(service.name),
      description: service.description?.text || service.description || '',
      keywords: service.keywords || [],
      icon: getServiceIcon(service.name),
      featured: service.featured || false,
      servicesOffered: service.servicesOffered || [],
      commonProcedures: service.commonProcedures,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    } : null,
    refetch
  }
}

// Contact info from your ContactInfo schema
export const useContactInfo = () => {
  const { loading, error, data, refetch } = useQuery(GET_CONTACT_INFO, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  return {
    loading,
    error,
    contactInfo: data?.contactInfos?.[0] || null,
    refetch
  }
}

// Working hours from your WorkingHours schema
export const useWorkingHours = () => {
  const { loading, error, data, refetch } = useQuery(GET_WORKING_HOURS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  return {
    loading,
    error,
    workingHours: data?.workingHours?.[0] || null,
    refetch
  }
}

// Doctors from your Doctor schema
export const useDoctors = () => {
  const { loading, error, data, refetch } = useQuery(GET_DOCTORS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  return {
    loading,
    error,
    doctors: data?.doctors?.map(doctor => ({
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      qualifications: doctor.qualifications || [],
      bio: doctor.bio?.text || doctor.bio || '',
      photo: doctor.photo,
      consultationHours: doctor.consultationHours,
      available: doctor.available
    })) || [],
    refetch
  }
}

// Single doctor from your Doctor schema
export const useDoctor = (id) => {
  const { loading, error, data, refetch } = useQuery(GET_DOCTOR, {
    variables: { id },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !id
  })

  const doctor = data?.doctor

  return {
    loading,
    error,
    doctor: doctor ? {
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      qualifications: doctor.qualifications || [],
      bio: doctor.bio?.text || doctor.bio || '',
      photo: doctor.photo,
      consultationHours: doctor.consultationHours,
      available: doctor.available,
      experience: doctor.experience,
      languages: doctor.languages || [],
      consultationFee: doctor.consultationFee
    } : null,
    refetch
  }
}

// News articles from your NewsArticle schema
export const useNewsArticles = (limit = 10) => {
  const { loading, error, data, refetch } = useQuery(GET_NEWS_ARTICLES, {
    variables: { limit },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  return {
    loading,
    error,
    articles: data?.newsArticles?.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content?.text || article.content || '',
      featuredImage: article.featuredImage,
      author: article.author,
      featured: article.featured,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt
    })) || [],
    refetch
  }
}

// Messages from your Message schema
export const useMessages = (messageStatus = null) => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_MESSAGES, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  const filteredMessages = messageStatus 
    ? data?.messages?.filter(msg => msg.messageStatus === messageStatus) || []
    : data?.messages || []

  return {
    loading,
    error,
    messages: filteredMessages.map(message => ({
      id: message.id,
      name: message.name,
      email: message.email,
      message: message.message?.text || message.message || '',
      status: message.messageStatus,
      source: message.messageSource,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    })),
    refetch
  }
}

// Appointments from your Appointment schema
export const useAppointments = (status = null) => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_APPOINTMENTS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  const filteredAppointments = status 
    ? data?.appointments?.filter(apt => apt.status === status) || []
    : data?.appointments || []

  return {
    loading,
    error,
    appointments: filteredAppointments,
    refetch
  }
}