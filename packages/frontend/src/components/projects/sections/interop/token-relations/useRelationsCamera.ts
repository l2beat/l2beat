import { useCallback, useMemo, useRef, useState } from 'react'

/** world * k + (x, y) = screen */
export interface Camera {
  x: number
  y: number
  k: number
}

const MIN_SCALE = 0.2
const MAX_SCALE = 4
const FIT_PADDING = 32
/** Below this a node's chain name and address stop being readable. */
const READABLE_SCALE = 0.55

export interface CameraBounds {
  width: number
  height: number
}

/**
 * Fits the width and anchors the top, rather than fitting everything. A token
 * with dozens of deployments is far taller than the box it sits in, and
 * shrinking to fit turns every node into an unreadable smudge — so the opening
 * view keeps nodes legible, shows the backing structure at the top, and leaves
 * the rest to panning.
 */
export function fitCamera(
  content: CameraBounds,
  viewport: CameraBounds,
): Camera {
  if (content.width <= 0 || content.height <= 0) return { x: 0, y: 0, k: 1 }
  const k = clamp(
    Math.min((viewport.width - FIT_PADDING * 2) / content.width, 1),
    READABLE_SCALE,
    MAX_SCALE,
  )
  // Anchored to the top left when it overflows: backing reads left to right, so
  // the first thing on screen has to be the start of the structure, not its
  // middle. Centred only when the whole thing fits.
  const scaled = { width: content.width * k, height: content.height * k }
  return {
    k,
    x:
      scaled.width <= viewport.width - FIT_PADDING * 2
        ? (viewport.width - scaled.width) / 2
        : FIT_PADDING,
    y:
      scaled.height <= viewport.height - FIT_PADDING * 2
        ? (viewport.height - scaled.height) / 2
        : FIT_PADDING,
  }
}

/**
 * Pan, zoom and reset for the diagram. Hand-rolled rather than pulled from a
 * library: the frontend carries no graph dependency and this is a transform on
 * one `<g>`.
 */
export function useRelationsCamera(
  content: CameraBounds,
  viewport: CameraBounds,
) {
  const initial = useMemo(
    () => fitCamera(content, viewport),
    [content, viewport],
  )
  const [camera, setCamera] = useState<Camera | undefined>(undefined)
  const panOrigin = useRef<
    { x: number; y: number; camera: Camera } | undefined
  >(undefined)

  const current = camera ?? initial

  const zoomBy = useCallback(
    (factor: number, focus?: { x: number; y: number }) => {
      setCamera((previous) => {
        const from = previous ?? initial
        const k = clamp(from.k * factor, MIN_SCALE, MAX_SCALE)
        if (k === from.k) return from
        const point = focus ?? {
          x: viewport.width / 2,
          y: viewport.height / 2,
        }
        // Keep the world point under the cursor fixed while the scale changes.
        const ratio = k / from.k
        return {
          k,
          x: point.x - (point.x - from.x) * ratio,
          y: point.y - (point.y - from.y) * ratio,
        }
      })
    },
    [initial, viewport.width, viewport.height],
  )

  const startPan = useCallback(
    (point: { x: number; y: number }) => {
      panOrigin.current = { ...point, camera: current }
    },
    [current],
  )

  const pan = useCallback((point: { x: number; y: number }) => {
    const origin = panOrigin.current
    if (!origin) return
    setCamera({
      k: origin.camera.k,
      x: origin.camera.x + (point.x - origin.x),
      y: origin.camera.y + (point.y - origin.y),
    })
  }, [])

  const endPan = useCallback(() => {
    panOrigin.current = undefined
  }, [])

  const reset = useCallback(() => setCamera(undefined), [])

  const toWorld = useCallback(
    (point: { x: number; y: number }) => ({
      x: (point.x - current.x) / current.k,
      y: (point.y - current.y) / current.k,
    }),
    [current],
  )

  return {
    camera: current,
    isPanning: panOrigin.current !== undefined,
    zoomBy,
    startPan,
    pan,
    endPan,
    reset,
    toWorld,
    isReset: camera === undefined,
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
