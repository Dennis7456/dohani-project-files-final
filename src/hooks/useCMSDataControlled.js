// Controlled CMS integration - Only makes API calls when schema is ready
import { useState, useEffect } from 'react'
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

// Helper function to get service icons
function getServiceIcon(serviceName) {
  const iconMap = {
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

// Check if CMS is properly configured
const isCMSReady = () => {
  const endpoint = import.meta.env.VITE_HYGRAPH_ENDPOINT
  const token = import.meta.env.VITE_HYGRAPH_TOKEN
  return endpoint && token && endpoint.includes('hygraph.com')
}

// Simple test to check if CMS connection works
const testCMSConnection = async () => {
  if (!isCMSReady()) return false
  
  try {
    const endpoint = import.meta.env.VITE_HYGRAPH_ENDPOINT
    const token = import.meta.env.VITE_HYGRAPH_TOKEN
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: `query TestConnection { __typename }`
      })
    })
    
    return response.ok
  } catch (error) {
    // console.warn('CMS connection test failed:', error.message)
    return false
  }
}

// Homepage data hook
export const useHomepageData = () => {
  const [data, setData] = useState({
    loading: false,
    error: null,
    services: [],
    contactInfo: null,
    workingHours: null,
    newsArticles: [],
    doctors: []
  })

  useEffect(() => {
    const loadData = async () => {
      setData(prev => ({ ...prev, loading: true }))
      
      // Check if CMS is ready and working
      const cmsWorking = await testCMSConnection()
      
      if (cmsWorking) {
        // CMS is working - you can add actual GraphQL queries here when schema is ready
        // console.log('✅ CMS connection successful - ready for schema integration')
        setData({
          loading: false,
          error: null,
          services: [], // Will be populated when schema is ready
          contactInfo: null, // Will be populated when schema is ready
          workingHours: null, // Will be populated when schema is ready
          newsArticles: [], // Will be populated when schema is ready
          doctors: [] // Will be populated when schema is ready
        })
      } else {
        // CMS not ready - show empty states
        // console.log('⚠️ CMS not ready - showing empty states')
        setData({
          loading: false,
          error: null,
          services: [],
          contactInfo: null,
          workingHours: null,
          newsArticles: [],
          doctors: []
        })
      }
    }

    loadData()
  }, [])

  return {
    ...data,
    refetch: () => {
      // Refetch logic here
    }
  }
}

// Services hook
export const useServices = () => {
  const [data, setData] = useState({
    loading: false,
    error: null,
    services: []
  })

  useEffect(() => {
    const loadServices = async () => {
      setData(prev => ({ ...prev, loading: true }))
      
      const cmsWorking = await testCMSConnection()
      
      if (cmsWorking) {
        // Ready for actual CMS integration
        setData({
          loading: false,
          error: null,
          services: [] // Will be populated from CMS when schema is ready
        })
      } else {
        setData({
          loading: false,
          error: null,
          services: []
        })
      }
    }

    loadServices()
  }, [])

  return {
    ...data,
    refetch: () => {}
  }
}

// Contact info hook
export const useContactInfo = () => {
  const [data, setData] = useState({
    loading: false,
    error: null,
    contactInfo: null
  })

  useEffect(() => {
    const loadContactInfo = async () => {
      setData(prev => ({ ...prev, loading: true }))
      
      const cmsWorking = await testCMSConnection()
      
      setData({
        loading: false,
        error: null,
        contactInfo: cmsWorking ? null : null // Will be populated from CMS when schema is ready
      })
    }

    loadContactInfo()
  }, [])

  return {
    ...data,
    refetch: () => {}
  }
}

// Working hours hook
export const useWorkingHours = () => {
  const [data, setData] = useState({
    loading: false,
    error: null,
    workingHours: null
  })

  useEffect(() => {
    const loadWorkingHours = async () => {
      setData(prev => ({ ...prev, loading: true }))
      
      const cmsWorking = await testCMSConnection()
      
      setData({
        loading: false,
        error: null,
        workingHours: cmsWorking ? null : null // Will be populated from CMS when schema is ready
      })
    }

    loadWorkingHours()
  }, [])

  return {
    ...data,
    refetch: () => {}
  }
}

// Doctors hook
export const useDoctors = () => {
  return {
    loading: false,
    error: null,
    doctors: [], // Will be populated from CMS when schema is ready
    refetch: () => {}
  }
}

// News articles hook
export const useNewsArticles = (limit = 10) => {
  return {
    loading: false,
    error: null,
    articles: [], // Will be populated from CMS when schema is ready
    refetch: () => {}
  }
}

// Messages hook
export const useMessages = (status = null) => {
  return {
    loading: false,
    error: null,
    messages: [], // Will be populated from CMS when schema is ready
    refetch: () => {}
  }
}

// Appointments hook
export const useAppointments = (status = null) => {
  return {
    loading: false,
    error: null,
    appointments: [], // Will be populated from CMS when schema is ready
    refetch: () => {}
  }
}