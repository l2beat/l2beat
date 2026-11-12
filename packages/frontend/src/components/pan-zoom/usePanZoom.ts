import { useMemo, useRef } from 'react'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { type Camera, type ScaleBounds, type Size, useCamera } from './camera'
import { useDragToPan } from './useDragToPan'

/**
 * A camera on `content` in the frame behind `frameRef`, fitted again as the
 * frame resizes, and the pointer handlers that drag and pinch it. Render it
 * with `PanZoomFrame` and `CameraWorld`.
 *
 * A frame that `fillsView` has no page left to scroll, so a bare wheel and
 * one finger pan it. Otherwise they scroll the page, ctrl + wheel zooms, and
 * touch pans with two fingers.
 */
export function usePanZoom({
  content,
  fitTo,
  scale,
  fillsView,
  initialViewport,
}: {
  /** Compared by identity: a new one drops a camera moved by hand. */
  content: Size
  /** Keep it stable, as a new one fits the content again. */
  fitTo: (viewport: Size) => Camera
  scale?: (fitted: Camera) => ScaleBounds
  fillsView: boolean
  /** The frame's size until it is measured. */
  initialViewport: Size
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const size = useResizeObserver({ ref: frameRef })
  const viewport = {
    width: size.width ?? initialViewport.width,
    height: size.height ?? initialViewport.height,
  }
  const { width, height } = viewport
  const fitted = useMemo(() => fitTo({ width, height }), [fitTo, width, height])
  const bounds = useMemo(() => scale?.(fitted), [scale, fitted])
  const { camera, ...layers } = useCamera(content, fitted, viewport, frameRef, {
    wheelPans: fillsView,
    scale: bounds,
  })
  const pan = useDragToPan(camera, frameRef, fillsView)
  return { frameRef, viewport, camera, fillsView, ...layers, ...pan }
}

export type PanZoom = ReturnType<typeof usePanZoom>
