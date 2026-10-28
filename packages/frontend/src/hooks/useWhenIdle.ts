import { useEffect } from 'react'

/**
 * Calls `callback` when the browser is first idle after the page has loaded,
 * so the work stays out of the way of loading and hydrating it.
 */
export function useWhenIdle(callback: () => void) {
  useEffect(() => {
    let cancelIdle: (() => void) | undefined
    const scheduleIdle = () => {
      // Safari has no requestIdleCallback.
      if ('requestIdleCallback' in window) {
        const id = requestIdleCallback(callback)
        cancelIdle = () => cancelIdleCallback(id)
      } else {
        const id = setTimeout(callback, 1000)
        cancelIdle = () => clearTimeout(id)
      }
    }

    if (document.readyState === 'complete') {
      scheduleIdle()
    } else {
      window.addEventListener('load', scheduleIdle, { once: true })
    }
    return () => {
      window.removeEventListener('load', scheduleIdle)
      cancelIdle?.()
    }
  }, [callback])
}
