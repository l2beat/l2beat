import { useSyncExternalStore } from 'react'

// The `can-hover:` variant in globals.css uses the same query.
const CAN_HOVER_QUERY = '(hover: hover) and (pointer: fine)'

/**
 * Whether the primary pointer is a mouse or trackpad rather than a finger.
 * Width does not tell: an iPad in landscape is as wide as a laptop, and a
 * narrow window still has a mouse. Undefined on the server and while
 * hydrating; treat that as hover, which is what the server renders for.
 */
export function useCanHover(): boolean | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

let query: MediaQueryList | undefined

function getQuery() {
  query ??= window.matchMedia(CAN_HOVER_QUERY)
  return query
}

function subscribe(onChange: () => void) {
  const query = getQuery()
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function getSnapshot() {
  return getQuery().matches
}

function getServerSnapshot() {
  return undefined
}
