/**
 * Utility functions for scroll management
 */

// Storage keys for scroll positions
const SCROLL_POSITIONS_KEY = 'dohani_scroll_positions'
const LAST_SCROLL_TIME_KEY = 'dohani_last_scroll_time'

/**
 * Get all stored scroll positions
 */
function getStoredScrollPositions() {
    try {
        const stored = sessionStorage.getItem(SCROLL_POSITIONS_KEY)
        return stored ? JSON.parse(stored) : {}
    } catch (error) {
        console.warn('Failed to parse stored scroll positions:', error)
        return {}
    }
}

/**
 * Save scroll position for a specific route
 */
export function saveScrollPosition(pathname, scrollY) {
    try {
        const positions = getStoredScrollPositions()
        positions[pathname] = {
            scrollY,
            timestamp: Date.now()
        }
        sessionStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(positions))
        sessionStorage.setItem(LAST_SCROLL_TIME_KEY, Date.now().toString())
    } catch (error) {
        console.warn('Failed to save scroll position:', error)
    }
}

/**
 * Get saved scroll position for a specific route
 */
export function getSavedScrollPosition(pathname) {
    try {
        const positions = getStoredScrollPositions()
        const position = positions[pathname]

        if (position && typeof position.scrollY === 'number') {
            // Check if position is not too old (older than 1 hour)
            const oneHour = 60 * 60 * 1000
            if (Date.now() - position.timestamp < oneHour) {
                return position.scrollY
            }
        }
        return null
    } catch (error) {
        console.warn('Failed to get scroll position:', error)
        return null
    }
}

/**
 * Clear old scroll positions (older than 1 hour)
 */
export function clearOldScrollPositions() {
    try {
        const positions = getStoredScrollPositions()
        const oneHour = 60 * 60 * 1000
        const now = Date.now()

        const cleanedPositions = Object.fromEntries(
            Object.entries(positions).filter(([, position]) => {
                return position.timestamp && (now - position.timestamp < oneHour)
            })
        )

        sessionStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(cleanedPositions))
    } catch (error) {
        console.warn('Failed to clear old scroll positions:', error)
    }
}

/**
 * Smooth scroll to element with offset for fixed header
 */
export function scrollToElementWithOffset(elementId, offset = 80) {
    const element = document.getElementById(elementId)
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - offset

        window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
        })
        return true
    }
    return false
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Scroll to position with respect for user preferences
 */
export function scrollToPosition(scrollY, smooth = true) {
    const behavior = smooth && !prefersReducedMotion() ? 'smooth' : 'auto'

    window.scrollTo({
        top: Math.max(0, scrollY),
        behavior
    })
}