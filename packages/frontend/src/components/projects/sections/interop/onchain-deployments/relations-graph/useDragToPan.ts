import { type PointerEvent, type RefObject, useEffect, useRef } from 'react'
import {
  type Camera,
  type CameraControls,
  centroid,
  frameOrigin,
  gestureCamera,
  type Point,
} from './relationsCamera'

/** Pointer travel below this still counts as a click. */
const CLICK_SLOP = 4
/** A fling takes the speed of the finger's last this many milliseconds of travel. */
const FLING_SAMPLE_MS = 100
/** A finger that rested this long before letting go doesn't fling. */
const REST_MS = 50

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
 * A finger that lets go while still moving flings the diagram on, and
 * touching it again stops it.
 */
export function useDragToPan(
  camera: CameraControls,
  containerRef: RefObject<HTMLElement | null>,
  capturesTouch: boolean,
) {
  const pointers = useRef(new Map<number, Point>())
  const anchor = useRef<
    { points: [number, Point][]; camera: Camera; moved: boolean } | undefined
  >(undefined)
  /**
   * The container's top-left corner in client space, read as a gesture
   * starts: reading it on every move would make the browser restyle the
   * diagram first.
   */
  const origin = useRef<Point>({ x: 0, y: 0 })
  /** Where the pointers' centroid was lately, while they all stayed down. */
  const trail = useRef<{ time: number; at: Point }[]>([])
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

  /**
   * Fingers joining or leaving must not jump the view. A finger landing
   * also stops a fling where it is, as reading the camera does.
   */
  const reanchor = (moved: boolean) => {
    trail.current = []
    anchor.current =
      pointers.current.size > 0
        ? { points: [...pointers.current], camera: camera.get(), moved }
        : undefined
  }
  const toLocal = (event: PointerEvent) => ({
    x: event.clientX - origin.current.x,
    y: event.clientY - origin.current.y,
  })
  const pansWith = (event: PointerEvent) =>
    event.pointerType !== 'touch' ||
    pointers.current.size >= (capturesTouch ? 1 : 2)

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    // Touch pans end without a click, so the flag must not wait for one.
    suppressClick.current = false
    origin.current = frameOrigin(event.currentTarget)
    pointers.current.set(event.pointerId, toLocal(event))
    reanchor(anchor.current?.moved ?? false)
  }
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = anchor.current
    if (!current || !pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, toLocal(event))
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
    camera.set(gestureCamera(current.camera, from, to), { live: true })
    const time = event.timeStamp
    trail.current = trail.current.filter(
      (sample) => time - sample.time <= FLING_SAMPLE_MS,
    )
    trail.current.push({ time, at: centroid(to) })
  }
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!pointers.current.has(event.pointerId)) return
    const moved = anchor.current?.moved ?? false
    pointers.current.delete(event.pointerId)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (pointers.current.size === 0) suppressClick.current = moved
    // A pinch is over once a finger lifts: draw the diagram at its new zoom.
    if (moved) camera.settle()
    const velocity =
      event.pointerType === 'touch' && pointers.current.size === 0
        ? releaseVelocity(trail.current, event.timeStamp)
        : undefined
    reanchor(moved)
    if (velocity) camera.fling(velocity)
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

/**
 * In pixels per millisecond, over the last `FLING_SAMPLE_MS` of the finger's
 * travel. None if it rested before it let go at `releasedAt`.
 */
export function releaseVelocity(
  trail: { time: number; at: Point }[],
  releasedAt: number,
): Point | undefined {
  const last = trail.at(-1)
  if (!last || releasedAt - last.time > REST_MS) return undefined
  const first = trail.find(
    (sample) => last.time - sample.time <= FLING_SAMPLE_MS,
  )
  if (!first || first.time === last.time) return undefined
  const duration = last.time - first.time
  return {
    x: (last.at.x - first.at.x) / duration,
    y: (last.at.y - first.at.y) / duration,
  }
}
