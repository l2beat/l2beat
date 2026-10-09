import { useCallback, useLayoutEffect, useRef } from 'react'

const DEFAULT_DELAY_MS = 2_000

export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay = DEFAULT_DELAY_MS,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const callbackRef = useRef(callback)

  useLayoutEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay],
  )
}
