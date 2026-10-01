import { useCallback, useState } from 'react'

/**
 * State that survives the full page load of a navigation but stays with its
 * browser tab: sessionStorage, unlike localStorage, is not shared across tabs
 * and is dropped when the tab closes.
 */
export function useSessionState<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => read<T>(key) ?? initialValue)

  const setAndStore = useCallback(
    (next: T) => {
      setValue(next)
      try {
        window.sessionStorage.setItem(key, JSON.stringify(next))
      } catch {}
    },
    [key],
  )

  return [value, setAndStore]
}

function read<T>(key: string): T | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const raw = window.sessionStorage.getItem(key)
    return raw === null ? undefined : (JSON.parse(raw) as T)
  } catch {
    return undefined
  }
}
