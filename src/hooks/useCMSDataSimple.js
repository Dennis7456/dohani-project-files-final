import { useState, useEffect } from 'react'

// Simplified CMS data hooks that work without complex GraphQL queries
// This ensures your website works even if Hygraph schema is not set up

// Fallback data for when Hygraph is not available
export const fallbackData = {
  services: [
    {
      id: '1',
      name: 'General Medicine',
      description: 'Comprehensive primary care services for all ages, including diagnosis, treatment, and preventive care.',
      keywords: ['general', 'medicine', 'primary care', 'gp', 'doctor', 'consultation'],
      featured: true,
      icon: '🏥'
    },
    {
      id: '2',
      name: 'Cardiology',
      description: 'Expert cardiac care including ECG, stress tests, and heart disease management.',
      keywords: ['heart', 'cardiology', 'cardiac', 'ecg', 'blood pressure'],
      featured: true,
      icon: '❤️'
    },
    {
      id: '3',
      name: 'Pediatrics',
      description: 'Specialized healthcare for infants, children, and adolescents with compassionate care.',
      keywords: ['children', 'pediatrics', 'kids', 'baby', 'vaccination'],
      featured: true,
      icon: '👶'
    },
    {
      id: '4',
      name: 'Laboratory Services',
      description: 'State-of-the-art diagnostic testing with accurate and timely results.',
      keywords: ['lab', 'laboratory', 'test', 'blood test', 'diagnosis'],
      featured: false,
      icon: '🔬'
    },
    {
      id: '5',
      name: 'Pharmacy',
      description: '24/7 pharmacy services with a wide range of medications and professional consultation.',
      keywords: ['pharmacy', 'medicine', 'medication', 'drugs', 'prescription'],
      featured: false,
      icon: '💊'
    }
  ],
  contactInfo: {
    id: '1',
    phone: '0798057622',
    emergencyPhone: '0798057622',
    email: 'dohanimedicare@gmail.com',
    location: 'Dohani Medicare Hospital'
  },
  workingHours: {
    id: '1',
    emergency: '24/7 - Open all day, every day',
    consultation: 'Monday to Saturday: 8:00 AM - 6:00 PM',
    pharmacy: '24/7 - Open all day, every day',
    laboratory: 'Monday to Saturday: 7:00 AM - 7:00 PM'
  }
}

// Simple hook that returns data immediately
export const useHomepageData = () => {
  const [data, setData] = useState({
    loading: false,
    error: null,
    services: fallbackData.services.filter(s => s.featured),
    contactInfo: fallbackData.contactInfo,
    workingHours: fallbackData.workingHours,
    newsArticles: []
  })

  return data
}

// Hook for all services
export const useServices = () => {
  const [data, setData] = useState({
    loading: false,
    error: null,
    services: fallbackData.services
  })

  return data
}

// Hook for contact information
export const useContactInfo = () => {
  const [data, setData] = useState({
    loading: false,
    error: null,
    contactInfo: fallbackData.contactInfo
  })

  return data
}

// Hook for working hours
export const useWorkingHours = () => {
  const [data, setData] = useState({
    loading: false,
    error: null,
    workingHours: fallbackData.workingHours
  })

  return data
}

// Optional: Advanced hook that tries Hygraph first, then falls back
export const useHygraphData = (queryType = 'services') => {
  const [data, setData] = useState({
    loading: true,
    error: null,
    data: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = import.meta.env.VITE_HYGRAPH_ENDPOINT
        const token = import.meta.env.VITE_HYGRAPH_TOKEN

        if (!endpoint || !token) {
          throw new Error('Hygraph configuration missing')
        }

        // Simple query to test connection
        const query = `
          query TestQuery {
            __typename
          }
        `

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ query })
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const result = await response.json()
        
        if (result.errors) {
          throw new Error(result.errors[0]?.message || 'GraphQL error')
        }

        // If we get here, Hygraph is working
        setData({
          loading: false,
          error: null,
          data: result.data
        })

      } catch (error) {
        // console.warn('Hygraph connection failed, using fallback data:', error.message)
        setData({
          loading: false,
          error: null, // Don't expose error
          data: fallbackData
        })
      }
    }

    fetchData()
  }, [queryType])

  return data
}