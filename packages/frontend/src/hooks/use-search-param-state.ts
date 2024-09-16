'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

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
  const searchParams = useSearchParams()

  const value = searchParams.get(key) ?? defaultValue

  const replaceRoute = useCallback(
    (pathname: string) =>
      options.shallow
        ? window.history.replaceState(null, '', pathname)
        : router.replace(pathname),
    [options.shallow, router],
  )

  const setValue = useCallback(
    (value: T) => {
      const search = new URLSearchParams(searchParams)

      if (value !== defaultValue && value !== undefined) {
        search.set(key, value)
      } else {
        search.delete(key)
      }

      const stringified = search.toString()

      if (stringified) {
        void replaceRoute(`${pathname}?${stringified}`)
      } else {
        void replaceRoute(pathname)
      }
    },
    [defaultValue, key, pathname, replaceRoute, searchParams],
  )

  return [value, setValue]
}
