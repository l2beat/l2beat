import { type RefCallback, startTransition, useCallback, useState } from 'react'

/**
 * False on the server and during hydration, true once the observed element
 * comes within `rootMargin` of the viewport. The flip happens in a transition
 * so React can time-slice whatever the caller mounts in response instead of
 * rendering it in one synchronous pass.
 *
 * Returns a callback ref so the observer follows the element across remounts
 * without an effect that has to be re-run by hand.
 */
export function useIsNearViewport(
  rootMargin = '300px',
): [RefCallback<Element>, boolean] {
  const [isNear, setIsNear] = useState(false)

  const ref: RefCallback<Element> = useCallback(
    (element) => {
      if (!element || isNear) return
      const reveal = () => startTransition(() => setIsNear(true))
      if (typeof IntersectionObserver === 'undefined') {
        reveal()
        return
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            reveal()
            observer.disconnect()
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
