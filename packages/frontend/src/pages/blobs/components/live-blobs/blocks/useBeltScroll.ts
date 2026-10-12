import { type PointerEvent, type RefObject, useEffect, useRef } from 'react'

/**
 * Pixels a finger moves sideways before it swipes the belt, rather than taps
 * a batch or scrolls the page
 */
const SWIPE_FROM = 8
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
  /** Holds the belt at `slot`, between two or on one, or lets it go for undefined */
  onHold: (slot: number | undefined) => void
}

/**
 * Scrolls the belt through the day by a finger's swipe, a trackpad's
 * two-finger swipe, a mouse's sideways wheel, or shift with its wheel: the
 * belt follows, and once let go, settles on the block nearest where it was
 * left. A move more up and down than sideways is the page's; the belt is
 * `touch-action: pan-y`. A mouse is not dragged here, as it has the day
 * under the belt to drag.
 */
export function useBeltScroll(
  ref: RefObject<HTMLElement | null>,
  options: Options,
) {
  const latest = useRef(options)
  latest.current = options

  // The listener is not passive: a sideways scroll the belt takes must not
  // also reach the browser, which on a Mac takes it as a swipe back in history
  useEffect(() => {
    const element = ref.current
    if (!element) return
    // kept until the scroll ends, as the belt may still be easing there and a
    // trailing coast must not start again from where it is
    let under: number | 'live' | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const letGo = () => {
      under = undefined
      latest.current.onHold(undefined)
    }
    const onWheel = (event: WheelEvent) => {
      const { position, live, blockPitch } = latest.current
      const across = sidewaysPx(event, element.clientWidth)
      if (!blockPitch || across === undefined) return
      event.preventDefault()
      clearTimeout(timer)
      timer = setTimeout(letGo, SCROLL_ENDS_AFTER)
      const from = under === 'live' ? live() : (under ?? position())
      under = holdAt(latest.current, from + across / blockPitch)
    }
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      element.removeEventListener('wheel', onWheel)
      clearTimeout(timer)
      if (under !== undefined) letGo()
    }
  }, [ref])

  const swipe = useRef<{
    pointerId: number
    startX: number
    startY: number
    /** Where the belt stood when the finger went down */
    from: number
    moved: boolean
  }>(undefined)
  // a swipe ends in a click, which must not pin the batch it ended on
  const swiped = useRef(false)

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    swiped.current = false
    if (event.pointerType !== 'touch') return
    swipe.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      from: latest.current.position(),
      moved: false,
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = swipe.current
    const { blockPitch } = latest.current
    if (current?.pointerId !== event.pointerId || !blockPitch) return
    const across = event.clientX - current.startX
    if (!current.moved) {
      const down = Math.abs(event.clientY - current.startY)
      if (down > Math.abs(across)) {
        if (down >= SWIPE_FROM) swipe.current = undefined
        return
      }
      if (Math.abs(across) < SWIPE_FROM) return
      current.moved = true
      swiped.current = true
      // keeps the swipe going when the finger leaves the belt
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    // the racks stay under the finger: a swipe right brings older blocks in
    holdAt(latest.current, current.from - across / blockPitch)
  }

  const onPointerEnd = (event: PointerEvent<HTMLElement>) => {
    if (swipe.current?.pointerId !== event.pointerId) return
    if (swipe.current.moved) latest.current.onHold(undefined)
    swipe.current = undefined
  }

  /** Whether a click is a swipe's end, to be ignored; asked once per click */
  const isSwipeEnd = () => {
    const ended = swiped.current
    swiped.current = false
    return ended
  }

  return {
    isSwipeEnd,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
    },
  }
}

/** Holds the belt at `slot`, or lets it be live past where live is; says which */
function holdAt(options: Options, slot: number): number | 'live' {
  const { live, earliest, onView, onHold } = options
  if (slot >= live()) {
    onHold(undefined)
    onView(undefined)
    return 'live'
  }
  const held = Math.max(slot, earliest ?? Number.NEGATIVE_INFINITY)
  onHold(held)
  // the block nearest, for what goes with the view: the day's band under the
  // belt, and the pages it loads
  onView(Math.round(held))
  return held
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
