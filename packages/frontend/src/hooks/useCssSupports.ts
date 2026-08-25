import { useMemo } from 'react'

/**
 * Whether the browser supports the given CSS `@supports` condition, e.g.
 * `(offset-path: path("M 0 0")) and (offset-distance: 100%)`.
 *
 * Client-only: on the server this always returns false, so components that
 * server-render would hydrate against mismatched markup. Only use it in
 * components that mount exclusively on the client (behind useIsClient, a
 * ResizeObserver size, etc.).
 */
export function useCssSupports(condition: string): boolean {
  return useMemo(
    () =>
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports(condition),
    [condition],
  )
}
