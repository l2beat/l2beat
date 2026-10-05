import { SLOT_SECONDS } from '../../model'
import type { BeltLayout } from './beltLayout'
import type { Playback } from './beltScene'
import { smoothstep } from './motion'

/**
 * Seconds the bay takes to hand over to the next block. On the wall clock,
 * so a belt held still by a hover never stops with two blocks half lit
 */
const HANDOVER_TIME = 0.16

/** Where the belt stands at a moment: which block is in the bay, and where every rack goes */
export interface BeltPosition {
  /** The block in the bay, on playback's running count */
  current: number
  /** How far that block is into its 12 seconds, 0–1 */
  phase: number
  /** 0–1 while the bay lights up its new block and lets go of the last */
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
  now: number,
): BeltPosition {
  const progress = playback.time / SLOT_SECONDS
  const current = Math.floor(progress)
  const phase = progress - current
  // Snapped, so outlines stay crisp. All racks share the offset and move as one
  const exactLeft =
    layout.bayX + (0.5 - phase) * layout.blockPitch - layout.rackWidth / 2
  const bayRackLeft = Math.round(exactLeft * density) / density
  return {
    current,
    phase,
    handover: smoothstep((now - playback.bayChangedAt) / HANDOVER_TIME),
    first:
      current - Math.ceil((bayRackLeft + layout.rackWidth) / layout.blockPitch),
    last: current + Math.ceil((layout.width - bayRackLeft) / layout.blockPitch),
    bayRackLeft,
  }
}

export function rackLeft(
  belt: BeltPosition,
  layout: BeltLayout,
  block: number,
) {
  return belt.bayRackLeft + (block - belt.current) * layout.blockPitch
}

/** How lit a block is by the bay: fully while built, easing in and out at handover */
export function bayLight(belt: BeltPosition, block: number) {
  if (block === belt.current) return belt.handover
  if (block === belt.current - 1) return 1 - belt.handover
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
