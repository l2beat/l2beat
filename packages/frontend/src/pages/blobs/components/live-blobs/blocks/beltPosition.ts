import { SLOT_SECONDS } from '~/utils/beaconSlots'
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
  /** The slot being made, so the block in the bay */
  current: number
  /** Seconds into that slot */
  intoSlot: number
  /** 0–1 while the bay takes its new block and lets go of the last */
  handover: number
  first: number
  last: number
  /** Left edge of the rack in the bay, on a whole device pixel */
  bayRackLeft: number
}

export function beltAt(
  playback: Playback,
  layout: BeltLayout,
  density: number,
): BeltPosition {
  const current = Math.floor(playback.progress)
  const intoSlot = (playback.progress - current) * SLOT_SECONDS
  const handover = playback.still
    ? 1
    : easeInOutCubic(Math.min(1, intoSlot / SLIDE_TIME))
  // the new block comes from one place to the right, where it waited
  const exactLeft =
    layout.bayX - layout.rackWidth / 2 + (1 - handover) * layout.blockPitch
  // Snapped, so outlines stay crisp. All racks share the offset and move as one
  const bayRackLeft = Math.round(exactLeft * density) / density
  return {
    current,
    intoSlot,
    handover,
    first:
      current - Math.ceil((bayRackLeft + layout.rackWidth) / layout.blockPitch),
    last: current + Math.ceil((layout.width - bayRackLeft) / layout.blockPitch),
    bayRackLeft,
  }
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
