import type { HeadBlock, TodaySoFar } from '../../live/types'
import { BLOB_BYTES, SLOT_SECONDS } from './format'

/** Rates over the blocks the stream keeps, so one quiet block does not swing them */
export interface WindowRates {
  slots: number
  minutes: number
  bytesPerSecond: number
  blobsPerBlock: number
  gasPerSecond: number
  tps: number
  uops: number
}

export function getWindowRates(blocks: HeadBlock[]): WindowRates | undefined {
  if (blocks.length === 0) return undefined
  const seconds = blocks.length * SLOT_SECONDS
  const proposed = blocks.filter((b) => b.status === 'proposed')
  const blobs = sum(blocks, (b) => b.blobCount)
  return {
    slots: blocks.length,
    minutes: seconds / 60,
    bytesPerSecond: (blobs * BLOB_BYTES) / seconds,
    blobsPerBlock: proposed.length === 0 ? 0 : blobs / proposed.length,
    gasPerSecond: sum(blocks, (b) => b.gasUsed) / seconds,
    tps: sum(blocks, (b) => b.txCount) / seconds,
    uops: sum(blocks, (b) => b.uopsCount) / seconds,
  }
}

/** Today's running totals, as rates comparable with the complete days before it */
export function getTodayRates(today: TodaySoFar | undefined) {
  if (!today || today.slots === 0) return undefined
  const seconds = today.slots * SLOT_SECONDS
  return {
    bytesPerSecond: (today.blobs * BLOB_BYTES) / seconds,
    blobsPerBlock: today.blocks === 0 ? 0 : today.blobs / today.blocks,
    gasPerSecond: today.gasUsed / seconds,
    tps: today.txs / seconds,
    uops: today.uops / seconds,
  }
}

export function sum<T>(items: T[], pick: (item: T) => number) {
  let total = 0
  for (const item of items) total += pick(item)
  return total
}

export function median(values: number[]) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? (sorted[middle] ?? 0)
    : ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
}

export function average(values: number[]) {
  return values.length === 0 ? 0 : sum(values, (v) => v) / values.length
}
