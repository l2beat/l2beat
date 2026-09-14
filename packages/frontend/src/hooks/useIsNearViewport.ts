import { type RefCallback, startTransition, useCallback, useState } from 'react'
import { isScrolling, onceScrollSettled } from '~/utils/scrollActivity'

/**
 * False on the server and during hydration, true once the element comes
 * within `rootMargin` of the viewport and the page is not mid-scroll. The
 * flip happens in a transition so React can time-slice whatever the caller
 * mounts in response.
 *
 * Waiting for the scroll to settle matters because a mount blocks the main
 * thread for a few hundred milliseconds; done while the user is scrolling
 * it reads as the page freezing under their finger.
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
      let cancelSettled: (() => void) | undefined
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return
          observer.disconnect()
          if (!isScrolling()) {
            reveal()
            return
          }
          // Observing again once the scroll settles re-checks the position,
          // so a chart the user scrolled straight past does not mount.
          cancelSettled = onceScrollSettled(() => observer.observe(element))
        },
        { rootMargin },
      )
      observer.observe(element)
      return () => {
        observer.disconnect()
        cancelSettled?.()
      }
    },
    [isNear, rootMargin],
  )

  return [ref, isNear]
}
