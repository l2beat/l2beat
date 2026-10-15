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
/** Pixels per wheel line, for browsers that report line-based deltas. */
const WHEEL_LINE_HEIGHT = 16

/**
 * Fits on mount and on resize; ctrl/meta + wheel over `containerRef` zooms.
 * A bare wheel scrolls the page, or pans when `wheelPans` is set, for views
 * with no page left to scroll.
 */
export function useRelationsCamera(
  content: Size,
  viewport: Size,
  focusX: number | undefined,
  containerRef: RefObject<HTMLElement | null>,
  wheelPans = false,
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
  // A manual camera belongs to the content it was set on; a new layout
  // (e.g. after toggling hidden nodes) falls back to the fit.
  const [manual, setManual] = useState<{ camera: Camera; content: Size }>()
  const camera = manual?.content === content ? manual.camera : fitted

  const setCamera = useCallback(
    (next: Camera) => setManual({ camera: next, content }),
    [content],
  )
  const zoomBy = useCallback(
    (factor: number, point?: Point) =>
      setManual((previous) => ({
        content,
        camera: zoomCamera(
          previous?.content === content ? previous.camera : fitted,
          factor,
          point ?? { x: viewportWidth / 2, y: viewportHeight / 2 },
        ),
      })),
    [content, fitted, viewportWidth, viewportHeight],
  )
  const panBy = useCallback(
    (dx: number, dy: number) =>
      setManual((previous) => {
        const current = previous?.content === content ? previous.camera : fitted
        return {
          content,
          camera: { ...current, x: current.x + dx, y: current.y + dy },
        }
      }),
    [content, fitted],
  )
  const reset = useCallback(() => setManual(undefined), [])

  // Native listener: React's wheel handler is passive, so it cannot stop the
  // browser from zooming the page on ctrl+wheel or scrolling it on a pan.
  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) {
        if (!wheelPans) return
        event.preventDefault()
        const scale =
          event.deltaMode === WheelEvent.DOM_DELTA_LINE ? WHEEL_LINE_HEIGHT : 1
        panBy(-event.deltaX * scale, -event.deltaY * scale)
        return
      }
      event.preventDefault()
      const rect = element.getBoundingClientRect()
      zoomBy(event.deltaY < 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP, {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
    }
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [containerRef, zoomBy, panBy, wheelPans])

  return { camera, setCamera, zoomBy, reset }
}

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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
