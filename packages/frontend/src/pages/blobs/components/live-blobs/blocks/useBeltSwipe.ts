import { type PointerEvent, useRef } from 'react'

/**
 * Pixels a finger moves sideways before it swipes the belt, rather than taps
 * a batch or scrolls the page
 */
const SWIPE_FROM = 8

interface Options {
  /** Where the belt stands now, as a view would put it, which a swipe starts from */
  position: () => number
  /** Pixels from one block to the next along the belt */
  blockPitch: number | undefined
  /** The furthest back the bay can go */
  earliest: number | undefined
  /** Takes the belt to `slot`, or back to live for undefined */
  onView: (slot: number | undefined) => void
  /**
   * Holds the belt under the finger at `slot`, between two or on one, or
   * lets it go for undefined
   */
  onHold: (slot: number | undefined) => void
}

/**
 * Lets a finger swipe the belt through the day, as a phone shows few racks
 * at once: the racks stay under the finger as it moves, so a swipe right
 * brings older blocks in and one left goes back towards live. Let go, the
 * belt settles on the block nearest where it was left.
 * Only sideways moves are taken; the belt is `touch-action: pan-y`, so up
 * and down still scroll the page. A mouse is left alone, as it has the day
 * under the belt to drag.
 */
export function useBeltSwipe({
  position,
  blockPitch,
  earliest,
  onView,
  onHold,
}: Options) {
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
      from: position(),
      moved: false,
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = swipe.current
    if (current?.pointerId !== event.pointerId || !blockPitch) return
    const across = event.clientX - current.startX
    if (!current.moved) {
      const down = Math.abs(event.clientY - current.startY)
      // more down than across is the page scrolling, which the browser has
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
    const under = Math.max(
      current.from - across / blockPitch,
      earliest ?? Number.NEGATIVE_INFINITY,
    )
    onHold(under)
    // the block nearest the finger, for what goes with the view: the day's
    // band under the belt, and the pages it loads
    onView(Math.round(under))
  }

  const onPointerEnd = (event: PointerEvent<HTMLElement>) => {
    if (swipe.current?.pointerId !== event.pointerId) return
    // let go, the belt eases onto that nearest block
    if (swipe.current.moved) onHold(undefined)
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
