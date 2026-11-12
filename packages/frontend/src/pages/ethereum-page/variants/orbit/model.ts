import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { UNKNOWN_POSTER_ID } from '../../live/simulatedHead'
import type { DailyPoint } from '../../live/simulatedHistory'
import type { HeadBlock } from '../../live/types'

export const SLOT_SECONDS = 12
export const BLOB_BYTES = 131_072
export const SLOTS_PER_EPOCH = 32

/** Bodies per orbit, innermost first: the systems posting most sit closest */
export const TIER_SIZES = [4, 7, 10] as const
export const SHOWN_BODIES = TIER_SIZES.reduce((a, b) => a + b, 0)

export interface Poster {
  id: string
  name: string
  iconUrl: string | undefined
  color: string
  href: string | undefined
  isUnattributed: boolean
}

/** Blobs no tracked project claims still use the space, so they get a body too */
export const UNATTRIBUTED: Poster = {
  id: UNKNOWN_POSTER_ID,
  name: 'Unattributed',
  iconUrl: undefined,
  color: '#8a909d',
  href: undefined,
  isUnattributed: true,
}

export function toPosterMap(posters: BlobPoster[]): Map<string, Poster> {
  const map = new Map<string, Poster>()
  for (const p of posters) map.set(p.id, { ...p, isUnattributed: false })
  map.set(UNATTRIBUTED.id, UNATTRIBUTED)
  return map
}

export interface PosterRow {
  poster: Poster
  blobs: number
  share: number
  inHead: number
  /** Slot of the newest block in the window it posted in */
  lastSlot: number
  /** 0 is the innermost orbit; undefined when it is past the shown bodies */
  tier: 0 | 1 | 2 | undefined
  rank: number
}

export interface WindowStats {
  rows: PosterRow[]
  slots: number
  proposed: number
  totalBlobs: number
  avgBlobsPerBlock: number
  bytesPerSecond: number
  gasPerSecond: number
  tps: number
  uops: number
  /** Posters seen in the window, attributed ones only */
  systems: number
}

/** Everything the window of recent blocks says, recomputed once per block */
export function getWindowStats(
  blocks: HeadBlock[],
  head: HeadBlock | undefined,
  posters: Map<string, Poster>,
): WindowStats {
  const byPoster = new Map<string, { blobs: number; lastSlot: number }>()
  let proposed = 0
  let totalBlobs = 0
  let gas = 0
  let txs = 0
  let uops = 0
  for (const block of blocks) {
    if (block.status !== 'proposed') continue
    proposed++
    totalBlobs += block.blobCount
    gas += block.gasUsed
    txs += block.txCount
    uops += block.uopsCount
    for (const { posterId, blobs } of block.blobs) {
      const current = byPoster.get(posterId)
      byPoster.set(posterId, {
        blobs: (current?.blobs ?? 0) + blobs,
        lastSlot: Math.max(current?.lastSlot ?? 0, block.slot),
      })
    }
  }
  const headBlobs = new Map(head?.blobs.map((b) => [b.posterId, b.blobs]))
  const seconds = Math.max(1, blocks.length) * SLOT_SECONDS
  const rows = [...byPoster.entries()]
    .map(([id, { blobs, lastSlot }]) => ({
      poster: posters.get(id) ?? fallbackPoster(id),
      blobs,
      share: totalBlobs === 0 ? 0 : blobs / totalBlobs,
      inHead: headBlobs.get(id) ?? 0,
      lastSlot,
    }))
    // ties go to the one that posted last, then by name, so the order is stable
    .sort(
      (a, b) =>
        b.blobs - a.blobs ||
        b.lastSlot - a.lastSlot ||
        a.poster.name.localeCompare(b.poster.name),
    )
    .map((row, index) => ({ ...row, rank: index + 1, tier: tierOf(index) }))
  return {
    rows,
    slots: blocks.length,
    proposed,
    totalBlobs,
    avgBlobsPerBlock: proposed === 0 ? 0 : totalBlobs / proposed,
    bytesPerSecond: (totalBlobs * BLOB_BYTES) / seconds,
    gasPerSecond: gas / seconds,
    tps: txs / seconds,
    uops: uops / seconds,
    systems: rows.filter((r) => !r.poster.isUnattributed).length,
  }
}

function tierOf(index: number): PosterRow['tier'] {
  let start = 0
  for (let tier = 0; tier < TIER_SIZES.length; tier++) {
    start += TIER_SIZES[tier] ?? 0
    if (index < start) return tier as 0 | 1 | 2
  }
  return undefined
}

function fallbackPoster(id: string): Poster {
  return { ...UNATTRIBUTED, id, name: id }
}

/** What a user pays for common actions, at the head's fees */
export const ACTIONS = [
  { id: 'transfer', name: 'Send ETH', gas: 21_000, note: '21,000 gas' },
  {
    id: 'erc20',
    name: 'Send a token (ERC-20)',
    gas: 65_000,
    note: 'about 65,000 gas',
  },
  {
    id: 'swap',
    name: 'Swap on a DEX',
    gas: 150_000,
    note: 'about 150,000 gas',
  },
] as const

export function costOfGas(gas: number, block: HeadBlock) {
  const eth = (gas * (block.baseFeeGwei + block.priorityFeeGwei)) / 1e9
  return { eth, usd: eth * block.ethPriceUsd }
}

/** Blob space only: the transaction carrying the blob pays execution gas on top */
export function costOfBlob(block: HeadBlock) {
  const eth = (BLOB_BYTES * block.blobBaseFeeWei) / 1e18
  return { eth, usd: eth * block.ethPriceUsd }
}

/**
 * Blob target per block over time, as in Ethereum's config
 * (`packages/config/src/projects/ethereum/ethereum.ts`, `daLayer.throughput`)
 */
const BLOB_TARGETS = [
  { since: Date.UTC(2024, 2, 13) / 1000, target: 3, max: 6 },
  { since: Date.UTC(2025, 4, 7) / 1000, target: 6, max: 9 },
  { since: Date.UTC(2025, 11, 9) / 1000, target: 10, max: 15 },
  { since: Date.UTC(2026, 0, 7) / 1000, target: 14, max: 21 },
]

export function blobTargetAt(timestamp: number) {
  let current = { target: 0, max: 0 }
  for (const step of BLOB_TARGETS) {
    if (timestamp >= step.since) current = step
  }
  return current
}

export type RangeId = '90d' | '1y' | 'all'
export const RANGES: { id: RangeId; label: string; days: number }[] = [
  { id: '90d', label: '90 days', days: 90 },
  { id: '1y', label: '1 year', days: 365 },
  { id: 'all', label: '3 years', days: Number.POSITIVE_INFINITY },
]

export function sliceRange(history: DailyPoint[], range: RangeId) {
  const days = RANGES.find((r) => r.id === range)?.days ?? 365
  return Number.isFinite(days) ? history.slice(-days) : history
}

export function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? (sorted[mid] ?? 0)
    : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2
}

export function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

/** Hash of an id into [0, 1), so a system keeps its place on the orbit between blocks */
export function stableFraction(id: string): number {
  let hash = 2166136261
  for (const char of id) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 4294967296
}
