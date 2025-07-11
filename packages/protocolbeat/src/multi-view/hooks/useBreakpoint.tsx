import { useEffect, useState } from 'react'

export function useBreakpoint() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)

  useEffect(() => {
    const checkWidth = () => {
      setIsMobileOrTablet(window.innerWidth < 768)
    }

    checkWidth()

    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  return isMobileOrTablet
}
