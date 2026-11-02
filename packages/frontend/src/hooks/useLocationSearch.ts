import { useSyncExternalStore } from 'react'

/**
 * The current `location.search`, re-read whenever the page rewrites its URL.
 *
 * `history.pushState` and `replaceState` fire no event, so code that writes
 * the URL calls `notifyLocationSearchChange` after it.
 */
export function useLocationSearch(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

const SEARCH_CHANGE_EVENT = 'l2beat:searchchange'

export function notifyLocationSearchChange() {
  window.dispatchEvent(new Event(SEARCH_CHANGE_EVENT))
}

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(SEARCH_CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(SEARCH_CHANGE_EVENT, onChange)
  }
}

function getSnapshot() {
  return window.location.search
}

/**
 * Hydration renders from this, so it must be what the server rendered from:
 * the request URL. On the client that is the search at page load, as later
 * URL writes (e.g. filters rewriting it on mount) only run after hydration.
 */
const searchAtPageLoad =
  typeof window !== 'undefined' ? window.location.search : undefined

function getServerSnapshot() {
  return searchAtPageLoad ?? getSsrRequestSearch()
}

/** The search of the URL being server-rendered, in `location.search` form. */
export function getSsrRequestSearch() {
  const url = globalThis.__FIX_SSR_URL__ as string
  const queryStart = url.indexOf('?')
  return queryStart === -1 || queryStart === url.length - 1
    ? ''
    : url.slice(queryStart)
}
