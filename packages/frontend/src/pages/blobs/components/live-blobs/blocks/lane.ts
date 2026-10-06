import type { PendingBlobBatch } from './beaconChain'
import type { BeltLayout } from './beltLayout'
import { BATCH_MOTION_TIME, DROP_STAGGER } from './motion'

/** A batch in the waiting lane, as drawn */
export interface LaneSpot {
  batch: PendingBlobBatch
  /** Left edge of its first tile, easing to where the lane puts it */
  x: number
  /** From one of its tiles to the next; tighter while the lane is crowded */
  pitch: number
  /** Wall-clock second it was broadcast, for its entrance and label; -Infinity if it was waiting already */
  shownAt: number
  /** Its block came: its tiles leave for the bay one by one from this second */
  boardsAt?: number
  /** It left the mempool without a block, as when the node dropped it */
  goneAt?: number
}

/** A spot whose batch leaves without a block fades out this long */
export const LEAVE_TIME = 0.5
/** Seconds the lane takes to close up behind a batch that left */
const CLOSE_UP_TIME = 0.15
/** About how long a tile takes along the lane, so the next do not catch up with it */
const CLEAR_TIME = 0.35
/** Closer to its place than this, a spot is there: no frame would show the rest */
const SETTLED_PX = 0.05

/**
 * Keeps the lane in step with the mempool: new batches join at the far end,
 * as the oldest wait nearest the bay, and the lane closes up behind each one
 * that leaves. A batch whose block came keeps its place until its last tile
 * has left, so the ones behind it do not run over its tiles still waiting.
 * Says whether the lane changed or is still moving, so it needs painting.
 */
export function updateLane(
  lane: Map<string, LaneSpot>,
  pending: ReadonlyMap<string, PendingBlobBatch>,
  layout: BeltLayout,
  now: number,
  dt: number,
  still: boolean,
): boolean {
  let moving = false
  // Pass 1: who is in the lane
  for (const batch of pending.values()) {
    const spot = lane.get(batch.key)
    if (!spot) {
      lane.set(batch.key, pendingSpot(batch, Number.NEGATIVE_INFINITY))
      moving = true
    } else if (spot.batch !== batch || spot.goneAt !== undefined) {
      spot.batch = batch
      spot.goneAt = undefined
      moving = true
    }
  }
  for (const [key, spot] of lane) {
    if (spot.boardsAt !== undefined) {
      const departed =
        spot.boardsAt + spot.batch.blobs * DROP_STAGGER + CLEAR_TIME
      if (now > departed) lane.delete(key)
      moving = true
    } else if (!pending.has(key)) {
      spot.goneAt ??= now
      if (now - spot.goneAt > LEAVE_TIME) lane.delete(key)
      moving = true
    } else if (now - spot.shownAt < BATCH_MOTION_TIME) {
      // dropping in, with its label up
      moving = true
    }
  }

  // Pass 2: where each goes, oldest nearest the bay, squeezed in if crowded
  const spots = [...lane.values()].sort(
    (a, b) => a.batch.firstSeenAt - b.batch.firstSeenAt,
  )
  const pitch = layout.tileSize + layout.blobGap
  const gap = Math.round(layout.tileSize * 0.6)
  const needed =
    spots.reduce((sum, spot) => sum + spot.batch.blobs * pitch + gap, 0) - gap
  const squeeze = Math.min(1, (layout.laneRight - layout.laneLeft) / needed)
  const follow = still ? 1 : 1 - Math.exp(-dt / CLOSE_UP_TIME)
  let x = layout.laneLeft
  for (const spot of spots) {
    if (spot.boardsAt === undefined) {
      spot.pitch = pitch * squeeze
      const step = Number.isNaN(spot.x) ? Number.POSITIVE_INFINITY : x - spot.x
      if (Math.abs(step) > SETTLED_PX) {
        spot.x = Number.isFinite(step) ? spot.x + step * follow : x
        moving = true
      } else spot.x = x
      x += (spot.batch.blobs * pitch + gap) * squeeze
    } else {
      // it stays where it was let go, and what waits behind it stays behind it
      x = Math.max(x, spot.x + spot.batch.blobs * spot.pitch + gap * squeeze)
    }
  }
  return moving
}

export function pendingSpot(
  batch: PendingBlobBatch,
  shownAt: number,
): LaneSpot {
  return { batch, x: Number.NaN, pitch: 0, shownAt }
}
