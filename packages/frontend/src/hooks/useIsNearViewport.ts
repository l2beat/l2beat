import { type RefCallback, startTransition, useCallback, useState } from 'react'

/**
 * False on the server and during hydration, true once the element comes
 * within `rootMargin` of the viewport. The flip happens in a transition so
 * React can time-slice whatever the caller mounts in response.
 */
export function useIsNearViewport(
  rootMargin = '300px',
): [RefCallback<Element>, boolean] {
  const [isNear, setIsNear] = useState(false)

  const ref: RefCallback<Element> = useCallback(
    (element) => {
      if (!element || isNear) return
      if (typeof IntersectionObserver === 'undefined') {
        startTransition(() => setIsNear(true))
        return
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            startTransition(() => setIsNear(true))
          }
        },
        { rootMargin },
      )
      observer.observe(element)
      return () => observer.disconnect()
    },
    [isNear, rootMargin],
  )

  return [ref, isNear]
}
