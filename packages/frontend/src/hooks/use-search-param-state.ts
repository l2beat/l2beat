'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

/**
 * Use state that is persisted in a search param.
 * @param name search param name
 * @returns array containing the current value and a function to update it
 */
export function useSearchParamState<T extends string = string>(
  key: string,
  defaultValue?: T,
  options: { shallow: boolean } = { shallow: false },
) {
  const router = useRouter()
  const pathname = usePathname()

  const [value, setStateValue] = useState<string | undefined>(defaultValue)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const initialValue = params.get(key) ?? defaultValue
    setStateValue(initialValue)
  }, [key, defaultValue])

  const replaceRoute = useCallback(
    (pathname: string) =>
      options.shallow
        ? window.history.replaceState(null, '', pathname)
        : router.replace(pathname),
    [options.shallow, router],
  )

  const setValue = useCallback(
    (newValue: T | undefined) => {
      const search = new URLSearchParams(window.location.search)

      if (newValue !== defaultValue && newValue !== undefined) {
        search.set(key, newValue)
      } else {
        search.delete(key)
      }

      const stringified = search.toString()

      if (stringified) {
        void replaceRoute(`${pathname}?${stringified}`)
      } else {
        void replaceRoute(pathname)
      }

      setStateValue(newValue)
    },
    [defaultValue, key, pathname, replaceRoute],
  )

  return [value, setValue] as const
}
