import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { useHomepageData } from '@/hooks/useCMSData'

// CMS Data - This would typically come from a backend/database
const cmsData = {
  services: [
    {
      name: 'General Medicine',
      description: 'Comprehensive primary care services for all ages, including diagnosis, treatment, and preventive care. Our general practitioners are available for consultations Monday to Saturday, 8 AM to 6 PM.',
      keywords: ['general', 'medicine', 'primary care', 'gp', 'doctor', 'consultation']
    },
    {
      name: 'Cardiology',
      description: 'Expert cardiac care including ECG, stress tests, echocardiography, and heart disease management. Our cardiologists specialize in treating hypertension, coronary artery disease, and heart failure.',
      keywords: ['heart', 'cardiology', 'cardiac', 'ecg', 'blood pressure', 'chest pain', 'hypertension']
    },
    {
      name: 'Pediatrics',
      description: 'Specialized healthcare for infants, children, and adolescents with compassionate care. We provide vaccinations, growth monitoring, and treatment for childhood illnesses.',
      keywords: ['children', 'pediatrics', 'kids', 'baby', 'vaccination', 'child']
    },
    {
      name: 'Laboratory Services',
      description: 'State-of-the-art diagnostic testing with accurate and timely results. We offer blood tests, urine analysis, microbiology, and specialized diagnostic procedures.',
      keywords: ['lab', 'laboratory', 'test', 'blood test', 'diagnosis', 'screening']
    },
    {
      name: 'Pharmacy',
      description: '24/7 pharmacy services with a wide range of medications and professional consultation. Our pharmacists are available to answer questions about your medications.',
      keywords: ['pharmacy', 'medicine', 'medication', 'drugs', 'prescription']
    },
    {
      name: 'Emergency Services',
      description: '24/7 emergency medical services for urgent and life-threatening conditions. Our emergency department is fully equipped and staffed around the clock.',
      keywords: ['emergency', 'urgent', 'accident', 'trauma', '24/7', 'ambulance']
    }
  ],
  workingHours: {
    emergency: '24/7 - Open all day, every day',
    consultation: 'Monday to Saturday: 8:00 AM - 6:00 PM',
    pharmacy: '24/7 - Open all day, every day',
    laboratory: 'Monday to Saturday: 7:00 AM - 7:00 PM, Sunday: 8:00 AM - 2:00 PM'
  },
  contact: {
    phone: 'Loading...',
    email: 'Loading...',
    emergencyPhone: 'Loading...',
    location: 'Loading...'
  },
  appointments: {
    howToBook: 'You can book an appointment by calling our reception at 0798057622, sending an email to dohanimedicare@gmail.com, or using our online booking system on the website.',
    cancellation: 'To cancel or reschedule an appointment, please call us at least 24 hours in advance.',
    walkIn: 'Walk-in patients are welcome, but appointments are recommended to minimize waiting time.'
  },
  insurance: {
    accepted: 'We accept most major insurance providers. Please bring your insurance card and ID when visiting.',
    payment: 'We accept cash, mobile money (M-Pesa), and credit/debit cards.'
  },
  faqs: [
    {
      question: 'What should I bring to my first appointment?',
      answer: 'Please bring a valid ID, your insurance card (if applicable), any previous medical records, and a list of current medications.'
    },
    {
      question: 'Do you offer home visits?',
      answer: 'Yes, we offer home visit services for patients who cannot travel to the hospital. Please call us to arrange a home visit.'
    },
    {
      question: 'Are your doctors qualified?',
      answer: 'All our doctors are fully qualified, licensed medical professionals with years of experience in their respective specialties.'
    }
  ]
}

function ChatBot() {
  // Get CMS data
  const { services: cmsServices, contactInfo, workingHours } = useHomepageData()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Dohani Medicare AI assistant. I can help you with information about our services, working hours, appointments, and general health inquiries. How can I assist you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simple keyword-based response system (fallback if API fails)
  const getLocalResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()

    // Check for greetings
    if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
      return 'Hello! How can I help you today? You can ask me about our services, working hours, appointments, or any health-related questions.'
    }

    // Check for working hours
    if (lowerMessage.includes('hours') || lowerMessage.includes('time') || lowerMessage.includes('open')) {
      return `Our working hours are:\n\n🚨 Emergency Services: ${workingHours?.emergency || '24/7 - Open all day, every day'}\n👨‍⚕️ Consultations: ${workingHours?.consultation || 'Monday to Saturday: 8:00 AM - 6:00 PM'}\n💊 Pharmacy: ${workingHours?.pharmacy || '24/7 - Open all day, every day'}\n🔬 Laboratory: ${workingHours?.laboratory || 'Monday to Saturday: 7:00 AM - 7:00 PM'}`
    }

    // Check for contact information
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('call')) {
      return `You can reach us at:\n\n📞 Phone: ${contactInfo?.phone || 'Loading...'}\n🚨 Emergency: ${contactInfo?.emergencyPhone || contactInfo?.phone || 'Loading...'}\n📧 Email: ${contactInfo?.email || 'Loading...'}\n📍 Location: ${contactInfo?.location || 'Loading...'}`
    }

    // Check for appointments
    if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
      return `${cmsData.appointments.howToBook}\n\nCancellation Policy: ${cmsData.appointments.cancellation}\n\n${cmsData.appointments.walkIn}`
    }

    // Check for insurance
    if (lowerMessage.includes('insurance') || lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return `Insurance & Payment:\n\n${cmsData.insurance.accepted}\n\nPayment Methods: ${cmsData.insurance.payment}`
    }

    // Check for specific services
    if (cmsServices && cmsServices.length > 0) {
      for (const service of cmsServices) {
        for (const keyword of service.keywords || []) {
          if (lowerMessage.includes(keyword.toLowerCase())) {
            return `${service.title}:\n\n${service.description}\n\nWould you like to book an appointment for this service?`
          }
        }
        // Also check service name
        if (lowerMessage.includes(service.title.toLowerCase())) {
          return `${service.title}:\n\n${service.description}\n\nWould you like to book an appointment for this service?`
        }
      }
    }

    // Check FAQs
    for (const faq of cmsData.faqs) {
      if (lowerMessage.includes(faq.question.toLowerCase().substring(0, 20))) {
        return `${faq.question}\n\n${faq.answer}`
      }
    }

    // Default response
    return 'I can help you with information about our services, working hours, appointments, and general inquiries. Could you please be more specific about what you\'d like to know?'
  }

  // AI-powered response using OpenAI API
  const getAIResponse = async (userMessage) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            {
              role: 'system',
              content: `You are a helpful medical assistant for Dohani Medicare Hospital. You should provide accurate information about the hospital's services, working hours, and general health guidance. Always be professional, empathetic, and clear. 

IMPORTANT: You are NOT a replacement for professional medical diagnosis. Always recommend consulting with a doctor for specific medical concerns.

Here is the information you should use to answer questions:

SERVICES:
${cmsServices && cmsServices.length > 0 ? cmsServices.map(s => `- ${s.title}: ${s.description}`).join('\n') : 'Loading services...'}

WORKING HOURS:
- Emergency Services: ${workingHours?.emergency || '24/7 - Open all day, every day'}
- Consultations: ${workingHours?.consultation || 'Monday to Saturday: 8:00 AM - 6:00 PM'}
- Pharmacy: ${workingHours?.pharmacy || '24/7 - Open all day, every day'}
- Laboratory: ${workingHours?.laboratory || 'Monday to Saturday: 7:00 AM - 7:00 PM'}

CONTACT:
- Phone: ${contactInfo?.phone || 'Loading...'}
- Emergency: ${contactInfo?.emergencyPhone || contactInfo?.phone || 'Loading...'}
- Email: ${contactInfo?.email || 'Loading...'}
- Location: ${contactInfo?.location || 'Loading...'}

APPOINTMENTS:
${cmsData.appointments.howToBook}
${cmsData.appointments.cancellation}
${cmsData.appointments.walkIn}

INSURANCE & PAYMENT:
${cmsData.insurance.accepted}
${cmsData.insurance.payment}

Keep responses concise and helpful. Use emojis sparingly for clarity.`
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      // console.error('AI API Error:', error)
      // Fallback to local response
      return getLocalResponse(userMessage)
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Try AI response first, fallback to local if it fails
      const response = await getAIResponse(userMessage)

      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      // console.error('Error getting response:', error)
      const fallbackResponse = getLocalResponse(userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <span className="font-semibold block">Dohani Medicare Assistant</span>
                <span className="text-xs text-blue-100">Online • Typically replies instantly</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${message.role === 'user' ? 'bg-blue-600' : 'bg-white'}`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                      }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mb-4 flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="p-2 rounded-full bg-white">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-white border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setInput('What are your working hours?')}
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                Working Hours
              </button>
              <button
                onClick={() => setInput('How do I book an appointment?')}
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                Book Appointment
              </button>
              <button
                onClick={() => setInput('What services do you offer?')}
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                Services
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 rounded-full px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot

