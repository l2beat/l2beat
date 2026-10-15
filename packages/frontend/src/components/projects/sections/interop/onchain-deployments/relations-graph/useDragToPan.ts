import { type PointerEvent, type RefObject, useEffect, useRef } from 'react'
import { type Camera, gestureCamera, type Point } from './relationsCamera'

/** Pointer travel below this still counts as a click. */
const CLICK_SLOP = 4

/**
 * Drag-to-pan and pinch-to-zoom that leave plain clicks alone: pointer
 * capture is taken only once a drag is recognised, so node buttons and
 * keyboard activation keep working. The click that ends a drag is flagged so
 * the caller can ignore it.
 *
 * Every active pointer contributes to one gesture: their centroid pans and
 * their spread zooms. A mouse drags with one button. A touch screen pans with
 * one finger when the container `capturesTouch`; otherwise its
 * `touch-action: pan-y` leaves one finger to page scrolling and panning takes two.
 */
export function useDragToPan(
  camera: Camera,
  setCamera: (camera: Camera) => void,
  containerRef: RefObject<HTMLElement | null>,
  capturesTouch: boolean,
) {
  const pointers = useRef(new Map<number, Point>())
  const anchor = useRef<
    { points: [number, Point][]; camera: Camera; moved: boolean } | undefined
  >(undefined)
  /** The camera the ongoing gesture last set, before React re-renders it. */
  const live = useRef<Camera | undefined>(undefined)
  const suppressClick = useRef(false)

  // Native listener: React's touch handlers are passive, so only this can
  // stop `touch-action: pan-y` from scrolling the page under a two-finger pan.
  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length >= 2 && event.cancelable) event.preventDefault()
    }
    element.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => element.removeEventListener('touchmove', onTouchMove)
  }, [containerRef])

  /** Fingers joining or leaving must not jump the view. */
  const reanchor = (moved: boolean) => {
    const settled = live.current ?? anchor.current?.camera ?? camera
    live.current = undefined
    anchor.current =
      pointers.current.size > 0
        ? { points: [...pointers.current], camera: settled, moved }
        : undefined
  }
  const pansWith = (event: PointerEvent) =>
    event.pointerType !== 'touch' ||
    pointers.current.size >= (capturesTouch ? 1 : 2)

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    // Touch pans end without a click, so the flag must not wait for one.
    suppressClick.current = false
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    })
    reanchor(anchor.current?.moved ?? false)
  }
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = anchor.current
    if (!current || !pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    })
    if (!pansWith(event)) return
    const from = current.points.map(([, point]) => point)
    const to = current.points.map(
      ([id, point]) => pointers.current.get(id) ?? point,
    )
    if (!current.moved) {
      const isClick = from.every((point, index) => {
        const now = to[index] ?? point
        return (
          Math.abs(now.x - point.x) <= CLICK_SLOP &&
          Math.abs(now.y - point.y) <= CLICK_SLOP
        )
      })
      if (isClick) return
      current.moved = true
    }
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    live.current = gestureCamera(current.camera, from, to)
    setCamera(live.current)
  }
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!pointers.current.has(event.pointerId)) return
    const moved = anchor.current?.moved ?? false
    pointers.current.delete(event.pointerId)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (pointers.current.size === 0) suppressClick.current = moved
    reanchor(moved)
  }
  /** True exactly once, for the click that ended a drag. */
  const consumeSuppressedClick = () => {
    const suppressed = suppressClick.current
    suppressClick.current = false
    return suppressed
  }

  return {
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
    consumeSuppressedClick,
  }
}
