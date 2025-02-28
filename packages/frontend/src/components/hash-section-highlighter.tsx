'use client'
import { useEffect } from 'react'

export function HashSectionHighlighter() {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        // Remove any existing highlights
        document.querySelectorAll('[data-hash-highlighted]').forEach((el) => {
          el.removeAttribute('data-hash-highlighted')
        })

        // Find the element with the matching ID
        const element = document.querySelector(hash)

        if (element) {
          // Add the highlight
          element.setAttribute('data-hash-highlighted', 'true')

          // Remove the highlight after 3 seconds
          // setTimeout(() => {
          //   element.removeAttribute('data-hash-highlighted')
          // }, 3000) // 3000 milliseconds = 3 seconds
        }
      }
    }

    // Initial highlight on mount
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return null // This component doesn't render anything directly
}
