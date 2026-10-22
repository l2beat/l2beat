import { useEffect, useState } from 'react'

export function useDebounce<T>(
  value: T,
  delayOrFn: number | ((value: T) => number),
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const delay = typeof delayOrFn === 'function' ? delayOrFn(value) : delayOrFn

    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [value, delayOrFn])

  return debouncedValue
}
