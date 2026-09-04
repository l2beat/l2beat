import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

/** world * k + (x, y) = screen */
export interface Camera {
  x: number
  y: number
  k: number
}

interface Point {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

const MIN_SCALE = 0.2
const MAX_SCALE = 4
const FIT_PADDING = 32
/** Below this the node text stops being readable. */
const READABLE_SCALE = 0.55
const WHEEL_ZOOM_STEP = 1.15

/** Fits the width and anchors the top: a tall graph is panned, not shrunk into a smudge. */
function fitCamera(content: Size, viewport: Size, focusX?: number): Camera {
  if (content.width <= 0 || content.height <= 0) return { x: 0, y: 0, k: 1 }
  const innerWidth = viewport.width - FIT_PADDING * 2
  const innerHeight = viewport.height - FIT_PADDING * 2
  const k = clamp(
    Math.min(innerWidth / content.width, 1),
    READABLE_SCALE,
    MAX_SCALE,
  )
  const width = content.width * k
  const height = content.height * k
  return {
    k,
    x:
      width <= innerWidth
        ? (viewport.width - width) / 2
        : focusX === undefined
          ? FIT_PADDING
          : viewport.width / 2 - focusX * k,
    y: height <= innerHeight ? (viewport.height - height) / 2 : FIT_PADDING,
  }
}

/** Scales around `point` so the world point under it stays put. */
function zoomCamera(camera: Camera, factor: number, point: Point): Camera {
  const k = clamp(camera.k * factor, MIN_SCALE, MAX_SCALE)
  const ratio = k / camera.k
  return {
    k,
    x: point.x - (point.x - camera.x) * ratio,
    y: point.y - (point.y - camera.y) * ratio,
  }
}

/** Fits on mount and on resize; ctrl/meta + wheel over `containerRef` zooms. */
export function useRelationsCamera(
  content: Size,
  viewport: Size,
  focusX: number | undefined,
  containerRef: RefObject<HTMLElement | null>,
) {
  const { width: contentWidth, height: contentHeight } = content
  const { width: viewportWidth, height: viewportHeight } = viewport
  const fitted = useMemo(
    () =>
      fitCamera(
        { width: contentWidth, height: contentHeight },
        { width: viewportWidth, height: viewportHeight },
        focusX,
      ),
    [contentWidth, contentHeight, viewportWidth, viewportHeight, focusX],
  )
  const [camera, setCamera] = useState<Camera>()

  const zoomBy = useCallback(
    (factor: number, point?: Point) =>
      setCamera((previous) =>
        zoomCamera(
          previous ?? fitted,
          factor,
          point ?? { x: viewportWidth / 2, y: viewportHeight / 2 },
        ),
      ),
    [fitted, viewportWidth, viewportHeight],
  )
  const reset = useCallback(() => setCamera(undefined), [])

  // Native listener: React's wheel handler is passive, so it cannot stop the
  // browser from zooming the page on ctrl+wheel. A bare wheel keeps scrolling.
  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      const rect = element.getBoundingClientRect()
      zoomBy(event.deltaY < 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP, {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
    }
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [containerRef, zoomBy])

  return { camera: camera ?? fitted, setCamera, zoomBy, reset }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
