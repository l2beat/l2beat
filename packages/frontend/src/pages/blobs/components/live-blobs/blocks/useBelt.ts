import { clamp, SLOT_SECONDS } from '@l2beat/shared-pure'
import {
  type MouseEvent,
  type PointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { LIVE_LAG_SLOTS } from '~/server/features/data-availability/live-blobs/liveBlobsSlots'
import { prepareCanvas, useAnimationFrame } from '../hooks'
import { GLIDE_SLOTS } from '../lookBack'
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
  /** In the belt's box: the pointer, or the top middle of a pinned batch */
  x: number
  y: number
  /** Shown by a tap, so it stays with its batch until another tap */
  pinned: boolean
}

interface Options {
  canvasRef: RefObject<HTMLCanvasElement | null>
  scene: BeltScene | undefined
  /** Slots since genesis */
  progressNow: () => number
  /** The head of an answer that came in live; undefined while there is none */
  liveHead: number | undefined
  /** Reduced motion */
  still: boolean
  /** Undefined to follow the chain */
  view: number | undefined
  onScreen: boolean
  /** A batch was clicked, or tapped while its tooltip was pinned */
  onClickBatch: (key: number) => void
}

/**
 * Nothing here sets state per frame; only a change of hovered or pinned batch
 * renders. Nor does it repaint a frame that would look like the last one: for
 * most of a slot nothing moves, and each paint redraws the whole canvas.
 */
export function useBelt({
  canvasRef,
  scene,
  progressNow,
  liveHead,
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
  const held = useRef<number>(undefined)
  const frame = useRef<BeltFrame>({
    hits: [],
    landed: [],
  })
  const sceneRef = useRef(scene)
  sceneRef.current = scene
  const liveHeadRef = useRef(liveHead)
  liveHeadRef.current = liveHead
  const waitingSince = useRef<number>(undefined)
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

  const findHover = () => {
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
  }

  const pin = useCallback((hit: BatchHit | undefined) => {
    const anchor = hit && { key: hit.key, ...topMiddle(hit) }
    pinned.current = anchor
    hoveredKey.current = anchor?.key
    setHover(anchor && { ...anchor, pinned: true })
  }, [])

  const followPinned = () => {
    const anchor = pinned.current
    if (!anchor) return
    const hit = frame.current.hits.find((h) => h.key === anchor.key)
    if (!hit) return pin(undefined)
    const { x, y } = topMiddle(hit)
    if (x !== anchor.x || y !== anchor.y) pin(hit)
  }

  /** A view of the past, or a finger on the belt, needs no live answer */
  const waitsForAnswer = (now: number) => {
    const following =
      viewTarget.current === undefined && held.current === undefined
    if (!following || !isOutrun(liveHeadRef.current, progressNow())) {
      waitingSince.current = undefined
      return false
    }
    waitingSince.current ??= now
    return now - waitingSince.current < MAX_WAIT
  }

  const running = onScreen && scene !== undefined
  useAnimationFrame((dt, now) => {
    const current = sceneRef.current
    if (!current || waitsForAnswer(now)) return
    const play = playback.current
    forgetSettled(play, now)
    if (play.revealedAt === undefined && current.blocks.size > 0) {
      play.revealedAt = now
    }
    play.progress = progressNow()
    const viewWas = play.view
    play.view =
      held.current === undefined
        ? travel(play, viewTarget.current, dt)
        : heldView(held.current, play.progress)
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

  // Off screen, no frames come: paint on change, with no fades, and again once
  // the site's font is in, as canvas text cannot swap fonts by itself
  const hoveredNow = hover?.key
  useEffect(() => {
    if (running || !scene) return
    if (view === undefined && isOutrun(liveHead, progressNow())) return
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
  }, [running, paint, scene, hoveredNow, view, liveHead, progressNow])

  const dropBlock = (block: ChainBlock) => {
    if (block.status !== 'proposed' || playback.current.still) return
    const now = performance.now() / 1000
    block.batches.forEach((_, index) => {
      playback.current.arrivals.set(
        batchKey(block.slot, index),
        now + index * BATCH_STAGGER,
      )
    })
  }

  // A finger shows nothing on the way down, as that may be the start of a
  // scroll, and has no hover to follow: only a finished tap does anything
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return
    if (pinned.current) pin(undefined)
    const at = pointInBox(event)
    pointer.current = at
    findHover()
    if (hoveredKey.current !== undefined) {
      setHover((current) => current && { ...current, ...at })
    }
  }
  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    tapped.current = event.pointerType === 'touch'
    onPointerMove(event)
  }
  const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return
    pointer.current = undefined
    findHover()
  }
  // A tap pins the batch's tooltip, as a finger cannot read it before it
  // lands; a second tap on the same batch acts on it
  const onClick = (event: MouseEvent<HTMLElement>) => {
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
  }

  /** No easing while held, so the belt stays under the finger */
  const hold = (slot: number | undefined) => {
    held.current = slot
  }

  const position = () =>
    playback.current.view ?? livePosition(playback.current.progress)

  const live = () => livePosition(progressNow())

  return {
    hover,
    dropBlock,
    hold,
    position,
    live,
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
   * Not how things come to rest, as with the last frame of a motion or one
   * painted before frames stopped (off screen, hidden tab)
   */
  moving: boolean
}

/**
 * Seconds the belt keeps its last frame for an answer. A request that stalls
 * never fails, so without a cap the belt would stand still for good
 */
const MAX_WAIT = 5

/**
 * A hidden tab stops polling while the clock runs on, so on its return the
 * belt would roll into racks with no blocks yet. It keeps the last frame until
 * the answer catches up; a feed that stopped being live is no reason to wait
 */
function isOutrun(liveHead: number | undefined, progress: number) {
  return (
    liveHead !== undefined && Math.floor(progress) - liveHead > LIVE_LAG_SLOTS
  )
}

/** Seconds the belt takes to cover most of the way to where it is taken */
const TRAVEL_TIME = 0.12
/** Slots off where it is going that the belt counts as there */
const ARRIVED_WITHIN = 0.002

/**
 * Eases out so a long jump through the day still reads as a move along the
 * belt. It starts at most `GLIDE_SLOTS` off, as only the racks around where it
 * lands are loaded
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
  const from = clamp(playback.view ?? live, to - GLIDE_SLOTS, to + GLIDE_SLOTS)
  const next = from + (to - from) * (1 - Math.exp(-dt / TRAVEL_TIME))
  if (Math.abs(to - next) > ARRIVED_WITHIN) return next
  return target
}

/** Held past where the live belt is, the belt is live */
function heldView(slot: number, progress: number) {
  return slot < livePosition(progress) ? slot : undefined
}

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

/** Targets reach halfway to the next rack and into the gaps, so even a one-blob batch is easy to hit */
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
