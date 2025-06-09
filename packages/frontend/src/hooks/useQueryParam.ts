import { useState } from 'react'
import { useEventListener } from './useEventListener'

const getURLSearchParams = () => {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search)
  }
  return new URLSearchParams(globalThis.__FIX_SSR_URL__.split('?')[1])
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
      if (urlSearchParams.size > 0) {
        const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}`
        if (opts?.replaceState) {
          window.history.replaceState({}, '', newUrl)
        } else {
          window.history.pushState({}, '', newUrl)
        }
      } else {
        if (opts?.replaceState) {
          window.history.replaceState({}, '', window.location.pathname)
        } else {
          window.history.pushState({}, '', window.location.pathname)
        }
      }
    }
  }

  useEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search)
    const value = params.get(key)
    setQuery(value ?? defaultVal)
  })

  return [query, updateUrl]
}
