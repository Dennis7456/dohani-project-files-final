import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Debug component to show scroll position information
 * Remove this in production
 */
function ScrollPositionDebug() {
  const [scrollY, setScrollY] = useState(0)
  const [savedPosition, setSavedPosition] = useState(null)
  const location = useLocation()

  // Simple function to get saved scroll position
  const getSavedScrollPosition = (pathname) => {
    try {
      const stored = sessionStorage.getItem('dohani_scroll_positions')
      if (stored) {
        const positions = JSON.parse(stored)
        const position = positions[pathname]
        if (position && typeof position.scrollY === 'number') {
          return position.scrollY
        }
      }
      return null
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const updateSavedPosition = () => {
      const saved = getSavedScrollPosition(location.pathname)
      setSavedPosition(saved)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateSavedPosition()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [location.pathname])

  // Only show in development
  if (import.meta.env.MODE !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div>Route: {location.pathname}</div>
      <div>Current Y: {Math.round(scrollY)}</div>
      <div>Saved Y: {savedPosition !== null ? Math.round(savedPosition) : 'None'}</div>
      <div>Hash: {location.hash || 'None'}</div>
    </div>
  )
}

export default ScrollPositionDebug