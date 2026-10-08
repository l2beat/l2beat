import { PINNED_CELL_ATTRIBUTE } from './utils/commonPinningStyles'

// iOS's normal scroll deceleration: the speed left after each millisecond.
const GLIDE_DECELERATION = 0.998
const GLIDE_MIN_SPEED = 0.02
// Movement before a touch drag counts as sideways or as a page scroll.
const DRAG_SLOP_PX = 6

/**
 * The visible copy of a sticky header sits outside the table's scroller, so
 * input that starts on it no longer reaches the table the way it did when the
 * header was inside: sideways wheel and trackpad swipes, sideways touch drags,
 * and keyboard focus landing on a column that is scrolled out of view. This
 * passes each of them on to the scroller. Returns a cleanup.
 */
export function forwardStickyHeaderInput(
  header: HTMLElement,
  scroller: HTMLElement,
  getPinnedWidth: () => number,
) {
  const stopWheel = forwardWheel(header, scroller)
  const stopTouch = forwardTouchDrag(header, scroller)
  const revealFocused = (event: FocusEvent) =>
    revealColumn(event.target, scroller, getPinnedWidth())
  header.addEventListener('focusin', revealFocused)
  return () => {
    stopWheel()
    stopTouch()
    header.removeEventListener('focusin', revealFocused)
  }
}

function forwardWheel(header: HTMLElement, scroller: HTMLElement) {
  const onWheel = (event: WheelEvent) => {
    // A mouse wheel with Shift scrolls sideways, reported either way.
    const deltaX = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX
    const deltaY = event.shiftKey ? 0 : event.deltaY
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return
    event.preventDefault()
    scroller.scrollLeft += deltaX * getWheelUnit(event, scroller)
  }
  header.addEventListener('wheel', onWheel, { passive: false })
  return () => header.removeEventListener('wheel', onWheel)
}

function getWheelUnit(event: WheelEvent, scroller: HTMLElement) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return 16
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return scroller.clientWidth
  return 1
}

/**
 * Sideways drags move the table under the finger and glide on after release
 * like a native flick. Vertical drags stay native (`touch-action: pan-y` in
 * `sticky-table.css`), so the page scrolls as usual.
 */
function forwardTouchDrag(header: HTMLElement, scroller: HTMLElement) {
  let drag:
    | { x: number; y: number; scrollLeft: number; isSideways?: boolean }
    | undefined
  let velocity = 0
  let lastMove = { x: 0, time: 0 }
  let glideFrame = 0

  const onStart = (event: TouchEvent) => {
    cancelAnimationFrame(glideFrame)
    const touch = event.touches[0]
    if (event.touches.length !== 1 || !touch) {
      drag = undefined
      return
    }
    drag = {
      x: touch.clientX,
      y: touch.clientY,
      scrollLeft: scroller.scrollLeft,
    }
    velocity = 0
    lastMove = { x: touch.clientX, time: event.timeStamp }
  }

  const onMove = (event: TouchEvent) => {
    const touch = event.touches[0]
    if (!drag || !touch) return
    const dx = touch.clientX - drag.x
    const dy = touch.clientY - drag.y
    if (drag.isSideways === undefined) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < DRAG_SLOP_PX) return
      drag.isSideways = Math.abs(dx) > Math.abs(dy)
    }
    if (!drag.isSideways) return
    event.preventDefault()
    scroller.scrollLeft = drag.scrollLeft - dx
    const elapsed = event.timeStamp - lastMove.time
    if (elapsed > 0) velocity = (touch.clientX - lastMove.x) / elapsed
    lastMove = { x: touch.clientX, time: event.timeStamp }
  }

  const onEnd = () => {
    if (!drag?.isSideways) return
    drag = undefined
    let previous = performance.now()
    const glide = (now: number) => {
      const elapsed = now - previous
      previous = now
      velocity *= GLIDE_DECELERATION ** elapsed
      const before = scroller.scrollLeft
      scroller.scrollLeft -= velocity * elapsed
      const isStopped = scroller.scrollLeft === before
      if (Math.abs(velocity) > GLIDE_MIN_SPEED && !isStopped) {
        glideFrame = requestAnimationFrame(glide)
      }
    }
    glideFrame = requestAnimationFrame(glide)
  }

  header.addEventListener('touchstart', onStart, { passive: true })
  header.addEventListener('touchmove', onMove, { passive: false })
  header.addEventListener('touchend', onEnd)
  header.addEventListener('touchcancel', onEnd)
  return () => {
    cancelAnimationFrame(glideFrame)
    header.removeEventListener('touchstart', onStart)
    header.removeEventListener('touchmove', onMove)
    header.removeEventListener('touchend', onEnd)
    header.removeEventListener('touchcancel', onEnd)
  }
}

/**
 * Scrolls the table so the focused header cell is not hidden off screen or
 * under the pinned columns. The copy lays its columns out exactly like the
 * table, so a cell's offset in the copy is its column's offset in the table.
 */
function revealColumn(
  target: EventTarget | null,
  scroller: HTMLElement,
  pinnedWidth: number,
) {
  const cell = target instanceof Element ? target.closest('th') : null
  if (!cell || cell.hasAttribute(PINNED_CELL_ATTRIBUTE)) return
  const left = cell.offsetLeft
  const right = left + cell.offsetWidth
  const shownLeft = scroller.scrollLeft + pinnedWidth
  const shownRight = scroller.scrollLeft + scroller.clientWidth
  if (left < shownLeft) scroller.scrollLeft = left - pinnedWidth
  else if (right > shownRight)
    scroller.scrollLeft = right - scroller.clientWidth
}
