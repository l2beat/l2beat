import type {
  LiveBlobBatchRecord,
  LiveBlockBucketRecord,
  LiveBlockRecord,
  LiveBucketRecord,
  LivePostedRecord,
} from '@l2beat/database'
import {
  ProjectId,
  SLOT_SECONDS,
  slotProgressAt,
  slotStart,
  UnixTime,
} from '@l2beat/shared-pure'
import type { LiveBlobsSource } from './LiveBlobsFeed'

/** About when a real block is stored, into its slot */
const STORED_INTO_SLOT = 2
/** As the backend keeps them: a little over a day */
const KEPT_SLOTS = 7500
const MAX_BLOBS = 21
const MAX_BATCHES = 7
const MAX_BATCH_BLOBS = 6
const MISSED_ONE_IN = 40
const UNATTRIBUTED_ONE_IN = 10
/** Each poster posts this much less than the one before, so a few post most, as on mainnet */
const POSTER_FALLOFF = 0.75

interface MockSlot {
  block: LiveBlockRecord
  batches: LiveBlobBatchRecord[]
}

/**
 * The live blob tables for mock mode: blocks are stored on the real
 * 12-second clock, but what each holds follows from its slot alone. Every
 * run, and every performance benchmark, then sees the same blocks without a
 * database. Reads answer as the repositories do, so the feed cannot tell.
 */
export function createMockLiveBlobsSource(
  posterIds: Promise<string[]>,
  now = () => Date.now() / 1000,
): LiveBlobsSource {
  const pickPoster = posterIds.then(createPosterPicker)
  /** The newest slot whose block, if it got one, is stored by now */
  const newestStoredSlot = () =>
    Math.floor(slotProgressAt(now()) - STORED_INTO_SLOT / SLOT_SECONDS)

  /** The stored slots from `from` to `to`, both included, that got a block */
  async function storedSlots(from: number, to: number) {
    const pick = await pickPoster
    const newest = newestStoredSlot()
    const slots: MockSlot[] = []
    for (
      let slot = Math.max(from, newest - KEPT_SLOTS + 1);
      slot <= Math.min(to, newest);
      slot++
    ) {
      const mock = mockSlot(slot, pick)
      if (mock) slots.push(mock)
    }
    return slots
  }

  const storedBatches = async (from: number, to = Number.POSITIVE_INFINITY) =>
    (await storedSlots(from, to)).flatMap((s) => s.batches)

  return {
    liveBlock: {
      findHead: async () => {
        const pick = await pickPoster
        for (let slot = newestStoredSlot(); ; slot--) {
          const mock = mockSlot(slot, pick)
          if (mock) return mock.block
        }
      },
      getSlotRange: async (fromSlot = 0) => {
        const slots = await storedSlots(fromSlot, Number.POSITIVE_INFINITY)
        const first = slots[0]
        const last = slots.at(-1)
        if (!first || !last) return undefined
        return {
          from: first.block.slot,
          to: last.block.slot,
          blocks: slots.length,
        }
      },
      getBySlotRange: async (from, to) =>
        (await storedSlots(from, to)).map((s) => s.block),
      getBucketsSince: async (fromSlot, bucketSlots) =>
        sumBlockBuckets(
          (await storedSlots(fromSlot, Number.POSITIVE_INFINITY)).map(
            (s) => s.block,
          ),
          bucketSlots,
        ),
    },
    liveBlobBatch: {
      getBySlotRange: (from, to) => storedBatches(from, to),
      getPostedSince: async (fromSlot) =>
        sumPosted(await storedBatches(fromSlot)),
      getBucketsSince: async (fromSlot, bucketSlots) =>
        sumBuckets(await storedBatches(fromSlot), bucketSlots),
    },
  }
}

/** As `LiveBlobBatchRepository.getPostedSince` sums them */
function sumPosted(batches: LiveBlobBatchRecord[]): LivePostedRecord[] {
  const byProject = new Map<ProjectId | undefined, LivePostedRecord>()
  for (const batch of batches) {
    const posted = byProject.get(batch.projectId) ?? {
      projectId: batch.projectId,
      blobs: 0,
      batches: 0,
      lastSlot: batch.slot,
      lastBlobs: 0,
    }
    // oldest first, so a later slot starts the last one over
    if (batch.slot !== posted.lastSlot) {
      posted.lastSlot = batch.slot
      posted.lastBlobs = 0
    }
    posted.blobs += batch.blobs
    posted.batches++
    posted.lastBlobs += batch.blobs
    byProject.set(batch.projectId, posted)
  }
  return [...byProject.values()]
}

/** As `LiveBlobBatchRepository.getBucketsSince` sums them */
function sumBuckets(
  batches: LiveBlobBatchRecord[],
  bucketSlots: number,
): LiveBucketRecord[] {
  const byKey = new Map<string, LiveBucketRecord>()
  for (const batch of batches) {
    const bucket = Math.floor(batch.slot / bucketSlots)
    const key = `${batch.projectId}:${bucket}`
    const record = byKey.get(key) ?? {
      projectId: batch.projectId,
      bucket,
      blobs: 0,
    }
    record.blobs += batch.blobs
    byKey.set(key, record)
  }
  return [...byKey.values()]
}

/** As `LiveBlockRepository.getBucketsSince` sums them */
function sumBlockBuckets(
  blocks: LiveBlockRecord[],
  bucketSlots: number,
): LiveBlockBucketRecord[] {
  const byBucket = new Map<number, LiveBlockBucketRecord>()
  for (const block of blocks) {
    const bucket = Math.floor(block.slot / bucketSlots)
    const record = byBucket.get(bucket) ?? { bucket, blocks: 0, blobs: 0 }
    record.blocks++
    record.blobs += block.blobCount
    byBucket.set(bucket, record)
  }
  return [...byBucket.values()]
}

/** The block of `slot` and its blob transactions, or undefined where it was missed */
function mockSlot(
  slot: number,
  pickPoster: (roll: number) => string | undefined,
): MockSlot | undefined {
  const random = seededRandom(slot)
  if (Math.floor(random() * MISSED_ONE_IN) === 0) return undefined
  const blockNumber = slot - 1_000_000
  const batches: LiveBlobBatchRecord[] = []
  let blobs = 0
  const batchCount = 1 + Math.floor(random() * MAX_BATCHES)
  for (let i = 0; i < batchCount && blobs < MAX_BLOBS; i++) {
    const size = Math.min(
      MAX_BLOBS - blobs,
      1 + Math.floor(random() * MAX_BATCH_BLOBS),
    )
    const unattributed = Math.floor(random() * UNATTRIBUTED_ONE_IN) === 0
    const projectId = unattributed ? undefined : pickPoster(random())
    batches.push({
      slot,
      txIndex: i,
      txHash: `0x${(slot * 7919 + i).toString(16).padStart(64, '0')}`,
      blockNumber,
      from: `0x${(slot * 31 + i).toString(16).padStart(40, '0')}`,
      to: `0x${(slot * 7919 + i).toString(16).padStart(40, '0')}`,
      blobs: size,
      topics: [],
      projectId: projectId === undefined ? undefined : ProjectId(projectId),
    })
    blobs += size
  }
  return {
    block: {
      slot,
      blockNumber,
      hash: `0x${slot.toString(16).padStart(64, '0')}`,
      timestamp: UnixTime(slotStart(slot)),
      blobCount: blobs,
    },
    batches,
  }
}

function createPosterPicker(posterIds: string[]) {
  const weights = posterIds.map((_, rank) => POSTER_FALLOFF ** rank)
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  return (roll: number) => {
    let left = roll * totalWeight
    for (const [rank, weight] of weights.entries()) {
      left -= weight
      if (left < 0) return posterIds[rank]
    }
    return posterIds.at(-1)
  }
}

/** mulberry32: small, fast, and the same numbers for the same seed */
function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32
  }
}
