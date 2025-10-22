import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Custom hook for managing scroll position across navigation
 * - Saves scroll position when navigating away
 * - Restores scroll position on page refresh or back navigation
 * - Scrolls to top when navigating to new pages
 * - Handles anchor links properly
 */
export function useScrollPosition() {
  const location = useLocation()
  const scrollPositions = useRef(new Map())
  const isInitialLoad = useRef(true)

  useEffect(() => {
    const handleScroll = () => {
      // Save current scroll position for the current route
      scrollPositions.current.set(location.pathname, window.scrollY)
    }

    // Add scroll listener to save positions
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [location.pathname])

  useEffect(() => {
    // Handle scroll behavior on route change
    const handleRouteChange = () => {
      const { pathname, hash } = location

      // If there's a hash (anchor link), scroll to that element
      if (hash) {
        // Small delay to ensure the element is rendered
        setTimeout(() => {
          const element = document.querySelector(hash)
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }
        }, 100)
        return
      }

      // Check if we have a saved scroll position for this route
      const savedPosition = scrollPositions.current.get(pathname)

      if (savedPosition !== undefined && !isInitialLoad.current) {
        // Restore saved scroll position (for back navigation)
        setTimeout(() => {
          window.scrollTo({
            top: savedPosition,
            behavior: 'auto' // Use auto for instant positioning
          })
        }, 0)
      } else {
        // Scroll to top for new pages or initial load
        window.scrollTo({
          top: 0,
          behavior: isInitialLoad.current ? 'auto' : 'smooth'
        })
      }

      isInitialLoad.current = false
    }

    handleRouteChange()
  }, [location])

  // Save scroll positions to sessionStorage for persistence across refreshes
  useEffect(() => {
    const saveScrollPositions = () => {
      const positions = Object.fromEntries(scrollPositions.current)
      sessionStorage.setItem('scrollPositions', JSON.stringify(positions))
    }

    // Load saved positions on mount
    const loadScrollPositions = () => {
      try {
        const saved = sessionStorage.getItem('scrollPositions')
        if (saved) {
          const positions = JSON.parse(saved)
          scrollPositions.current = new Map(Object.entries(positions))
        }
      } catch (error) {
        // console.warn('Failed to load scroll positions:', error)
      }
    }

    loadScrollPositions()

    // Save positions before page unload
    window.addEventListener('beforeunload', saveScrollPositions)

    return () => {
      window.removeEventListener('beforeunload', saveScrollPositions)
      saveScrollPositions() // Save on cleanup
    }
  }, [])

  return {
    // Utility function to manually save current scroll position
    saveCurrentPosition: () => {
      scrollPositions.current.set(location.pathname, window.scrollY)
    },
    
    // Utility function to scroll to top smoothly
    scrollToTop: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },

    // Utility function to scroll to a specific element
    scrollToElement: (elementId) => {
      const element = document.getElementById(elementId)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
  }
}

/**
 * Hook specifically for handling smooth anchor link navigation
 * within single-page sections
 */
export function useSmoothScroll() {
  const handleSmoothScroll = (targetId) => {
    const element = document.getElementById(targetId)
    if (element) {
      const navHeight = 80 // Height of fixed navigation
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - navHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return { handleSmoothScroll }
}