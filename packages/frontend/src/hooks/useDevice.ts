import { useBreakpoint } from './useBreakpoint'

export function useDevice() {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm'
  const isTablet = breakpoint === 'md'
  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet }
}
