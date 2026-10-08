import type {
  LiveBlobBatchRecord,
  LiveBlockBucketRecord,
  LiveBlockRecord,
  LiveBucketRecord,
  LivePostedRecord,
  LiveSlotRange,
} from '@l2beat/database'
import { slotAt } from '@l2beat/shared-pure'
import type {
  LiveBlobs,
  LiveBlock,
  PastBlobs,
  Posted,
  PostedWindow,
  Pulse,
} from './LiveBlobsFeed'
import {
  BELT_SLOTS,
  BUCKET_SLOTS,
  BUCKETS,
  PULSE_BUCKET_SLOTS,
  PULSE_BUCKETS,
  WINDOW_SLOTS,
} from './liveBlobsSlots'

/**
 * Slots the head may trail the clock and still be live: the slot under way,
 * whose block has not come yet, and two missed in a row
 */
const LIVE_LAG_SLOTS = 3
/**
 * Slots behind the head the backend may still rewrite: on a reorg a slot that
 * had a block may lose it, and one that was missed may get one. The backend
 * follows reorgs 32 blocks deep; two epochs on, the chain is final
 */
const UNSETTLED_SLOTS = 64

/** The rows a snapshot is made of, read back from one head */
export interface LiveBlobsRows {
  /** Every stored slot: how far back the database reaches */
  stored: LiveSlotRange | undefined
  /** The stored slots of the window */
  inWindow: LiveSlotRange | undefined
  /** Of the last `BELT_SLOTS` slots */
  blocks: LiveBlockRecord[]
  /** Of the last `BELT_SLOTS` slots, in block order */
  batches: LiveBlobBatchRecord[]
  /** Over the window */
  posted: LivePostedRecord[]
  /** Over the window, `BUCKET_SLOTS` wide */
  buckets: LiveBucketRecord[]
  /** Over the window, `PULSE_BUCKET_SLOTS` wide */
  pulse: LiveBlockBucketRecord[]
}

/**
 * What the page is served, made from the rows alone. The backend stores
 * blocks without a gap in block number, so a slot with no block between the
 * oldest stored one and the head was missed.
 */
export function buildLiveBlobs(
  rows: LiveBlobsRows,
  head: number,
  now: number,
): LiveBlobs {
  // the oldest stored at all, not in the window: a window whose first slot was
  // missed is still whole
  const oldest = Math.max(rows.stored?.from ?? head, head - WINDOW_SLOTS + 1)
  /** The last `count` slots, newest first, as far back as the database reaches */
  const recentSlots = (count: number) =>
    slotsBack(head, Math.max(oldest, head - count + 1))
  const blocks = new Map(rows.blocks.map((block) => [block.slot, block]))
  const batches = Map.groupBy(rows.batches, (batch) => batch.slot)

  const belt = recentSlots(BELT_SLOTS).map((slot) =>
    toLiveBlock(slot, blocks.get(slot), batches.get(slot)),
  )

  return {
    head,
    live: isLive(head, now),
    blocks: belt,
    window: {
      slots: head - oldest + 1,
      blocks: rows.inWindow?.blocks ?? 0,
      newestBlobs: blocks.get(head)?.blobCount ?? 0,
      pulse: pulseOf(rows.pulse, head),
      ...postedWithBuckets(rows, head),
    },
  }
}

/** The rows of one page of the day, read back from one head */
export interface PastBlobsRows {
  stored: LiveSlotRange | undefined
  /** Of the page's slots */
  blocks: LiveBlockRecord[]
  /** Of the page's slots, in block order */
  batches: LiveBlobBatchRecord[]
}

/**
 * The page's slots that are still in the day and not past the head, newest
 * first. The backend stores without a gap, so every such slot is known: the
 * page is complete once the backend can no longer rewrite any of them.
 */
export function buildPastBlobs(
  rows: PastBlobsRows,
  head: number,
  first: number,
  last: number,
): PastBlobs {
  const oldest = Math.max(rows.stored?.from ?? head, head - WINDOW_SLOTS + 1)
  const blocks = new Map(rows.blocks.map((block) => [block.slot, block]))
  const batches = Map.groupBy(rows.batches, (batch) => batch.slot)
  return {
    blocks: slotsBack(Math.min(last, head), Math.max(first, oldest)).map(
      (slot) => toLiveBlock(slot, blocks.get(slot), batches.get(slot)),
    ),
    complete: last < head - UNSETTLED_SLOTS,
  }
}

function toLiveBlock(
  slot: number,
  block: LiveBlockRecord | undefined,
  batches: LiveBlobBatchRecord[] = [],
): LiveBlock {
  if (!block) return { slot, status: 'missed' }
  return {
    slot,
    status: 'proposed',
    blockNumber: block.blockNumber,
    hash: block.hash,
    batches: batches.map((batch) => ({
      projectId: batch.projectId,
      blobs: batch.blobs,
      to: batch.to,
      txHash: batch.txHash,
    })),
  }
}

/** Whether a head is as new as the chain can be at `now`, give or take a few missed slots */
export function isLive(head: number, now: number) {
  return slotAt(now) - head <= LIVE_LAG_SLOTS
}

/**
 * Each poster, most blobs first, with the bucket under way and the ones
 * before it. Buckets are counted from genesis, so they stay put as the head
 * moves on; the oldest, cut by the window's edge, is left out.
 */
function postedWithBuckets(
  rows: LiveBlobsRows,
  head: number,
): Pick<PostedWindow, 'firstBucket' | 'posted'> {
  const firstBucket = Math.floor(head / BUCKET_SLOTS) - BUCKETS + 1
  const bucketsOf = Map.groupBy(rows.buckets, (bucket) => bucket.projectId)
  const posted = rows.posted.map((record): Posted => {
    const buckets = Array<number>(BUCKETS).fill(0)
    for (const { bucket, blobs } of bucketsOf.get(record.projectId) ?? []) {
      const i = bucket - firstBucket
      if (i >= 0 && i < BUCKETS) buckets[i] = blobs
    }
    return { ...record, buckets }
  })
  // ties go to the newer, so rows with equal totals do not swap on every read
  posted.sort((a, b) => b.blobs - a.blobs || b.lastSlot - a.lastSlot)
  return { firstBucket, posted }
}

/**
 * The day under the belt in steps fixed from genesis, as the posters' buckets
 * are, so a new block changes only the last step and the rest stay put
 */
function pulseOf(records: LiveBlockBucketRecord[], head: number): Pulse {
  const firstBucket = Math.floor(head / PULSE_BUCKET_SLOTS) - PULSE_BUCKETS + 1
  const buckets = Array.from({ length: PULSE_BUCKETS }, () => ({
    blocks: 0,
    blobs: 0,
  }))
  for (const { bucket, blocks, blobs } of records) {
    const i = bucket - firstBucket
    if (i >= 0 && i < PULSE_BUCKETS) buckets[i] = { blocks, blobs }
  }
  return { firstBucket, buckets }
}

/** From `from` down to `downTo`, both included */
function slotsBack(from: number, downTo: number) {
  return Array.from(
    { length: Math.max(0, from - downTo + 1) },
    (_, i) => from - i,
  )
}
