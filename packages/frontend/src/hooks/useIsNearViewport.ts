import { type RefCallback, startTransition, useCallback, useState } from 'react'
import { whenScrollSettled } from '~/utils/scrollActivity'

/**
 * False on the server and during hydration, true once the element comes
 * within `rootMargin` of the viewport while the page is not mid-scroll. The
 * flip happens in a transition so React can time-slice whatever the caller
 * mounts in response.
 *
 * Mounting blocks the main thread for a few hundred milliseconds, which
 * reads as the page freezing when it happens under a scrolling finger.
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
      let cancelSettled = () => {}
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return
          observer.disconnect()
          cancelSettled = whenScrollSettled((deferred) => {
            // After a scroll, re-observing re-checks the position so an
            // element the user scrolled straight past does not mount.
            if (deferred) observer.observe(element)
            else reveal()
          })
        },
        { rootMargin },
      )
      observer.observe(element)
      return () => {
        observer.disconnect()
        cancelSettled()
      }
    },
    [isNear, rootMargin],
  )

  return [ref, isNear]
}
