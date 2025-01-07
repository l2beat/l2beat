import { useEffect, useState } from 'react'
import { useEventListener } from './use-event-listener'

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>()

  function onResize() {
    const breakpoint =
      window.innerWidth >= 1200
        ? 'desktop'
        : window.innerWidth >= 768
          ? 'tablet'
          : 'mobile'
    setBreakpoint(breakpoint)
  }

  useEffect(onResize, [])
  useEventListener('resize', onResize)

  return breakpoint
}

export function useIsMobile() {
  const breakpoint = useBreakpoint()
  return breakpoint === 'mobile'
}
