import { useBreakpoint } from './useBreakpoint'

export function useIsMobile() {
  const breakpoint = useBreakpoint()
  return breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md'
}
