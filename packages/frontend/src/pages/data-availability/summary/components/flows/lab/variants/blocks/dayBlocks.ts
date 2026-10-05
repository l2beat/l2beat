import { DAY_SECONDS, SLOT_SECONDS, SLOTS_PER_DAY } from '../../model'
import type { LabBatch } from '../../schedule'

/** When Ethereum's slot 0 began, in unix seconds */
const GENESIS_TIME = 1606824023

/** A block holds at most 21 blobs, so it never gets this many batches */
const KEYS_PER_BLOCK = 32

/**
 * The day's batches sorted into the blocks they land in, so drawing a block
 * reads its own few batches instead of searching the whole day.
 *
 * Playback loops the day, so a block is counted on a running clock: block
 * `b` is slot `b mod 7200` of the day, replayed.
 */
export interface DayBlocks {
  /** Slot `s` of the day holds batches `firstBatch[s]` up to `firstBatch[s + 1]` */
  firstBatch: Int32Array
  /** For every batch, the blobs it lands on top of in its block */
  blobsBelow: Uint8Array
  /** The blobs every slot of the day ends up with */
  blobsInSlot: Uint8Array
  /** Ethereum's number for the slot the day starts in */
  firstSlotNumber: number
  /** Every poster's batch times, in seconds into the day, by poster index */
  batchTimesByPoster: Float64Array[]
}

export function sortIntoBlocks(
  batches: LabBatch[],
  dayStart: number,
): DayBlocks {
  const firstBatch = new Int32Array(SLOTS_PER_DAY + 1)
  const blobsBelow = new Uint8Array(batches.length)
  const blobsInSlot = new Uint8Array(SLOTS_PER_DAY)

  // batches come sorted by time, so by slot too
  let index = 0
  for (let slot = 0; slot < SLOTS_PER_DAY; slot++) {
    firstBatch[slot] = index
    let blobs = 0
    for (;;) {
      const batch = batches[index]
      if (batch?.slot !== slot) break
      blobsBelow[index] = blobs
      blobs += batch.blobs
      index++
    }
    blobsInSlot[slot] = blobs
  }
  firstBatch[SLOTS_PER_DAY] = index

  return {
    firstBatch,
    blobsBelow,
    blobsInSlot,
    batchTimesByPoster: groupTimesByPoster(batches),
    // the day starts a second into a slot; each slot of the day takes the
    // number of the one it shares 11 of its 12 seconds with
    firstSlotNumber: Math.floor((dayStart - GENESIS_TIME) / SLOT_SECONDS),
  }
}

function groupTimesByPoster(batches: LabBatch[]): Float64Array[] {
  const times: number[][] = []
  for (const batch of batches) {
    let own = times[batch.posterIndex]
    if (!own) {
      own = []
      times[batch.posterIndex] = own
    }
    own.push(batch.time)
  }
  return Array.from(times, (own) => Float64Array.from(own ?? []))
}

/** Playback time of the poster's first batch at or after `time`, as the day loops */
export function nextBatchOf(
  blocks: DayBlocks,
  posterIndex: number,
  time: number,
): number | undefined {
  const times = blocks.batchTimesByPoster[posterIndex]
  const first = times?.[0]
  if (!times || first === undefined) return undefined
  const dayStart = Math.floor(time / DAY_SECONDS) * DAY_SECONDS
  let low = 0
  let high = times.length
  while (low < high) {
    const middle = (low + high) >>> 1
    if ((times[middle] ?? 0) < time - dayStart) low = middle + 1
    else high = middle
  }
  const later = times[low]
  return later === undefined ? dayStart + DAY_SECONDS + first : dayStart + later
}

export function daySlotOf(block: number): number {
  return ((block % SLOTS_PER_DAY) + SLOTS_PER_DAY) % SLOTS_PER_DAY
}

/** Seconds of playback at which the day a block belongs to starts */
export function dayOffsetOf(block: number): number {
  return Math.floor(block / SLOTS_PER_DAY) * DAY_SECONDS
}

export function slotNumberOf(blocks: DayBlocks, block: number): number {
  return blocks.firstSlotNumber + daySlotOf(block)
}

/** Names one batch in one block of playback, as the day loops */
export function batchKey(block: number, indexInBlock: number): number {
  return block * KEYS_PER_BLOCK + indexInBlock
}

/** The block a batch key belongs to, and the batch's index in `batches` */
export function readBatchKey(
  blocks: DayBlocks,
  key: number,
): { block: number; batchIndex: number } {
  const block = Math.floor(key / KEYS_PER_BLOCK)
  const indexInBlock = key - block * KEYS_PER_BLOCK
  const first = blocks.firstBatch[daySlotOf(block)] ?? 0
  return { block, batchIndex: first + indexInBlock }
}

/** Blobs per block over the `count` blocks sealed before `block` */
export function averageBlobsBefore(
  blocks: DayBlocks,
  block: number,
  count: number,
): number {
  let blobs = 0
  for (let back = 1; back <= count; back++) {
    blobs += blocks.blobsInSlot[daySlotOf(block - back)] ?? 0
  }
  return blobs / count
}
