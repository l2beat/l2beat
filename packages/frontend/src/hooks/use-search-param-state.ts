'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

/**
 * Use state that is persisted in a search param.
 * @param name search param name
 * @returns array containing the current value and a function to update it
 */
export function useSearchParamState<T extends string | undefined = string>(
  key: string,
  defaultValue: T,
  options: { shallow: boolean } = { shallow: false },
): [string | undefined, (value: T) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const params = useMemo(() => new URLSearchParams(window.location.search), [])

  const [value, setStateValue] = useState<string | undefined>(
    params.get(key) ?? defaultValue,
  )

  const replaceRoute = useCallback(
    (pathname: string) =>
      options.shallow
        ? window.history.replaceState(null, '', pathname)
        : router.replace(pathname),
    [options.shallow, router],
  )

  const setValue = useCallback(
    (newValue: T) => {
      const search = new URLSearchParams(params)

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
    [defaultValue, key, pathname, replaceRoute, params],
  )

  return [value, setValue]
}
