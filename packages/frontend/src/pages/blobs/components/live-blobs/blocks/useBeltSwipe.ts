import { type PointerEvent, useRef } from 'react'

/**
 * Pixels a finger moves sideways before it swipes the belt, rather than taps
 * a batch or scrolls the page
 */
const SWIPE_FROM = 8

interface Options {
  /** The slot in the bay, looking back; undefined while live */
  view: number | undefined
  /** The live bay's slot, where a swipe starts from while live */
  head: number | undefined
  /** Pixels from one block to the next along the belt */
  blockPitch: number | undefined
  /** Takes the belt to `slot`, or back to live for undefined */
  onView: (slot: number | undefined) => void
}

/**
 * Lets a finger swipe the belt through the day, as a phone shows few racks
 * at once: the racks follow the finger, a block per rack it moves, so a
 * swipe right brings older blocks in and one left goes back towards live.
 * Only sideways moves are taken; the belt is `touch-action: pan-y`, so up
 * and down still scroll the page. A mouse is left alone, as it has the day
 * under the belt to drag.
 */
export function useBeltSwipe({ view, head, blockPitch, onView }: Options) {
  const swipe = useRef<{
    pointerId: number
    startX: number
    startY: number
    /** The bay's slot when the finger went down */
    from: number
    moved: boolean
  }>(undefined)
  // a swipe ends in a click, which must not pin the batch it ended on
  const swiped = useRef(false)

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    swiped.current = false
    if (event.pointerType !== 'touch' || head === undefined) return
    swipe.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      from: view ?? head,
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
    onView(current.from - Math.round(across / blockPitch))
  }

  const onPointerEnd = (event: PointerEvent<HTMLElement>) => {
    if (swipe.current?.pointerId === event.pointerId) swipe.current = undefined
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
