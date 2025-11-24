import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * A hook that synchronizes component state with a URL query parameter.
 *
 * @param key - The query parameter key
 * @param defaultValue - The default value if the query parameter is not present
 * @returns A tuple of [value, setValue] similar to useState
 *
 * @example
 * ```tsx
 * const [tab, setTab] = useQueryState('tab', 'deployed')
 * ```
 */
export function useQueryState(
  key: string,
  defaultValue: string,
): [string, (value: string) => void, () => void] {
  const [searchParams, setSearchParams] = useSearchParams()

  const value = useMemo(
    () => searchParams.get(key) ?? defaultValue,
    [searchParams, key, defaultValue],
  )

  const setValue = useCallback(
    (value: string) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev)
        newParams.set(key, value)
        return newParams
      })
    },
    [setSearchParams, key],
  )

  const clear = useCallback(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.delete(key)
      return newParams
    })
  }, [setSearchParams, key])

  return [value, setValue, clear]
}
