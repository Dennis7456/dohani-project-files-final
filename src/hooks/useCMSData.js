import { useQuery } from '@apollo/client'
import { GET_HOMEPAGE_DATA, GET_ALL_SERVICES, GET_CONTACT_INFO, GET_WORKING_HOURS } from '../graphql/queries'

// Hook for homepage data
export const useHomepageData = () => {
  const { loading, error, data } = useQuery(GET_HOMEPAGE_DATA, {
    variables: {
      now: new Date().toISOString()
    },
    errorPolicy: 'all'
  })

  return {
    loading,
    error,
    services: data?.medicalServices || [],
    contactInfo: data?.contactInfos?.[0] || null,
    workingHours: data?.workingHours?.[0] || null,
    newsArticles: data?.newsArticles || []
  }
}

// Hook for all services
export const useServices = () => {
  const { loading, error, data } = useQuery(GET_ALL_SERVICES, {
    errorPolicy: 'all'
  })

  return {
    loading,
    error,
    services: data?.medicalServices || []
  }
}

// Hook for contact information
export const useContactInfo = () => {
  const { loading, error, data } = useQuery(GET_CONTACT_INFO, {
    errorPolicy: 'all'
  })

  return {
    loading,
    error,
    contactInfo: data?.contactInfos?.[0] || null
  }
}

// Hook for working hours
export const useWorkingHours = () => {
  const { loading, error, data } = useQuery(GET_WORKING_HOURS, {
    errorPolicy: 'all'
  })

  return {
    loading,
    error,
    workingHours: data?.workingHours?.[0] || null
  }
}

// Fallback data for when Hygraph is not available
export const fallbackData = {
  services: [
    {
      id: '1',
      name: 'General Medicine',
      description: 'Comprehensive primary care services for all ages, including diagnosis, treatment, and preventive care.',
      keywords: ['general', 'medicine', 'primary care', 'gp', 'doctor', 'consultation'],
      featured: true
    },
    {
      id: '2',
      name: 'Cardiology',
      description: 'Expert cardiac care including ECG, stress tests, and heart disease management.',
      keywords: ['heart', 'cardiology', 'cardiac', 'ecg', 'blood pressure'],
      featured: true
    },
    {
      id: '3',
      name: 'Pediatrics',
      description: 'Specialized healthcare for infants, children, and adolescents with compassionate care.',
      keywords: ['children', 'pediatrics', 'kids', 'baby', 'vaccination'],
      featured: true
    },
    {
      id: '4',
      name: 'Laboratory Services',
      description: 'State-of-the-art diagnostic testing with accurate and timely results.',
      keywords: ['lab', 'laboratory', 'test', 'blood test', 'diagnosis'],
      featured: false
    },
    {
      id: '5',
      name: 'Pharmacy',
      description: '24/7 pharmacy services with a wide range of medications and professional consultation.',
      keywords: ['pharmacy', 'medicine', 'medication', 'drugs', 'prescription'],
      featured: false
    }
  ],
  contactInfo: {
    phone: '+254-XXX-XXX-XXX',
    emergencyPhone: '+254-XXX-XXX-XXX',
    email: 'info@dohanmedicare.com',
    location: 'Dohani Medicare Hospital'
  },
  workingHours: {
    emergency: '24/7 - Open all day, every day',
    consultation: 'Monday to Saturday: 8:00 AM - 6:00 PM',
    pharmacy: '24/7 - Open all day, every day',
    laboratory: 'Monday to Saturday: 7:00 AM - 7:00 PM'
  }
}