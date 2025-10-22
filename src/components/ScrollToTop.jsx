import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Component that automatically scrolls to top on route changes
 * unless there's a hash in the URL (for anchor links)
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // Don't scroll to top if there's a hash (anchor link)
    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, [pathname, hash])

  return null
}

export default ScrollToTop