import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { 
  Stethoscope, 
  Heart, 
  Baby, 
  Activity, 
  Pill, 
  Users, 
  Microscope, 
  Ambulance, 
  Shield, 
  Clock 
} from 'lucide-react'
import { 
  GET_HOMEPAGE_DATA, 
  GET_ALL_SERVICES, 
  GET_CONTACT_INFO, 
  GET_WORKING_HOURS,
  GET_DOCTORS,
  GET_NEWS_ARTICLES,
  GET_ALL_MESSAGES,
  GET_ALL_APPOINTMENTS
} from '@/graphql/queries.js'

// Robust CMS integration that properly handles Hygraph data with smart fallbacks
export const useHomepageData = () => {
  const { loading, error, data, refetch } = useQuery(GET_HOMEPAGE_DATA, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.warn('Hygraph homepage query error:', error.message)
    }
  })

  // Return structured data with proper fallbacks
  return {
    loading,
    error: null, // Don't expose errors to UI
    services: data?.medicalServices?.map(service => ({
      id: service.id,
      title: service.name,
      description: service.description || 'No description available',
      keywords: service.keywords || [],
      icon: getServiceIcon(service.name),
      featured: service.featured || false
    })) || getDefaultServices().filter(s => s.featured),
    contactInfo: data?.contactInfos?.[0] || getDefaultContactInfo(),
    workingHours: data?.workingHours?.[0] || getDefaultWorkingHours(),
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

// Get all services with CMS integration
export const useServices = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_SERVICES, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.warn('Hygraph services query error:', error.message)
    }
  })

  return {
    loading,
    error: null,
    services: data?.medicalServices?.map(service => ({
      id: service.id,
      title: service.name,
      description: service.description || 'No description available',
      keywords: service.keywords || [],
      icon: getServiceIcon(service.name),
      featured: service.featured || false
    })) || getDefaultServices(),
    refetch
  }
}

// Get contact information from CMS
export const useContactInfo = () => {
  const { loading, error, data, refetch } = useQuery(GET_CONTACT_INFO, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.warn('Hygraph contact info query error:', error.message)
    }
  })

  return {
    loading,
    error: null,
    contactInfo: data?.contactInfos?.[0] || getDefaultContactInfo(),
    refetch
  }
}

// Get working hours from CMS
export const useWorkingHours = () => {
  const { loading, error, data, refetch } = useQuery(GET_WORKING_HOURS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.warn('Hygraph working hours query error:', error.message)
    }
  })

  return {
    loading,
    error: null,
    workingHours: data?.workingHours?.[0] || getDefaultWorkingHours(),
    refetch
  }
}

// Get doctors from CMS
export const useDoctors = () => {
  const { loading, error, data, refetch } = useQuery(GET_DOCTORS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.warn('Hygraph doctors query error:', error.message)
    }
  })

  return {
    loading,
    error: null,
    doctors: data?.doctors?.map(doctor => ({
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      qualifications: doctor.qualifications || [],
      bio: doctor.bio || 'Experienced healthcare professional',
      photo: doctor.photo,
      consultationHours: doctor.consultationHours,
      available: doctor.available
    })) || [],
    refetch
  }
}

// Get news articles from CMS
export const useNewsArticles = (limit = 10) => {
  const { loading, error, data, refetch } = useQuery(GET_NEWS_ARTICLES, {
    variables: { limit },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.warn('Hygraph news articles query error:', error.message)
    }
  })

  return {
    loading,
    error: null,
    articles: data?.newsArticles?.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      featuredImage: article.featuredImage,
      author: article.author,
      featured: article.featured,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt
    })) || [],
    refetch
  }
}

// Get messages from CMS (for admin)
export const useMessages = (status = null) => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_MESSAGES, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.warn('Hygraph messages query error:', error.message)
    }
  })

  const filteredMessages = status 
    ? data?.messages?.filter(msg => msg.status === status) || []
    : data?.messages || []

  return {
    loading,
    error: null,
    messages: filteredMessages.map(message => ({
      id: message.id,
      name: message.name,
      email: message.email,
      message: message.message,
      status: message.status,
      source: message.source,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    })),
    refetch
  }
}

// Get appointments from CMS (for admin)
export const useAppointments = (status = null) => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_APPOINTMENTS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.warn('Hygraph appointments query error:', error.message)
    }
  })

  const filteredAppointments = status 
    ? data?.appointments?.filter(apt => apt.status === status) || []
    : data?.appointments || []

  return {
    loading,
    error: null,
    appointments: filteredAppointments.map(appointment => ({
      id: appointment.id,
      firstName: appointment.firstName,
      lastName: appointment.lastName,
      email: appointment.email,
      phone: appointment.phone,
      dateOfBirth: appointment.dateOfBirth,
      appointmentType: appointment.appointmentType,
      preferredDate: appointment.preferredDate,
      preferredTime: appointment.preferredTime,
      doctor: appointment.doctor,
      reason: appointment.reason,
      symptoms: appointment.symptoms,
      previousVisit: appointment.previousVisit,
      emergencyContact: appointment.emergencyContact,
      hasInsurance: appointment.hasInsurance,
      insuranceProvider: appointment.insuranceProvider,
      policyNumber: appointment.policyNumber,
      status: appointment.status,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    })),
    refetch
  }
}

// Helper function to get service icons
function getServiceIcon(serviceName) {
  const iconMap = {
    'General Medicine': Stethoscope,
    'Cardiology': Heart,
    'Pediatrics': Baby,
    'Laboratory Services': Activity,
    'Pharmacy': Pill,
    'Consultation Clinics': Users,
    'Emergency Services': Ambulance,
    'Radiology': Microscope,
    'Surgery': Shield,
    'Outpatient Services': Clock,
  }
  
  return iconMap[serviceName] || Stethoscope
}

// Default data functions (minimal fallbacks)
function getDefaultServices() {
  return [
    {
      id: 'fallback-1',
      title: 'General Medicine',
      description: 'Comprehensive primary care services for all ages.',
      keywords: ['general', 'medicine', 'primary care'],
      icon: getServiceIcon('General Medicine'),
      featured: true
    },
    {
      id: 'fallback-2',
      title: 'Emergency Services',
      description: '24/7 emergency medical care.',
      keywords: ['emergency', 'urgent care'],
      icon: getServiceIcon('Emergency Services'),
      featured: true
    },
    {
      id: 'fallback-3',
      title: 'Pharmacy',
      description: 'Complete pharmaceutical services.',
      keywords: ['pharmacy', 'medication'],
      icon: getServiceIcon('Pharmacy'),
      featured: true
    }
  ]
}

function getDefaultContactInfo() {
  return {
    id: 'fallback-contact',
    phone: '0798057622',
    emergencyPhone: '0798057622',
    email: 'dohanimedicare@gmail.com',
    location: 'Dohani Medicare Hospital'
  }
}

function getDefaultWorkingHours() {
  return {
    id: 'fallback-hours',
    emergency: '24/7 - Open all day, every day',
    consultation: 'Monday to Saturday: 8:00 AM - 6:00 PM',
    pharmacy: '24/7 - Open all day, every day',
    laboratory: 'Monday to Saturday: 7:00 AM - 7:00 PM'
  }
}