import { useEffect, useState } from 'react'
import { useEventListener } from './use-event-listener'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export function useTailwindBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>()

  function onResize() {
    const breakpoint =
      window.innerWidth >= 1920
        ? 'xl'
        : window.innerWidth >= 1200
          ? 'lg'
          : window.innerWidth >= 768
            ? 'md'
            : window.innerWidth >= 550
              ? 'sm'
              : 'xs'
    setBreakpoint(breakpoint)
  }

  useEffect(onResize, [])
  useEventListener('resize', onResize)

  return breakpoint
}
