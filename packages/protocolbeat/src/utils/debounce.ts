import { useCallback, useRef } from 'react'

const DEFAULT_DELAY_MS = 2_000

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait = DEFAULT_DELAY_MS,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, wait)
  }
}

export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay = DEFAULT_DELAY_MS,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay],
  )
}
