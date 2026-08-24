import { useEffect, useRef } from 'react'
import { useDebouncedValue } from './useDebouncedValue'
import { useEventCallback } from './useEventCallback'
import { useEventListener } from './useEventListener'

interface UseUrlStateSyncOptions<T> {
  /** The live client state; its canonical URL is pushed (debounced). */
  state: T
  debounceMs: number
  /** Parses state from URL search params, tolerating garbage. */
  parse: (searchParams: URLSearchParams) => T
  /** Builds the canonical URL (path + query) of a state. */
  build: (pathname: string, state: T) => string
  /** Applies the parsed URL state on browser back/forward. */
  onPopState: (parsed: T) => void
  /** Notified after a URL is pushed, e.g. for tracking. */
  onPushState?: (url: string, state: T) => void
}

/**
 * Keeps the URL in sync with client state (debounced) and applies URL state
 * on browser back/forward.
 *
 * Two states are considered equal iff they build the same canonical URL, so
 * `build` is the single place encoding which state is visible in the URL -
 * there is no separate equality predicate to keep in sync with it.
 */
export function useUrlStateSync<T>({
  state,
  debounceMs,
  parse,
  build,
  onPopState,
  onPushState,
}: UseUrlStateSyncOptions<T>) {
  const debouncedState = useDebouncedValue(state, debounceMs)
  // Skips the sync right after a popstate, so restoring a non-canonical URL
  // (e.g. hand-edited params) doesn't immediately push its canonical form
  // and trap the back button.
  const skipNextUrlUpdate = useRef(false)

  const sync = useEventCallback((nextState: T) => {
    if (skipNextUrlUpdate.current) {
      skipNextUrlUpdate.current = false
      return
    }

    const pathname = window.location.pathname
    const nextUrl = build(pathname, nextState)
    const canonicalCurrentUrl = build(
      pathname,
      parse(new URLSearchParams(window.location.search)),
    )
    if (nextUrl === canonicalCurrentUrl) {
      return
    }

    window.history.pushState({}, '', nextUrl)
    onPushState?.(nextUrl, nextState)
  })

  useEffect(() => sync(debouncedState), [sync, debouncedState])

  useEventListener('popstate', () => {
    skipNextUrlUpdate.current = true
    onPopState(parse(new URLSearchParams(window.location.search)))
  })
}
