import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useState } from 'react'

type InitialValue<T> = T | (() => T)

interface UseLocalStorageOptions<T> {
  deserialize?: (value: string) => T
  serialize?: (value: T) => string
}

function resolveInitialValue<T>(initialValue: InitialValue<T>) {
  return typeof initialValue === 'function'
    ? (initialValue as () => T)()
    : initialValue
}

function deserializeJson<T>(value: string) {
  return JSON.parse(value) as T
}

function serializeJson<T>(value: T) {
  return JSON.stringify(value)
}

export function useLocalStorage<T>(
  key: string,
  initialValue: InitialValue<T>,
  options?: UseLocalStorageOptions<T>,
) {
  const deserialize = options?.deserialize ?? deserializeJson<T>
  const serialize = options?.serialize ?? serializeJson<T>

  const [storedValue, setStoredValue] = useState<T>(() => {
    const fallbackValue = resolveInitialValue(initialValue)

    if (typeof window === 'undefined') {
      return fallbackValue
    }

    try {
      const rawValue = window.localStorage.getItem(key)
      return rawValue ? deserialize(rawValue) : fallbackValue
    } catch {
      return fallbackValue
    }
  })

  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      setStoredValue((currentValue) => {
        const nextValue =
          typeof value === 'function'
            ? (value as (value: T) => T)(currentValue)
            : value

        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, serialize(nextValue))
          } catch {
            // Ignore storage write failures and keep React state in sync.
          }
        }

        return nextValue
      })
    },
    [key, serialize],
  )

  return [storedValue, setValue] as const
}
