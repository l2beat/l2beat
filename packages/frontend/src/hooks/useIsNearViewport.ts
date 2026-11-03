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
      if (
        typeof IntersectionObserver === 'undefined' ||
        isNearViewportWhilePrerendering(element, rootMargin)
      ) {
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

/**
 * A page Chromium prerenders on hover (see speculationRules.ts) gets no
 * IntersectionObserver callbacks until it is shown, which would leave mounting
 * to the click. Measuring forces the layout instead, so what is near the top
 * of the page mounts while it is still hidden. `rootMargin` is one px value.
 */
function isNearViewportWhilePrerendering(element: Element, rootMargin: string) {
  if (!document.prerendering) return false
  const margin = Number.parseFloat(rootMargin)
  const { top, bottom } = element.getBoundingClientRect()
  return bottom >= -margin && top <= window.innerHeight + margin
}
