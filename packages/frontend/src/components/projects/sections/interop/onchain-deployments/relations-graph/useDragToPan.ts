import { type PointerEvent, useRef } from 'react'
import type { Camera } from './relationsCamera'

/** Pointer travel below this still counts as a click. */
const CLICK_SLOP = 4

/**
 * Drag-to-pan that leaves plain clicks alone: pointer capture is taken only
 * once a drag is recognised, so node buttons and keyboard activation keep
 * working. The click that ends a drag is flagged so the caller can ignore it.
 */
export function useDragToPan(
  camera: Camera,
  setCamera: (camera: Camera) => void,
) {
  const gesture = useRef<
    { x: number; y: number; camera: Camera; moved: boolean } | undefined
  >(undefined)
  const suppressClick = useRef(false)

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    // Touch pans end without a click, so the flag must not wait for one.
    suppressClick.current = false
    gesture.current = {
      x: event.clientX,
      y: event.clientY,
      camera,
      moved: false,
    }
  }
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = gesture.current
    if (!current) return
    const dx = event.clientX - current.x
    const dy = event.clientY - current.y
    if (!current.moved) {
      if (Math.abs(dx) <= CLICK_SLOP && Math.abs(dy) <= CLICK_SLOP) return
      current.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    setCamera({
      ...current.camera,
      x: current.camera.x + dx,
      y: current.camera.y + dy,
    })
  }
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const current = gesture.current
    gesture.current = undefined
    if (!current?.moved) return
    suppressClick.current = true
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }
  const onPointerCancel = () => {
    gesture.current = undefined
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
      onPointerCancel,
    },
    consumeSuppressedClick,
  }
}
