import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { ChevronLeft, ChevronRight, Stethoscope, ArrowRight } from 'lucide-react'
import { ServicesCarouselSkeleton, SectionLoading } from './LoadingSpinner'

const ServicesCarousel = ({ services, loading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselRef = useRef(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || services.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === services.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, services.length])

  const goToPrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === 0 ? services.length - 1 : currentIndex - 1)
    setTimeout(() => setIsTransitioning(false), 300)
    // Resume auto-play after 15 seconds
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setIsAutoPlaying(false)
    setCurrentIndex(currentIndex === services.length - 1 ? 0 : currentIndex + 1)
    setTimeout(() => setIsTransitioning(false), 300)
    // Resume auto-play after 15 seconds
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setIsAutoPlaying(false)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
    // Resume auto-play after 15 seconds
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  // Touch handlers
  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
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
      <div 
        className="relative overflow-hidden rounded-2xl"
        ref={carouselRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex transition-transform duration-500 ease-in-out">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full px-2 sm:px-0">
            {visibleServices.map((service, index) => (
              <div
                key={`${service.originalIndex}-${index}`}
                className="group"
              >
                <Card
                  className="hover:shadow-2xl transition-all duration-500 border-none animate-fade-in-up bg-white cursor-pointer hover:scale-105 hover:-translate-y-2 h-full"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon ? (
                        <service.icon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                      ) : (
                        <Stethoscope className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                      )}
                    </div>
                    <CardTitle className="text-lg sm:text-xl text-blue-900 group-hover:text-blue-700 transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
                      {service.description}
                    </CardDescription>
                    <Link
                      to={`/service/${service.name || service.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:translate-x-1 transition-all duration-300"
                    >
                      Learn More
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {services.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-4 bg-white/90 backdrop-blur-sm shadow-xl border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:scale-110 z-10 transition-all duration-300"
            onClick={goToPrevious}
            disabled={isTransitioning}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-4 bg-white/90 backdrop-blur-sm shadow-xl border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:scale-110 z-10 transition-all duration-300"
            onClick={goToNext}
            disabled={isTransitioning}
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </>
      )}

      {/* Enhanced Dots Indicator */}
      {services.length > 1 && (
        <div className="flex justify-center mt-8 space-x-3">
          {services.map((_, index) => (
            <button
              key={index}
              className={`relative transition-all duration-300 ${index === currentIndex
                  ? 'w-8 h-3 bg-blue-600 rounded-full'
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full hover:scale-125'
                }`}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
            >
              {index === currentIndex && (
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Enhanced Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center mt-6 space-y-3 sm:space-y-0 sm:space-x-6">
        {/* Auto-play toggle */}
        {services.length > 1 && (
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`text-sm px-4 py-2 rounded-full transition-all duration-300 ${isAutoPlaying
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {isAutoPlaying ? '⏸️ Pause Auto-play' : '▶️ Resume Auto-play'}
          </button>
        )}

        {/* Service Counter */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            <span className="font-medium text-blue-600">{currentIndex + 1}</span> of <span className="font-medium">{services.length}</span> services
          </p>
        </div>
      </div>

      {/* Swipe Hint for Mobile */}
      <div className="block sm:hidden text-center mt-4">
        <p className="text-xs text-gray-400">
          👈 Swipe left or right to browse services 👉
        </p>
      </div>
    </div>
  )
}

export default ServicesCarousel