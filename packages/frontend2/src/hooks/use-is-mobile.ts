import { useEffect, useState } from 'react'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 750)
    }

    window.addEventListener('resize', onResize)
    return () => removeEventListener('resize', onResize)
  }, [])

  return isMobile
}
