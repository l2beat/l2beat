import {
  type MouseEvent,
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
import { livePosition, SLIDE_TIME } from './beltPosition'
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
  /**
   * In the belt's box: the pointer, or the top middle of a pinned batch
   */
  x: number
  y: number
  /**
   * Shown by a tap rather than a hovering pointer, so it stays with its batch
   * until another tap, and can be tapped itself
   */
  pinned: boolean
}

interface Options {
  canvasRef: RefObject<HTMLCanvasElement | null>
  scene: BeltScene | undefined
  /** Slots since genesis on the chain's clock, now */
  progressNow: () => number
  /** For reduced motion: nothing slides or falls */
  still: boolean
  /** The slot to bring into the bay, looking back; undefined to follow the chain */
  view: number | undefined
  onScreen: boolean
  /** A batch was clicked, or tapped while its tooltip was pinned */
  onClickBatch: (key: number) => void
}

/**
 * Runs the belt: keeps it on the chain's clock, or takes it back through the
 * hour, drops a block's batches in as it comes, paints each frame and finds
 * the batch under the pointer.
 *
 * Nothing here sets state per frame; only a change of hovered batch renders,
 * or a pinned batch moving with the belt. Nor does it paint a frame that would look like the last one: for most of
 * a slot nothing on the belt moves, and each paint redraws the whole canvas.
 */
export function useBelt({
  canvasRef,
  scene,
  progressNow,
  still,
  view,
  onScreen,
  onClickBatch,
}: Options) {
  const playback = useRef<Playback>({
    progress: progressNow(),
    arrivals: new Map(),
    still,
    revealedAt: undefined,
    view,
  })
  playback.current.still = still
  const viewTarget = useRef(view)
  viewTarget.current = view
  const frame = useRef<BeltFrame>({
    hits: [],
    landed: [],
  })
  const sceneRef = useRef(scene)
  sceneRef.current = scene
  const pointer = useRef<{ x: number; y: number } | undefined>(undefined)
  const hoveredKey = useRef<number | undefined>(undefined)
  const [hover, setHover] = useState<BeltHover>()
  const pinned = useRef<{ key: number; x: number; y: number }>(undefined)
  const tapped = useRef(false)
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
    if (pinned.current) return
    const at = pointer.current
    const hit = at
      ? findBatchAt(frame.current.hits, sceneRef.current, at)
      : undefined
    const key = hit?.key
    if (key === hoveredKey.current) return
    hoveredKey.current = key
    const canvas = canvasRef.current
    if (canvas) canvas.style.cursor = key === undefined ? '' : 'pointer'
    setHover(
      key === undefined || !at ? undefined : { key, ...at, pinned: false },
    )
  }, [canvasRef])

  /** Pins the tooltip to `hit`'s batch, or lets it go */
  const pin = useCallback((hit: BatchHit | undefined) => {
    const anchor = hit && { key: hit.key, ...topMiddle(hit) }
    pinned.current = anchor
    hoveredKey.current = anchor?.key
    setHover(anchor && { ...anchor, pinned: true })
  }, [])

  /** Keeps a pinned tooltip on its batch as the belt slides, until it leaves */
  const followPinned = useCallback(() => {
    const anchor = pinned.current
    if (!anchor) return
    const hit = frame.current.hits.find((h) => h.key === anchor.key)
    if (!hit) return pin(undefined)
    const { x, y } = topMiddle(hit)
    if (x !== anchor.x || y !== anchor.y) pin(hit)
  }, [pin])

  const running = onScreen && scene !== undefined
  useAnimationFrame((dt, now) => {
    const current = sceneRef.current
    if (!current) return
    const play = playback.current
    forgetSettled(play, now)
    if (play.revealedAt === undefined && current.blocks.size > 0) {
      play.revealedAt = now
    }
    play.progress = progressNow()
    const viewWas = play.view
    play.view = travel(play, viewTarget.current, dt)
    if (
      play.view !== viewWas ||
      isMoving(play, now) ||
      !isPainted(painted.current, current, hoveredKey.current, play)
    ) {
      paint(current, now, hoveredKey.current)
    }
    followPinned()
    // the belt moves under a pointer that does not
    findHover()
  }, running)

  // a tap anywhere off the belt lets a pinned tooltip go
  useEffect(() => {
    const onDocumentDown = (event: globalThis.PointerEvent) => {
      const belt = canvasRef.current?.parentElement
      if (pinned.current && !belt?.contains(event.target as Node)) {
        pin(undefined)
      }
    }
    document.addEventListener('pointerdown', onDocumentDown)
    return () => document.removeEventListener('pointerdown', onDocumentDown)
  }, [canvasRef, pin])

  // Off screen, no frames come: paint whenever what is drawn changes, with no
  // fades on the way, and again once the site's font is in, as canvas text
  // cannot swap fonts by itself
  const hoveredNow = hover?.key
  useEffect(() => {
    if (running || !scene) return
    let cancelled = false
    const play = playback.current
    if (scene.blocks.size > 0) play.revealedAt ??= Number.NEGATIVE_INFINITY
    play.view = view
    paint(scene, performance.now() / 1000, hoveredNow)
    void document.fonts?.ready.then(() => {
      if (!cancelled) paint(scene, performance.now() / 1000, hoveredNow)
    })
    return () => {
      cancelled = true
    }
  }, [running, paint, scene, hoveredNow, view])

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

  // A finger shows nothing on the way down, as that may be the start of a
  // scroll, and has no hover to follow: only a finished tap does anything
  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'touch') return
      if (pinned.current) pin(undefined)
      const at = pointInBox(event)
      pointer.current = at
      findHover()
      // the tooltip follows the pointer across the batch
      if (hoveredKey.current !== undefined) {
        setHover((current) => current && { ...current, ...at })
      }
    },
    [findHover, pin],
  )
  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      tapped.current = event.pointerType === 'touch'
      onPointerMove(event)
    },
    [onPointerMove],
  )
  const onPointerLeave = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'touch') return
      pointer.current = undefined
      findHover()
    },
    [findHover],
  )
  // A tap pins the batch's tooltip, as a finger cannot read it before it
  // lands; a second tap on the same batch acts on it
  const onClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!tapped.current) {
        const key = hoveredKey.current
        if (key !== undefined) onClickBatch(key)
        return
      }
      const hit = findBatchAt(
        frame.current.hits,
        sceneRef.current,
        pointInBox(event),
      )
      if (hit && hit.key === pinned.current?.key) onClickBatch(hit.key)
      else pin(hit)
    },
    [onClickBatch, pin],
  )

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

/** Seconds the belt takes to cover most of the way to where it is taken */
const TRAVEL_TIME = 0.12
/** Slots off where it is going that the belt counts as there */
const ARRIVED_WITHIN = 0.002

/**
 * Where the belt stands this frame as it goes where it is taken: quickly at
 * first, then easing in, so a long jump back through the hour still reads as
 * a move along the belt. Headed back to live, it goes for where the live belt
 * is, and is live again once it gets there
 */
function travel(
  playback: Playback,
  target: number | undefined,
  dt: number,
): number | undefined {
  if (playback.still) return target
  if (target === undefined && playback.view === undefined) return undefined
  const live = livePosition(playback.progress)
  const to = target ?? live
  const from = playback.view ?? live
  const next = from + (to - from) * (1 - Math.exp(-dt / TRAVEL_TIME))
  if (Math.abs(to - next) > ARRIVED_WITHIN) return next
  return target
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

function pointInBox(event: MouseEvent<HTMLElement>) {
  const box = event.currentTarget.getBoundingClientRect()
  return { x: event.clientX - box.left, y: event.clientY - box.top }
}

function topMiddle(hit: BatchHit) {
  return { x: (hit.left + hit.right) / 2, y: hit.top }
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
