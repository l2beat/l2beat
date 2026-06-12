import type { Parser } from '@l2beat/validate'
import { useCallback, useState } from 'react'

interface UseLocalStorageOptions<T> {
  deserialize?: (value: string) => T
  serialize?: (value: T) => string
}

function deserializeJson<T>(value: string) {
  return JSON.parse(value) as T
}

function serializeJson<T>(value: T) {
  return JSON.stringify(value)
}

export function useLocalStorage<T>(
  key: string,
  fallbackValue: T,
  schema: Parser<T>,
  options?: UseLocalStorageOptions<T>,
) {
  const deserialize = options?.deserialize ?? deserializeJson<T>
  const serialize = options?.serialize ?? serializeJson<T>

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const rawValue = window.localStorage.getItem(key)
      return rawValue ? schema.parse(deserialize(rawValue)) : fallbackValue
    } catch {
      return fallbackValue
    }
  })

  const setValue = useCallback(
    (newValue: T) => {
      try {
        window.localStorage.setItem(key, serialize(newValue))
        setStoredValue(newValue)
      } catch {
        // noop
      }
    },
    [key, serialize],
  )

  return [storedValue, setValue] as const
}
