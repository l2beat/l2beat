import { assert } from '@l2beat/shared-pure'

export function usePathname(): string {
  if (typeof window === 'undefined') {
    const url = globalThis.__FIX_SSR_URL__ as string
    // Remove query params
    const [pathname] = url.split('?')
    assert(pathname, 'pathname is required')
    return pathname
  }
  return window.location.pathname
}
