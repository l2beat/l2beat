import { useEffect, useState } from 'react'

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>()

  useEffect(() => {
    function onResize() {
      const breakpoint =
        window.innerWidth >= 1120
          ? 'desktop'
          : window.innerWidth >= 750
            ? 'tablet'
            : 'mobile'
      setBreakpoint(breakpoint)
    }

    onResize()
    window.addEventListener('resize', onResize)
    return () => removeEventListener('resize', onResize)
  }, [])

  return breakpoint
}
