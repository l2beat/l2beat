import { type RefObject, startTransition, useEffect, useState } from 'react'

/**
 * False on the server and during hydration, true once the element comes
 * within `rootMargin` of the viewport. The flip happens in a transition so
 * React can time-slice whatever the caller mounts in response instead of
 * rendering it in one synchronous pass.
 */
export function useIsNearViewport(
  ref: RefObject<Element | null>,
  rootMargin = '300px',
): boolean {
  const [isNear, setIsNear] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (isNear || !element) return
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
  }, [ref, isNear, rootMargin])

  return isNear
}
