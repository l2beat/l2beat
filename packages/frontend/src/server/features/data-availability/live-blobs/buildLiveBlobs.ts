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
  LIVE_LAG_SLOTS,
  PULSE_BUCKET_SLOTS,
  PULSE_BUCKETS,
  WINDOW_SLOTS,
} from './liveBlobsSlots'

/**
 * Slots behind the head a reorg may still rewrite. The backend follows reorgs
 * 32 blocks deep; two epochs on, the chain is final
 */
const UNSETTLED_SLOTS = 64

export interface LiveBlobsRows {
  stored: LiveSlotRange | undefined
  inWindow: LiveSlotRange | undefined
  blocks: LiveBlockRecord[]
  /** In block order */
  batches: LiveBlobBatchRecord[]
  posted: LivePostedRecord[]
  buckets: LiveBucketRecord[]
  pulse: LiveBlockBucketRecord[]
}

/**
 * The backend stores blocks without a gap in block number, so a slot with no
 * block between the oldest stored one and the head was missed.
 */
export function buildLiveBlobs(
  rows: LiveBlobsRows,
  head: number,
  now: number,
): LiveBlobs {
  // the oldest stored at all, not in the window: a window whose first slot was
  // missed is still whole
  const oldest = Math.max(rows.stored?.from ?? head, head - WINDOW_SLOTS + 1)
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

export interface PastBlobsRows {
  stored: LiveSlotRange | undefined
  blocks: LiveBlockRecord[]
  /** In block order */
  batches: LiveBlobBatchRecord[]
}

/**
 * The backend stores without a gap, so every slot in the day up to the head is
 * known: the page is complete once none of them can be rewritten.
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

/** Give or take a few missed slots */
export function isLive(head: number, now: number) {
  return slotAt(now) - head <= LIVE_LAG_SLOTS
}

/**
 * Buckets are counted from genesis, so they stay put as the head moves on; the
 * oldest, cut by the window's edge, is left out.
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

/** Steps are fixed from genesis, so a new block changes only the last one */
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

/** Both ends included */
function slotsBack(from: number, downTo: number) {
  return Array.from(
    { length: Math.max(0, from - downTo + 1) },
    (_, i) => from - i,
  )
}
