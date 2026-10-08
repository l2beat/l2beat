import { SLOT_SECONDS } from '@l2beat/shared-pure'
import type { BeltLayout } from './beltLayout'
import type { Playback } from './beltScene'
import { easeInOutCubic, smoothstep } from './motion'

/**
 * Seconds the belt takes to bring the next block into the bay. The belt
 * stands still the rest of the slot: moving a rack's width in 12 seconds,
 * it would crawl a pixel at a time
 */
export const SLIDE_TIME = 0.7

/** Where the belt stands at a moment: which block is in the bay, and where every rack goes */
export interface BeltPosition {
  /** The block in the bay: the one being made, or one looked back at */
  current: number
  /** The slot being made, live or not. Racks from it on are still empty */
  made: number
  /** Seconds into the slot being made */
  intoSlot: number
  /** 0–1 while the bay takes its new block and lets go of the last */
  handover: number
  /** 0–1 while the rack of the slot being made seals, at the start of its slot */
  sealing: number
  /** The bay holds a block from the past rather than the one being made */
  lookingBack: boolean
  first: number
  last: number
  /** Left edge of the rack in the bay, on a whole device pixel */
  bayRackLeft: number
  /** Left edge of the bay itself, which stays put as racks slide through it */
  bayLeft: number
}

export function beltAt(
  playback: Playback,
  layout: BeltLayout,
  density: number,
): BeltPosition {
  const made = Math.floor(playback.progress)
  const intoSlot = (playback.progress - made) * SLOT_SECONDS
  const sealing = playback.still
    ? 1
    : easeInOutCubic(Math.min(1, intoSlot / SLIDE_TIME))
  // Looking back, the belt goes wherever it is taken, a slot at a time or
  // between two, so the rack in the bay is the next one it is heading for
  const current = playback.view === undefined ? made : Math.ceil(playback.view)
  const handover =
    playback.view === undefined ? sealing : 1 - (current - playback.view)
  const bayLeft = layout.bayX - layout.rackWidth / 2
  // the new block comes from one place to the right, where it waited
  const exactLeft = bayLeft + (1 - handover) * layout.blockPitch
  // Snapped, so outlines stay crisp. All racks share the offset and move as one
  const snap = (x: number) => Math.round(x * density) / density
  const bayRackLeft = snap(exactLeft)
  return {
    current,
    made,
    intoSlot,
    handover,
    sealing,
    lookingBack: current < made,
    first:
      current - Math.ceil((bayRackLeft + layout.rackWidth) / layout.blockPitch),
    last: current + Math.ceil((layout.width - bayRackLeft) / layout.blockPitch),
    bayRackLeft,
    bayLeft: snap(bayLeft),
  }
}

/**
 * Where a live belt stands, as a view would put it: the slot in the bay less
 * how far the next one has yet to come. A view headed back to live goes here
 */
export function livePosition(progress: number): number {
  const made = Math.floor(progress)
  const intoSlot = (progress - made) * SLOT_SECONDS
  return made - 1 + easeInOutCubic(Math.min(1, intoSlot / SLIDE_TIME))
}

/** How sealed a rack looks: 1 for a made block, 0 for one still to come */
export function sealedness(belt: BeltPosition, slot: number) {
  if (slot < belt.made) return 1
  if (slot > belt.made) return 0
  return belt.sealing
}

export function rackLeft(belt: BeltPosition, layout: BeltLayout, slot: number) {
  return belt.bayRackLeft + (slot - belt.current) * layout.blockPitch
}

/** How lit a block is by the bay: fully while made, easing in and out at handover */
export function bayLight(belt: BeltPosition, slot: number) {
  if (slot === belt.current) return belt.handover
  if (slot === belt.current - 1) return 1 - belt.handover
  return 0
}

/** How visible something spanning `left`–`right` is, as the belt fades out at its ends */
export function presenceAtEnds(
  layout: BeltLayout,
  left: number,
  right: number,
) {
  return Math.min(
    smoothstep(left / layout.fadeLeft),
    smoothstep((layout.width - right) / layout.fadeRight),
  )
}
