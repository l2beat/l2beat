import {
  type PointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { SLOT_SECONDS } from '~/utils/beaconSlots'
import { prepareCanvas, useAnimationFrame } from '../hooks'
import type { ChainBlock } from './beaconChain'
import { SLIDE_TIME } from './beltPosition'
import {
  type BatchHit,
  type BeltFrame,
  type BeltScene,
  batchKey,
  type Playback,
} from './beltScene'
import { drawBelt } from './drawBelt'
import {
  BATCH_MOTION_TIME,
  BATCH_STAGGER,
  revealed,
  SETTLE_TIME,
} from './motion'

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
  /** A batch was clicked, or tapped while its tooltip showed */
  onClickBatch: (key: number) => void
}

/**
 * Runs the belt: keeps it on the chain's clock, drops a block's batches in
 * as it comes, paints each frame and finds the batch under the pointer.
 *
 * Nothing here sets state per frame; only a change of hovered batch renders.
 * Nor does it paint a frame that would look like the last one: for most of
 * a slot nothing on the belt moves, and each paint redraws the whole canvas.
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
    revealedAt: undefined,
  })
  playback.current.still = still
  const frame = useRef<BeltFrame>({
    hits: [],
    landed: [],
  })
  const sceneRef = useRef(scene)
  sceneRef.current = scene
  const pointer = useRef<{ x: number; y: number } | undefined>(undefined)
  const hoveredKey = useRef<number | undefined>(undefined)
  const [hover, setHover] = useState<BeltHover>()
  const clickActs = useRef(false)
  const painted = useRef<PaintedFrame>(undefined)

  const paint = useCallback(
    (toDraw: BeltScene, now: number, hovered: number | undefined) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const { width, height } = toDraw.layout
      const ctx = prepareCanvas(canvas, width, height)
      if (!ctx) return
      playback.current.progress = progressNow()
      drawBelt(ctx, toDraw, playback.current, now, frame.current, hovered)
      painted.current = {
        scene: toDraw,
        hovered,
        slot: Math.floor(playback.current.progress),
        moving: isMoving(playback.current, now),
      }
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
  useAnimationFrame((_dt, now) => {
    const current = sceneRef.current
    if (!current) return
    const play = playback.current
    forgetSettled(play, now)
    if (play.revealedAt === undefined && current.blocks.size > 0) {
      play.revealedAt = now
    }
    play.progress = progressNow()
    if (
      isMoving(play, now) ||
      !isPainted(painted.current, current, hoveredKey.current, play)
    ) {
      paint(current, now, hoveredKey.current)
    }
    // the belt moves under a pointer that does not
    findHover()
  }, running)

  // Off screen, no frames come: paint whenever what is drawn changes, with no
  // fades on the way, and again once the site's font is in, as canvas text
  // cannot swap fonts by itself
  const hoveredNow = hover?.key
  useEffect(() => {
    if (running || !scene) return
    let cancelled = false
    const play = playback.current
    if (scene.blocks.size > 0) play.revealedAt ??= Number.NEGATIVE_INFINITY
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
  // A tap has no hover before it, so it finds its batch on the way down. It
  // only shows the tooltip, though: a finger cannot read it before it lands,
  // so it takes a second tap on the same batch to act on it
  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const shown = hoveredKey.current
      onPointerMove(event)
      clickActs.current =
        event.pointerType !== 'touch' || shown === hoveredKey.current
    },
    [onPointerMove],
  )
  const onPointerLeave = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      // a lifted finger leaves too, and its tooltip stays for the second tap
      if (event.pointerType === 'touch') return
      pointer.current = undefined
      findHover()
    },
    [findHover],
  )
  const onClick = useCallback(() => {
    const key = hoveredKey.current
    if (key !== undefined && clickActs.current) onClickBatch(key)
  }, [onClickBatch])

  return {
    hover,
    dropBlock,
    handlers: {
      onPointerMove,
      onPointerDown,
      onPointerLeave,
      onClick,
    },
  }
}

/** What the canvas shows now, to tell whether a frame would look the same */
interface PaintedFrame {
  scene: BeltScene
  hovered: number | undefined
  slot: number
  /**
   * Caught mid-motion, so it is not how things come to rest. The last frame
   * of a motion is one, and so is the frame painted before frames stopped,
   * as when the belt went off screen or the tab was hidden mid-drop
   */
  moving: boolean
}

/**
 * The belt slides at the start of a slot and batches drop as they come; tiles
 * fade in when the first blocks come
 */
function isMoving(playback: Playback, now: number) {
  const intoSlot = (playback.progress % 1) * SLOT_SECONDS
  if (intoSlot < SLIDE_TIME) return true
  if (revealed(playback.revealedAt, now) < 1) return true
  for (const arrivedAt of playback.arrivals.values()) {
    if (now - arrivedAt < BATCH_MOTION_TIME) return true
  }
  return false
}

function isPainted(
  painted: PaintedFrame | undefined,
  scene: BeltScene,
  hovered: number | undefined,
  playback: Playback,
) {
  return (
    painted?.moving === false &&
    painted.scene === scene &&
    painted.hovered === hovered &&
    painted.slot === Math.floor(playback.progress)
  )
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
