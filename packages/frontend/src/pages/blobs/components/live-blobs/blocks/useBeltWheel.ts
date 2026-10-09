import { type RefObject, useEffect, useRef } from 'react'

/**
 * Milliseconds without a wheel event after which the scroll has ended. A
 * trackpad keeps sending events while it coasts after the fingers lift, so
 * this lets go only once the belt has stopped
 */
const SCROLL_ENDS_AFTER = 150
/** Pixels in a line, for a wheel that counts in lines, as Firefox's mouse does */
const LINE_PX = 16

interface Options {
  /** Where the belt stands now, as a view would put it, which a scroll starts from */
  position: () => number
  /** Where the live belt stands; a scroll that reaches it is live again */
  live: () => number
  /** Pixels from one block to the next along the belt */
  blockPitch: number | undefined
  /** The furthest back the bay can go */
  earliest: number | undefined
  /** Takes the belt to `slot`, or back to live for undefined */
  onView: (slot: number | undefined) => void
  /** Holds the belt at `slot`, or lets it go for undefined */
  onHold: (slot: number | undefined) => void
}

/**
 * Lets a trackpad's two-finger swipe, a mouse's sideways wheel or shift with
 * its wheel scroll the belt through the day, as a finger swipes it on a
 * phone: the belt follows the scroll, and once it stops, settles on the block
 * nearest where it was left. A scroll that is more up and down than sideways
 * is the page's.
 * The listener is not passive, as a sideways scroll the belt takes must not
 * also go to the browser, which on a Mac would take it as a swipe back
 * through history.
 */
export function useBeltWheel(
  ref: RefObject<HTMLElement | null>,
  options: Options,
) {
  const latest = useRef(options)
  latest.current = options

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let under: number | undefined
    let timer: ReturnType<typeof setTimeout> | undefined

    const letGo = () => {
      under = undefined
      latest.current.onHold(undefined)
    }

    const onWheel = (event: WheelEvent) => {
      const { position, live, blockPitch, earliest, onView, onHold } =
        latest.current
      const across = sidewaysPx(event, element.clientWidth)
      if (!blockPitch || across === undefined) return
      event.preventDefault()
      clearTimeout(timer)
      const next = (under ?? position()) + across / blockPitch
      if (next >= live()) {
        letGo()
        onView(undefined)
        return
      }
      under = Math.max(next, earliest ?? Number.NEGATIVE_INFINITY)
      onHold(under)
      // the block nearest, for what goes with the view: the day's band
      // under the belt, and the pages it loads
      onView(Math.round(under))
      timer = setTimeout(letGo, SCROLL_ENDS_AFTER)
    }

    element.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      element.removeEventListener('wheel', onWheel)
      clearTimeout(timer)
      if (under !== undefined) letGo()
    }
  }, [ref])
}

/**
 * Pixels the wheel moves sideways, positive towards live, or undefined for a
 * scroll more up and down than sideways. Shift turns a mouse's wheel
 * sideways; most browsers do that themselves, Firefox only flags it
 */
function sidewaysPx(event: WheelEvent, beltWidth: number) {
  const shifted = event.shiftKey && event.deltaX === 0
  const across = shifted ? event.deltaY : event.deltaX
  const down = shifted ? 0 : event.deltaY
  if (across === 0 || Math.abs(down) > Math.abs(across)) return undefined
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return across * LINE_PX
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return across * beltWidth
  return across
}
