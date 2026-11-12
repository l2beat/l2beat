import { UNKNOWN_POSTER_ID } from '../../live/simulatedHead'
import type { DailyPoint } from '../../live/simulatedHistory'
import { UPGRADES } from '../../live/simulatedHistory'
import type { HeadBlock, TodaySoFar } from '../../live/types'

export const BLOB_BYTES = 131_072
export const SLOT_SECONDS = 12
export const SLOTS_PER_EPOCH = 32
export const DAY = 86_400

/**
 * Rates over the head window. Divided by slots, not blocks: a missed slot is
 * twelve seconds in which Ethereum carried nothing, and the rate should show it
 */
export function windowStats(blocks: HeadBlock[]) {
  const seconds = Math.max(1, blocks.length * SLOT_SECONDS)
  let txs = 0
  let uops = 0
  let gas = 0
  let blobs = 0
  let burned = 0
  let proposed = 0
  for (const b of blocks) {
    txs += b.txCount
    uops += b.uopsCount
    gas += b.gasUsed
    blobs += b.blobCount
    burned += b.burnedEth
    if (b.status === 'proposed') proposed++
  }
  return {
    tps: txs / seconds,
    uops: uops / seconds,
    gasPerSecond: gas / seconds,
    bytesPerSecond: (blobs * BLOB_BYTES) / seconds,
    blobsPerBlock: proposed === 0 ? 0 : blobs / proposed,
    burnedEth: burned,
    missed: blocks.length - proposed,
  }
}

export interface PosterShare {
  posterId: string
  blobs: number
  share: number
}

export function posterShares(blocks: HeadBlock[]): PosterShare[] {
  const byId = new Map<string, number>()
  let total = 0
  for (const b of blocks) {
    for (const p of b.blobs) {
      byId.set(p.posterId, (byId.get(p.posterId) ?? 0) + p.blobs)
      total += p.blobs
    }
  }
  return [...byId.entries()]
    .map(([posterId, blobs]) => ({
      posterId,
      blobs,
      share: total === 0 ? 0 : blobs / total,
    }))
    .sort(
      (a, b) =>
        // the unattributed share goes last, whatever its size: it is not a system
        Number(a.posterId === UNKNOWN_POSTER_ID) -
          Number(b.posterId === UNKNOWN_POSTER_ID) || b.blobs - a.blobs,
    )
}

/** The same rates as `windowStats`, over the day so far */
export function todayRates(today: TodaySoFar) {
  const seconds = Math.max(1, today.slots * SLOT_SECONDS)
  const hours = seconds / 3600
  return {
    tps: today.txs / seconds,
    uops: today.uops / seconds,
    gasPerSecond: today.gasUsed / seconds,
    bytesPerSecond: (today.blobs * BLOB_BYTES) / seconds,
    blobsPerBlock: today.blocks === 0 ? 0 : today.blobs / today.blocks,
    burnedPerHour: today.burnedEth / hours,
    issuedPerHour: today.issuedEth / hours,
    missedShare: today.slots === 0 ? 0 : today.missed / today.slots,
  }
}

/** Complete days only: the partial day would drag every average down */
export function averageOf(
  history: DailyPoint[],
  days: number,
  pick: (p: DailyPoint) => number,
) {
  const window = history.slice(-days)
  if (window.length === 0) return 0
  return window.reduce((sum, p) => sum + pick(p), 0) / window.length
}

export function median(values: number[]) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1
    ? (sorted[mid] ?? 0)
    : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2
}

export interface UpgradeImpact {
  name: string
  timestamp: number
  summary: string
  days: number
  before: UpgradeWindow
  after: UpgradeWindow
}

interface UpgradeWindow {
  baseFeeGwei: number
  blobFeeWei: number
  blobsPerBlock: number
  transferCostUsd: number
}

/**
 * Medians of the days either side of each upgrade. Each window stops at the
 * neighbouring upgrade, so one fork's effect is not credited to the next
 */
export function upgradeImpacts(
  history: DailyPoint[],
  maxDays = 30,
): UpgradeImpact[] {
  return UPGRADES.map((upgrade, i) => {
    const previous = UPGRADES[i - 1]?.timestamp ?? Number.NEGATIVE_INFINITY
    const next = UPGRADES[i + 1]?.timestamp ?? Number.POSITIVE_INFINITY
    const days = Math.min(
      maxDays,
      Math.floor((upgrade.timestamp - previous) / DAY),
      Math.floor((next - upgrade.timestamp) / DAY),
    )
    const before = history.filter(
      (p) =>
        p.timestamp < upgrade.timestamp &&
        p.timestamp >= upgrade.timestamp - days * DAY,
    )
    const after = history.filter(
      (p) =>
        p.timestamp >= upgrade.timestamp &&
        p.timestamp < upgrade.timestamp + days * DAY,
    )
    return {
      ...upgrade,
      days,
      before: summarize(before),
      after: summarize(after),
    }
  })
}

function summarize(points: DailyPoint[]): UpgradeWindow {
  return {
    baseFeeGwei: median(points.map((p) => p.medianBaseFeeGwei)),
    blobFeeWei: median(points.map((p) => p.medianBlobFeeWei)),
    blobsPerBlock: median(points.map((p) => p.avgBlobsPerBlock)),
    transferCostUsd: median(points.map((p) => p.transferCostUsd)),
  }
}

/** Blob target and max per block on a day, as the forks set them */
export function blobLimitsAt(timestamp: number) {
  const dencun = UPGRADES[0]?.timestamp ?? 0
  const pectra = UPGRADES[1]?.timestamp ?? 0
  const bpo2 = UPGRADES[3]?.timestamp ?? 0
  // BPO1 (target 10, max 15) landed six days after Fusaka activated
  const bpo1 = Date.UTC(2025, 11, 9) / 1000
  if (timestamp < dencun) return { target: 0, max: 0 }
  if (timestamp < pectra) return { target: 3, max: 6 }
  if (timestamp < bpo1) return { target: 6, max: 9 }
  if (timestamp < bpo2) return { target: 10, max: 15 }
  return { target: 14, max: 21 }
}

export function epochOf(slot: number) {
  return Math.floor(slot / SLOTS_PER_EPOCH)
}
