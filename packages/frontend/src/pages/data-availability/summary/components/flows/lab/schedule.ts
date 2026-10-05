import {
  DAY_SECONDS,
  type LabPoster,
  SLOT_SECONDS,
  SLOTS_PER_DAY,
} from './model'

/** One blob transaction: a project's batch landing in a block */
export interface LabBatch {
  /** Seconds into the day */
  time: number
  /** The 12-second slot of the day, so the block, it lands in */
  slot: number
  /** Index into `LabData.posters` */
  posterIndex: number
  /** Whole blobs, at least one */
  blobs: number
}

/**
 * Makes up the batches of the day. What is known is how much each project
 * posted in every hour and how often it sends a batch on average, not when
 * each batch went out. So every hour is cut into batches of the project's
 * average size, spread over the hour with some jitter. Each hour still adds up
 * to what it really posted, so a project's bursts stay where they were.
 *
 * Seeded, so every visit plays the same day.
 */
export function scheduleBatches(
  posters: LabPoster[],
  maxBlobsPerBlock: number,
  seed = 4844,
): LabBatch[] {
  const random = mulberry32(seed)
  const batches: LabBatch[] = []

  posters.forEach((poster, posterIndex) => {
    const perBatch = Math.max(1, poster.cadence.blobsPerBatch)
    const hourSeconds = DAY_SECONDS / poster.blobsHourly.length
    // blobs are whole, so what an hour cannot round up to one goes on
    let carried = 0
    poster.blobsHourly.forEach((exact, hour) => {
      const blobs = Math.floor(exact + carried)
      carried = exact + carried - blobs
      if (blobs <= 0) return

      const count = Math.max(1, Math.round(blobs / perBatch))
      const sizes = splitWhole(blobs, count, random)
      const spacing = hourSeconds / count
      const phase = random()
      sizes.forEach((size, i) => {
        const jitter = (random() - 0.5) * 0.7
        // Wrapped round the hour rather than cut at its edges: cut, every
        // batch jittered past an edge would land on it, and projects that
        // post once an hour would all pile into its first block
        const offset = wrap((i + phase + jitter) * spacing, hourSeconds)
        const time = hour * hourSeconds + offset
        batches.push({ time, slot: 0, posterIndex, blobs: size })
      })
    })
  })

  batches.sort((a, b) => a.time - b.time)
  return fitIntoBlocks(batches, maxBlobsPerBlock)
}

/**
 * A block holds only so many blobs, so a batch that does not fit waits for
 * the next block with room, as it would in the mempool.
 */
function fitIntoBlocks(batches: LabBatch[], maxBlobsPerBlock: number) {
  const filled = new Uint8Array(SLOTS_PER_DAY)
  const fitted: LabBatch[] = []
  for (const batch of batches) {
    const blobs = Math.min(batch.blobs, maxBlobsPerBlock)
    let slot = Math.floor(batch.time / SLOT_SECONDS)
    while (
      slot < SLOTS_PER_DAY &&
      (filled[slot] ?? 0) + blobs > maxBlobsPerBlock
    ) {
      slot++
    }
    if (slot >= SLOTS_PER_DAY) continue
    filled[slot] = (filled[slot] ?? 0) + blobs
    const time = Math.max(batch.time, slot * SLOT_SECONDS)
    fitted.push({ ...batch, time, slot, blobs })
  }
  return fitted.sort((a, b) => a.time - b.time || a.posterIndex - b.posterIndex)
}

/**
 * Visits every batch sent in [from, to), both in seconds of playback. The
 * day plays on a loop, so times past its end start it over and every visit
 * gets the batch's time on that same running clock.
 */
export function forEachBatchBetween(
  batches: LabBatch[],
  from: number,
  to: number,
  visit: (batch: LabBatch, time: number) => void,
) {
  if (to <= from) return
  let dayStart = Math.floor(from / DAY_SECONDS) * DAY_SECONDS
  while (dayStart < to) {
    const start = Math.max(from - dayStart, 0)
    const end = Math.min(to - dayStart, DAY_SECONDS)
    for (let i = firstBatchAt(batches, start); i < batches.length; i++) {
      const batch = batches[i]
      if (!batch || batch.time >= end) break
      visit(batch, dayStart + batch.time)
    }
    dayStart += DAY_SECONDS
  }
}

/** Index of the first batch sent at or after `time` (seconds into the day) */
export function firstBatchAt(batches: LabBatch[], time: number): number {
  let low = 0
  let high = batches.length
  while (low < high) {
    const middle = (low + high) >>> 1
    if ((batches[middle]?.time ?? Number.POSITIVE_INFINITY) < time)
      low = middle + 1
    else high = middle
  }
  return low
}

/**
 * Where playback starts: at the time of day it is now. The day shown is
 * yesterday, so this replays what was happening at this hour a day ago.
 */
export function getPlaybackStart(): number {
  return (Date.now() / 1000) % DAY_SECONDS
}

/** Splits `total` into `count` whole parts as even as can be, larger ones scattered */
function splitWhole(total: number, count: number, random: () => number) {
  const base = Math.floor(total / count)
  const sizes = Array<number>(count).fill(base)
  let remainder = total - base * count
  while (remainder > 0) {
    const i = Math.floor(random() * count)
    sizes[i] = (sizes[i] ?? base) + 1
    remainder--
  }
  return sizes
}

function wrap(value: number, length: number) {
  return ((value % length) + length) % length
}

/** A small, fast seeded random generator */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
