import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react'
import { ServicesCarouselSkeleton, SectionLoading } from './LoadingSpinner'

const ServicesCarousel = ({ services, loading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || services.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === services.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, services.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === 0 ? services.length - 1 : currentIndex - 1)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === services.length - 1 ? 0 : currentIndex + 1)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToSlide = (index) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  // Calculate visible services (show 3 on desktop, 2 on tablet, 1 on mobile)
  const getVisibleServices = () => {
    const visibleCount = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1
    const visibleServices = []

    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % services.length
      visibleServices.push({ ...services[index], originalIndex: index })
    }

    return visibleServices
  }

  const [visibleServices, setVisibleServices] = useState(getVisibleServices())

  useEffect(() => {
    const handleResize = () => {
      setVisibleServices(getVisibleServices())
    }

    handleResize() // Initial call
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex, services])

  useEffect(() => {
    setVisibleServices(getVisibleServices())
  }, [currentIndex])

  // Show loading state
  if (loading) {
    return <ServicesCarouselSkeleton />
  }

  // Show empty state
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Services Available</h3>
        <p className="text-gray-600">Services information is currently unavailable. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {visibleServices.map((service, index) => (
              <Link
                key={`${service.originalIndex}-${index}`}
                to={`/service/${service.name || service.id}`}
                className="block"
              >
                <Card
                  className="hover:shadow-xl transition-all duration-300 border-none animate-fade-in-up bg-white cursor-pointer hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      {service.icon ? (
                        <service.icon className="h-8 w-8 text-blue-600" />
                      ) : (
                        <Stethoscope className="h-8 w-8 text-blue-600" />
                      )}
                    </div>
                    <CardTitle className="text-xl text-blue-900">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {services.length > 3 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg border-gray-200 hover:bg-blue-50 hover:border-blue-300 z-10"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg border-gray-200 hover:bg-blue-50 hover:border-blue-300 z-10"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {services.length > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {services.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'bg-blue-600 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
                }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {services.length > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`text-sm px-3 py-1 rounded-full transition-colors ${isAutoPlaying
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600'
              }`}
          >
            {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div>
      )}

      {/* Service Counter */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          Showing {Math.min(visibleServices.length, services.length)} of {services.length} services
        </p>
      </div>
    </div>
  )
}

export default ServicesCarousel