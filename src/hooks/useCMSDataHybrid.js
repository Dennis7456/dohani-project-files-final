import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_HOMEPAGE_DATA, GET_ALL_SERVICES, GET_CONTACT_INFO, GET_WORKING_HOURS } from '@/graphql/queries.js'
import { fallbackData } from './useCMSDataSimple.js'

// Hybrid hook that tries Hygraph first, then falls back to static data
export const useHomepageData = () => {
  const [finalData, setFinalData] = useState({
    loading: true,
    error: null,
    services: fallbackData.services.filter(s => s.featured),
    contactInfo: fallbackData.contactInfo,
    workingHours: fallbackData.workingHours,
    newsArticles: []
  })

  const { loading, error, data } = useQuery(GET_HOMEPAGE_DATA, {
    variables: {
      now: new Date().toISOString()
    },
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true
  })

  useEffect(() => {
    if (loading) {
      setFinalData(prev => ({ ...prev, loading: true }))
      return
    }

    if (error || !data) {
      // Use fallback data but don't show loading
      // console.warn('Using fallback data for homepage:', error?.message || 'No data received')
      setFinalData({
        loading: false,
        error: null,
        services: fallbackData.services.filter(s => s.featured),
        contactInfo: fallbackData.contactInfo,
        workingHours: fallbackData.workingHours,
        newsArticles: []
      })
      return
    }

    // Successfully got data from Hygraph
    // console.log('✅ Successfully loaded data from Hygraph CMS')
    setFinalData({
      loading: false,
      error: null,
      services: data?.medicalServices?.map(service => ({
        id: service.id,
        title: service.name,
        description: service.description?.text || service.description || 'No description available',
        icon: getServiceIcon(service.name),
        featured: service.featured || false
      })) || fallbackData.services.filter(s => s.featured),
      contactInfo: data?.contactInfos?.[0] || fallbackData.contactInfo,
      workingHours: data?.workingHours?.[0] || fallbackData.workingHours,
      newsArticles: data?.newsArticles?.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content?.text || article.content || '',
        featuredImage: article.featuredImage,
        author: article.author,
        featured: article.featured,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt
      })) || []
    })
  }, [loading, error, data])

  return finalData
}

// Hook for all services with Hygraph integration
export const useServices = () => {
  const [finalData, setFinalData] = useState({
    loading: true,
    error: null,
    services: fallbackData.services
  })

  const { loading, error, data } = useQuery(GET_ALL_SERVICES, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  })

  useEffect(() => {
    if (loading) {
      setFinalData(prev => ({ ...prev, loading: true }))
      return
    }

    if (error || !data) {
      // console.warn('Using fallback data for services:', error?.message || 'No data received')
      setFinalData({
        loading: false,
        error: null,
        services: fallbackData.services
      })
      return
    }

    // Successfully got services from Hygraph
    // console.log('✅ Successfully loaded services from Hygraph CMS:', data.medicalServices?.length || 0, 'services')
    setFinalData({
      loading: false,
      error: null,
      services: data?.medicalServices?.map(service => ({
        id: service.id,
        title: service.name,
        description: service.description?.text || service.description || 'No description available',
        icon: getServiceIcon(service.name),
        featured: service.featured || false
      })) || fallbackData.services
    })
  }, [loading, error, data])

  return finalData
}

// Hook for contact information
export const useContactInfo = () => {
  const [finalData, setFinalData] = useState({
    loading: true,
    error: null,
    contactInfo: fallbackData.contactInfo
  })

  const { loading, error, data } = useQuery(GET_CONTACT_INFO, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  })

  useEffect(() => {
    if (loading) {
      setFinalData(prev => ({ ...prev, loading: true }))
      return
    }

    if (error || !data) {
      // console.warn('Using fallback data for contact info:', error?.message || 'No data received')
      setFinalData({
        loading: false,
        error: null,
        contactInfo: fallbackData.contactInfo
      })
      return
    }

    setFinalData({
      loading: false,
      error: null,
      contactInfo: data?.contactInfos?.[0] || fallbackData.contactInfo
    })
  }, [loading, error, data])

  return finalData
}

// Hook for working hours
export const useWorkingHours = () => {
  const [finalData, setFinalData] = useState({
    loading: true,
    error: null,
    workingHours: fallbackData.workingHours
  })

  const { loading, error, data } = useQuery(GET_WORKING_HOURS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  })

  useEffect(() => {
    if (loading) {
      setFinalData(prev => ({ ...prev, loading: true }))
      return
    }

    if (error || !data) {
      // console.warn('Using fallback data for working hours:', error?.message || 'No data received')
      setFinalData({
        loading: false,
        error: null,
        workingHours: fallbackData.workingHours
      })
      return
    }

    setFinalData({
      loading: false,
      error: null,
      workingHours: data?.workingHours?.[0] || fallbackData.workingHours
    })
  }, [loading, error, data])

  return finalData
}

// Helper function to get service icons
function getServiceIcon(serviceName) {
  // Import icons dynamically
  const { Stethoscope, Heart, Baby, Activity, Pill, Users, Microscope, Ambulance, Shield, Clock } = require('lucide-react')
  
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
    // Add more mappings as needed
  }
  
  return iconMap[serviceName] || Stethoscope
}