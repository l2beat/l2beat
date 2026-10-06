import {
  type PointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { prepareCanvas, useAnimationFrame } from '../hooks'
import type { ChainBlock } from './beaconChain'
import {
  type BatchHit,
  type BeltFrame,
  type BeltScene,
  batchKey,
  type Playback,
} from './beltScene'
import { drawBelt } from './drawBelt'
import { BATCH_STAGGER, SETTLE_TIME } from './motion'

export interface BeltHover {
  key: number
  /** The pointer, in the belt's box */
  x: number
  y: number
}

interface Options {
  canvasRef: RefObject<HTMLCanvasElement | null>
  scene: BeltScene | undefined
  /** Slots since genesis on the chain's clock, now */
  progressNow: () => number
  /** For reduced motion: nothing slides or falls */
  still: boolean
  onScreen: boolean
  /** A batch was clicked or tapped */
  onClickBatch: (key: number) => void
}

/**
 * Runs the belt: keeps it on the chain's clock, drops a block's batches in
 * as it comes, paints each frame and finds the batch under the pointer.
 *
 * Nothing here sets state per frame; only a change of hovered batch renders.
 */
export function useBelt({
  canvasRef,
  scene,
  progressNow,
  still,
  onScreen,
  onClickBatch,
}: Options) {
  const playback = useRef<Playback>({
    progress: progressNow(),
    arrivals: new Map(),
    still,
  })
  playback.current.still = still
  const frame = useRef<BeltFrame>({
    hits: [],
    landed: [],
    highlightedInView: 0,
  })
  const sceneRef = useRef(scene)
  sceneRef.current = scene
  const pointer = useRef<{ x: number; y: number } | undefined>(undefined)
  const hoveredKey = useRef<number | undefined>(undefined)
  const [hover, setHover] = useState<BeltHover>()

  const paint = useCallback(
    (toDraw: BeltScene, now: number, hovered: number | undefined) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const { width, height } = toDraw.layout
      const ctx = prepareCanvas(canvas, width, height)
      if (!ctx) return
      playback.current.progress = progressNow()
      drawBelt(ctx, toDraw, playback.current, now, frame.current, hovered)
    },
    [canvasRef, progressNow],
  )

  const findHover = useCallback(() => {
    const at = pointer.current
    const hit = at
      ? findBatchAt(frame.current.hits, sceneRef.current, at)
      : undefined
    const key = hit?.key
    if (key === hoveredKey.current) return
    hoveredKey.current = key
    const canvas = canvasRef.current
    if (canvas) canvas.style.cursor = key === undefined ? '' : 'pointer'
    setHover(key === undefined || !at ? undefined : { key, ...at })
  }, [canvasRef])

  const running = onScreen && scene !== undefined
  useAnimationFrame((_, now) => {
    const current = sceneRef.current
    if (!current) return
    forgetSettled(playback.current, now)
    paint(current, now, hoveredKey.current)
    // the belt moves under a pointer that does not
    findHover()
  }, running)

  // Off screen, no frames come: paint whenever what is drawn changes, and
  // again once the site's font is in, as canvas text cannot swap fonts by itself
  const hoveredNow = hover?.key
  useEffect(() => {
    if (running || !scene) return
    let cancelled = false
    paint(scene, performance.now() / 1000, hoveredNow)
    void document.fonts?.ready.then(() => {
      if (!cancelled) paint(scene, performance.now() / 1000, hoveredNow)
    })
    return () => {
      cancelled = true
    }
  }, [running, paint, scene, hoveredNow])

  /** A new block came in: its batches drop into their rack one after another */
  const dropBlock = useCallback((block: ChainBlock) => {
    if (block.status !== 'proposed' || playback.current.still) return
    const now = performance.now() / 1000
    block.batches.forEach((_, index) => {
      playback.current.arrivals.set(
        batchKey(block.slot, index),
        now + index * BATCH_STAGGER,
      )
    })
  }, [])

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const box = event.currentTarget.getBoundingClientRect()
      const at = { x: event.clientX - box.left, y: event.clientY - box.top }
      pointer.current = at
      findHover()
      // the tooltip follows the pointer across the batch
      if (hoveredKey.current !== undefined) {
        setHover((current) => current && { ...current, ...at })
      }
    },
    [findHover],
  )
  const onPointerLeave = useCallback(() => {
    pointer.current = undefined
    findHover()
  }, [findHover])
  const onClick = useCallback(() => {
    const key = hoveredKey.current
    if (key !== undefined) onClickBatch(key)
  }, [onClickBatch])

  return {
    hover,
    dropBlock,
    handlers: {
      onPointerMove,
      // a tap has no hover before it, so it finds its batch on the way down
      onPointerDown: onPointerMove,
      onPointerLeave,
      onClick,
    },
  }
}

function forgetSettled(playback: Playback, now: number) {
  for (const [key, arrivedAt] of playback.arrivals) {
    if (now - arrivedAt > SETTLE_TIME) playback.arrivals.delete(key)
  }
}

/**
 * The batch under the pointer. Its target reaches halfway to the next rack
 * and into the gaps around it, so even a one-blob batch is easy to hit.
 */
function findBatchAt(
  hits: BatchHit[],
  scene: BeltScene | undefined,
  at: { x: number; y: number },
) {
  if (!scene) return undefined
  const { layout } = scene
  const reachX = (layout.blockPitch - layout.tileSize) / 2
  const reachY = layout.batchGap / 2
  return hits.find(
    (hit) =>
      at.x >= hit.left - reachX &&
      at.x < hit.right + reachX &&
      at.y >= hit.top - reachY &&
      at.y < hit.bottom + reachY,
  )
}
