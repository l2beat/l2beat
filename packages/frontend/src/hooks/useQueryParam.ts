import { useState } from 'react'
import { useEventListener } from './useEventListener'
import {
  getSsrRequestSearch,
  notifyLocationSearchChange,
} from './useLocationSearch'

/**
 * Fired after `useQueryParam` rewrites the URL, so every other hook reading
 * the same key (e.g. one chart per tab sharing a unit) picks the change up.
 * `replaceState` and `pushState` fire no event of their own.
 *
 * Not `notifyLocationSearchChange`: `useUrlStateSync` fires that after
 * rewriting the whole query (interop keeps only `from` and `to`), and
 * re-reading then would reset the keys it dropped.
 */
const QUERY_PARAM_CHANGE_EVENT = 'l2beat:query-param-change'

declare global {
  interface WindowEventMap {
    [QUERY_PARAM_CHANGE_EVENT]: Event
  }
}

const getURLSearchParams = () => {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search)
  }
  return new URLSearchParams(getSsrRequestSearch())
}

export const useQueryParam = (
  key: string,
  defaultVal: string,
  opts?: {
    replaceState?: boolean
  },
): [string, (val: string) => void] => {
  const urlSearchParams = getURLSearchParams()
  const [query, setQuery] = useState(urlSearchParams.get(key) ?? defaultVal)

  const updateUrl = (newVal: string) => {
    setQuery(newVal)

    const urlSearchParams = getURLSearchParams()

    if (newVal.trim() !== '' && newVal !== defaultVal) {
      urlSearchParams.set(key, newVal)
    } else {
      urlSearchParams.delete(key)
    }

    if (typeof window !== 'undefined') {
      const search = urlSearchParams.size > 0 ? `?${urlSearchParams}` : ''
      // Keeps the hash, so sorting a table doesn't drop a section anchor
      const newUrl = `${window.location.pathname}${search}${window.location.hash}`
      if (opts?.replaceState) {
        window.history.replaceState({}, '', newUrl)
      } else {
        window.history.pushState({}, '', newUrl)
      }
      window.dispatchEvent(new Event(QUERY_PARAM_CHANGE_EVENT))
      notifyLocationSearchChange()
    }
  }

  const readFromUrl = () => {
    const params = new URLSearchParams(window.location.search)
    setQuery(params.get(key) ?? defaultVal)
  }

  useEventListener('popstate', readFromUrl)
  useEventListener(QUERY_PARAM_CHANGE_EVENT, readFromUrl)

  return [query, updateUrl]
}
