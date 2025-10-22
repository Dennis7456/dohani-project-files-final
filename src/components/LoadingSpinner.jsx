import { Loader2 } from 'lucide-react'

// Simple spinner component
export function LoadingSpinner({ size = 'default', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  )
}

// Card skeleton for services
export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="bg-gray-200 w-16 h-16 rounded-full"></div>
        <div className="flex-1">
          <div className="bg-gray-200 h-6 rounded mb-2"></div>
          <div className="bg-gray-200 h-4 rounded w-3/4"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="bg-gray-200 h-4 rounded"></div>
        <div className="bg-gray-200 h-4 rounded w-5/6"></div>
        <div className="bg-gray-200 h-4 rounded w-4/6"></div>
      </div>
    </div>
  )
}

// Services carousel skeleton
export function ServicesCarouselSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Doctor card skeleton
export function DoctorCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 text-center animate-pulse">
      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200"></div>
      <div className="bg-gray-200 h-6 rounded mb-2 mx-auto w-3/4"></div>
      <div className="bg-gray-200 h-4 rounded mb-4 mx-auto w-1/2"></div>
      <div className="space-y-2 mb-4">
        <div className="bg-gray-200 h-4 rounded"></div>
        <div className="bg-gray-200 h-4 rounded w-5/6 mx-auto"></div>
      </div>
      <div className="bg-gray-200 h-10 rounded"></div>
    </div>
  )
}

// News card skeleton
export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="bg-gray-200 h-6 rounded mb-2"></div>
        <div className="bg-gray-200 h-4 rounded mb-4 w-1/2"></div>
        <div className="space-y-2 mb-4">
          <div className="bg-gray-200 h-4 rounded"></div>
          <div className="bg-gray-200 h-4 rounded w-5/6"></div>
          <div className="bg-gray-200 h-4 rounded w-4/6"></div>
        </div>
        <div className="bg-gray-200 h-6 rounded w-24"></div>
      </div>
    </div>
  )
}

// Full page loading component
export function PageLoading({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center">
        <LoadingSpinner size="xl" className="text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{message}</h2>
        <p className="text-gray-600">Please wait while we fetch the latest information...</p>
      </div>
    </div>
  )
}

// Section loading component
export function SectionLoading({ message = 'Loading content...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner size="lg" className="text-blue-600 mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  )
}