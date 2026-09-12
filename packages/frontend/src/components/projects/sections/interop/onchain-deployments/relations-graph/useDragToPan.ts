import { type PointerEvent, useRef } from 'react'
import type { Camera } from './relationsCamera'

/** Pointer travel below this still counts as a click. */
const CLICK_SLOP = 4

interface Point {
  x: number
  y: number
}

/**
 * Drag-to-pan that leaves plain clicks alone: pointer capture is taken only
 * once a drag is recognised, so node buttons and keyboard activation keep
 * working. The click that ends a drag is flagged so the caller can ignore it.
 *
 * Every active pointer contributes to one gesture anchored at their centroid.
 * A mouse drags with one button; a touch screen pans with two fingers, since
 * the container's `touch-action: pan-y` leaves one finger to page scrolling.
 */
export function useDragToPan(
  camera: Camera,
  setCamera: (camera: Camera) => void,
) {
  const pointers = useRef(new Map<number, Point>())
  const anchor = useRef<
    { centroid: Point; camera: Camera; moved: boolean } | undefined
  >(undefined)
  const suppressClick = useRef(false)

  const centroid = (): Point => {
    const points = [...pointers.current.values()]
    return {
      x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
      y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
    }
  }
  const cameraNow = (): Camera => {
    const current = anchor.current
    if (!current || pointers.current.size === 0)
      return current?.camera ?? camera
    const { x, y } = centroid()
    return {
      ...current.camera,
      x: current.camera.x + x - current.centroid.x,
      y: current.camera.y + y - current.centroid.y,
    }
  }
  /** Fingers joining or leaving must not jump the view. */
  const reanchor = (settled: Camera, moved: boolean) => {
    anchor.current =
      pointers.current.size > 0
        ? { centroid: centroid(), camera: settled, moved }
        : undefined
  }
  const pansWith = (event: PointerEvent) =>
    event.pointerType !== 'touch' || pointers.current.size >= 2

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    // Touch pans end without a click, so the flag must not wait for one.
    suppressClick.current = false
    const settled = cameraNow()
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    })
    reanchor(settled, anchor.current?.moved ?? false)
  }
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = anchor.current
    if (!current || !pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    })
    if (!pansWith(event)) return
    const { x, y } = centroid()
    const dx = x - current.centroid.x
    const dy = y - current.centroid.y
    if (!current.moved) {
      if (Math.abs(dx) <= CLICK_SLOP && Math.abs(dy) <= CLICK_SLOP) return
      current.moved = true
    }
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    setCamera({
      ...current.camera,
      x: current.camera.x + dx,
      y: current.camera.y + dy,
    })
  }
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!pointers.current.has(event.pointerId)) return
    const moved = anchor.current?.moved ?? false
    const settled = cameraNow()
    pointers.current.delete(event.pointerId)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (pointers.current.size === 0) suppressClick.current = moved
    reanchor(settled, moved)
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
