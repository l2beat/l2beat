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
import type { ChainBlock, PendingBlobBatch } from './beaconChain'
import { SLIDE_TIME } from './beltPosition'
import {
  type BatchHit,
  type BeltFrame,
  type BeltScene,
  batchKey,
  type Playback,
} from './beltScene'
import { batchLandsAfter, drawBelt } from './drawBelt'
import { pendingSpot, updateLane } from './lane'
import {
  BATCH_MOTION_TIME,
  BATCH_STAGGER,
  easeEmphasis,
  isEmphasisSettled,
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
  /** A batch was clicked or tapped */
  onClickBatch: (key: number) => void
}

/**
 * Runs the belt: keeps it on the chain's clock, lines up what waits in the
 * mempool, drops a block's batches in as it comes, from where they waited
 * if they did, paints each frame and finds the batch under the pointer.
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
    lane: new Map(),
    laneAt: performance.now() / 1000,
    laneMoving: false,
    flights: new Map(),
    still,
    emphasis: [],
    revealedAt: undefined,
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
        moving: isMoving(playback.current, toDraw, now),
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
  useAnimationFrame((dt, now) => {
    const current = sceneRef.current
    if (!current) return
    const play = playback.current
    forgetSettled(play, now)
    easeEmphasis(play.emphasis, current.posters.length, current.highlighted, dt)
    if (play.revealedAt === undefined && current.blocks.size > 0) {
      play.revealedAt = now
    }
    play.progress = progressNow()
    moveLane(play, current, now)
    if (
      isMoving(play, current, now) ||
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
    easeEmphasis(
      play.emphasis,
      scene.posters.length,
      scene.highlighted,
      Number.POSITIVE_INFINITY,
    )
    if (scene.blocks.size > 0) play.revealedAt ??= Number.NEGATIVE_INFINITY
    moveLane(play, scene, performance.now() / 1000)
    paint(scene, performance.now() / 1000, hoveredNow)
    void document.fonts?.ready.then(() => {
      if (!cancelled) paint(scene, performance.now() / 1000, hoveredNow)
    })
    return () => {
      cancelled = true
    }
  }, [running, paint, scene, hoveredNow])

  /**
   * A new block came in: its batches drop into their rack one after another,
   * those that waited in the lane leaving it for the bay. Says in how many
   * seconds each batch lands, so what counts it can count it then
   */
  const dropBlock = useCallback((block: ChainBlock): number[] => {
    if (block.status !== 'proposed') return []
    const layout = sceneRef.current?.layout
    if (playback.current.still || !layout) return block.batches.map(() => 0)
    const { arrivals, lane, flights } = playback.current
    const now = performance.now() / 1000
    const rackX = layout.bayX - layout.rackWidth / 2 + layout.rackPadding
    return block.batches.map((batch, index) => {
      const key = batchKey(block.slot, index)
      const startsIn = index * BATCH_STAGGER
      arrivals.set(key, now + startsIn)
      const spot = lane.get(batch.key)
      if (spot && spot.boardsAt === undefined && !Number.isNaN(spot.x)) {
        spot.boardsAt = now + startsIn
        flights.set(key, { x: spot.x, pitch: spot.pitch })
      }
      return startsIn + batchLandsAfter(layout, batch, flights.get(key), rackX)
    })
  }, [])

  /** A batch was broadcast: it joins the lane with its name on it */
  const showPending = useCallback((batch: PendingBlobBatch) => {
    if (playback.current.still) return
    playback.current.lane.set(
      batch.key,
      pendingSpot(batch, performance.now() / 1000),
    )
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
    showPending,
    handlers: {
      onPointerMove,
      // a tap has no hover before it, so it finds its batch on the way down
      onPointerDown: onPointerMove,
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
 * The belt slides at the start of a slot, batches drop as they come, and the
 * lane changes as batches join and leave it; tiles fade in when the first
 * blocks come and fade as a poster is picked
 */
function isMoving(playback: Playback, scene: BeltScene, now: number) {
  const intoSlot = (playback.progress % 1) * SLOT_SECONDS
  if (intoSlot < SLIDE_TIME || playback.laneMoving) return true
  if (revealed(playback.revealedAt, now) < 1) return true
  if (!isEmphasisSettled(playback.emphasis, scene.highlighted)) return true
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
    if (now - arrivedAt > SETTLE_TIME) {
      playback.arrivals.delete(key)
      playback.flights.delete(key)
    }
  }
}

function moveLane(playback: Playback, scene: BeltScene, now: number) {
  const dt = Math.max(0, now - playback.laneAt)
  playback.laneAt = now
  playback.laneMoving = updateLane(
    playback.lane,
    scene.pending,
    scene.layout,
    now,
    dt,
    playback.still,
  )
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
