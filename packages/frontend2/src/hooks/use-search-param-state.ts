'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

/**
 * Use state that is persisted in a search param.
 * @param name search param name
 * @returns array containing the current value and a function to update it
 */
export function useSearchParamState<T extends string | undefined = string>(
  key: string,
  defaultValue: T,
): [string | undefined, (value: T) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const value = searchParams.get(key) ?? defaultValue

  const setValue = (value: T) => {
    const search = new URLSearchParams(searchParams)

    if (value !== defaultValue && value !== undefined) {
      search.set(key, value)
    } else {
      search.delete(key)
    }

    const stringified = search.toString()

    if (stringified) {
      void router.replace(`${pathname}?${stringified}`)
    } else {
      void router.replace(pathname)
    }
  }

  return [value, setValue]
}
