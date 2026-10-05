import {
  type PointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { prepareCanvas, useAnimationFrame } from '../../hooks'
import { SLOT_SECONDS } from '../../model'
import { forEachBatchBetween } from '../../schedule'
import type { BatchHit, BeltFrame, BeltScene, Playback } from './beltScene'
import { batchKey, daySlotOf } from './dayBlocks'
import { drawBelt } from './drawBelt'
import { approach, SETTLE_TIME } from './motion'

/** A block a second, so every second plays the 12 seconds of a slot */
export const TIME_SCALE = SLOT_SECONDS

export interface BeltHover {
  key: number
  /** The pointer, in the belt's box */
  x: number
  y: number
}

interface Options {
  canvasRef: RefObject<HTMLCanvasElement | null>
  scene: BeltScene | undefined
  /** Seconds into the day the belt starts at */
  startTime: number
  playing: boolean
  onScreen: boolean
  /** A new block took the bay */
  onBlockChange: (block: number) => void
  /** A batch was clicked or tapped */
  onClickBatch: (key: number) => void
}

/**
 * Runs the belt: moves playback on, drops batches in as their time comes,
 * paints each frame and finds the batch under the pointer. While a batch is
 * hovered the belt eases to a stop, so it can be read and clicked.
 *
 * Nothing here sets state per frame; only a change of hovered batch renders.
 */
export function useBelt({
  canvasRef,
  scene,
  startTime,
  playing,
  onScreen,
  onBlockChange,
  onClickBatch,
}: Options) {
  const playback = useRef<Playback>({
    time: startTime,
    speed: 1,
    arrivals: new Map(),
    bayChangedAt: Number.NEGATIVE_INFINITY,
  })
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
      drawBelt(ctx, toDraw, playback.current, now, frame.current, hovered)
    },
    [canvasRef],
  )

  const findHover = useCallback(() => {
    const at = pointer.current
    const current = sceneRef.current
    const hit =
      at && current ? findBatchAt(frame.current.hits, current, at) : undefined
    const key = hit?.key
    if (key === hoveredKey.current) return
    hoveredKey.current = key
    const canvas = canvasRef.current
    if (canvas) canvas.style.cursor = key === undefined ? '' : 'pointer'
    setHover(key === undefined || !at ? undefined : { key, ...at })
  }, [canvasRef])

  const running = playing && onScreen && scene !== undefined
  useAnimationFrame((dt, now) => {
    const state = playback.current
    const current = sceneRef.current
    state.speed = approach(
      state.speed,
      hoveredKey.current === undefined ? 1 : 0,
      dt,
    )
    const from = state.time
    state.time += dt * TIME_SCALE * state.speed
    if (!current) return
    dropArrivingBatches(current, state, from, now)
    forgetSettled(state, now)

    const block = Math.floor(state.time / SLOT_SECONDS)
    if (block !== Math.floor(from / SLOT_SECONDS)) {
      state.bayChangedAt = now
      onBlockChange(block)
    }
    paint(current, now, hoveredKey.current)
    // the belt moves under a pointer that does not
    findHover()
  }, running)

  // Paused, everything comes to rest at once rather than freezing mid-drop
  // or with the bay half handed over
  useEffect(() => {
    if (playing) return
    playback.current.arrivals.clear()
    playback.current.bayChangedAt = Number.NEGATIVE_INFINITY
  }, [playing])

  // Still, no frames come: paint whenever what is drawn changes, and again
  // once the site's font is in, as canvas text cannot swap fonts by itself
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
    handlers: {
      onPointerMove,
      // a tap has no hover before it, so it finds its batch on the way down
      onPointerDown: onPointerMove,
      onPointerLeave,
      onClick,
    },
  }
}

/** Batches whose time came during this frame start dropping into the bay */
function dropArrivingBatches(
  scene: BeltScene,
  playback: Playback,
  from: number,
  now: number,
) {
  const { batches, blocks } = scene
  forEachBatchBetween(batches, from, playback.time, (batch, time) => {
    const block = Math.floor(time / SLOT_SECONDS)
    const first = blocks.firstBatch[daySlotOf(block)] ?? 0
    const index = batches.indexOf(batch, first)
    if (index < 0) return
    // dated back to when its time came within the frame, so drops keep their spacing
    const late = (playback.time - time) / TIME_SCALE
    playback.arrivals.set(batchKey(block, index - first), now - late)
  })
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
  scene: BeltScene,
  at: { x: number; y: number },
) {
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
