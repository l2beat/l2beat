import type { DailyPoint } from '../../live/simulatedHistory'
import type { EthereumHead, HeadBlock } from '../../live/types'

/**
 * The claims the story makes, computed from the head and the daily history.
 * Pure, so every chapter states a number the same way and tests can pin them.
 */

export const SLOT_SECONDS = 12
export const DAY_SECONDS = 86_400
export const BLOB_BYTES = 131_072
/** Gas a blob is charged in blob gas, one per byte */
export const BLOB_GAS = 131_072

/** Typical gas per action. Real costs vary with the token and the route */
export const ACTIONS = [
  { id: 'transfer', name: 'Send ETH', gas: 21_000 },
  { id: 'erc20', name: 'Send a token (ERC-20)', gas: 65_000 },
  { id: 'swap', name: 'Swap on a DEX', gas: 150_000 },
] as const

export interface WindowStats {
  slots: number
  proposed: number
  missed: number
  seconds: number
  txs: number
  uops: number
  gasUsed: number
  blobs: number
  /** Gas used over gas limit, averaged over proposed blocks */
  fullness: number
  medianBaseFeeGwei: number
  medianPriorityFeeGwei: number
  ethPriceUsd: number
  byPoster: { posterId: string; blobs: number }[]
}

/** What the last `HEAD_WINDOW` slots add up to: the "right now" of every chapter */
export function getWindowStats(blocks: HeadBlock[]): WindowStats | undefined {
  const proposed = blocks.filter((b) => b.status === 'proposed')
  const newest = blocks.at(-1)
  if (proposed.length === 0 || !newest) return undefined
  const byPoster = new Map<string, number>()
  for (const block of proposed) {
    for (const { posterId, blobs } of block.blobs) {
      byPoster.set(posterId, (byPoster.get(posterId) ?? 0) + blobs)
    }
  }
  return {
    slots: blocks.length,
    proposed: proposed.length,
    missed: blocks.length - proposed.length,
    seconds: blocks.length * SLOT_SECONDS,
    txs: sum(proposed, (b) => b.txCount),
    uops: sum(proposed, (b) => b.uopsCount),
    gasUsed: sum(proposed, (b) => b.gasUsed),
    blobs: sum(proposed, (b) => b.blobCount),
    fullness:
      sum(proposed, (b) => b.gasUsed / b.gasLimit) /
      Math.max(1, proposed.length),
    medianBaseFeeGwei: median(proposed.map((b) => b.baseFeeGwei)),
    medianPriorityFeeGwei: median(proposed.map((b) => b.priorityFeeGwei)),
    ethPriceUsd: newest.ethPriceUsd,
    byPoster: [...byPoster.entries()]
      .map(([posterId, blobs]) => ({ posterId, blobs }))
      .sort((a, b) => b.blobs - a.blobs),
  }
}

/**
 * The finalized block when the stream knows it. Otherwise the window may hold
 * it; past the window, the slot is all we can state without guessing at misses.
 */
export function getFinalized(
  head: EthereumHead,
): { kind: 'block' | 'slot'; value: number } | undefined {
  if (head.finalizedBlock !== undefined) {
    return { kind: 'block', value: head.finalizedBlock }
  }
  const slot = head.finalizedSlot
  if (slot === undefined) return undefined
  const windowStart = head.blocks[0]?.slot
  const block =
    windowStart !== undefined && windowStart <= slot
      ? head.blocks.findLast((b) => b.slot <= slot && b.status === 'proposed')
      : undefined
  if (block?.number !== undefined) {
    return { kind: 'block', value: block.number }
  }
  return { kind: 'slot', value: slot }
}

export function mean(points: DailyPoint[], pick: (p: DailyPoint) => number) {
  return sum(points, pick) / Math.max(1, points.length)
}

/** Days `[from, to)` in unix seconds */
export function between(points: DailyPoint[], from: number, to: number) {
  return points.filter((p) => p.timestamp >= from && p.timestamp < to)
}

export function median(values: number[]) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? (sorted[middle] ?? 0)
    : ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
}

export function sum<T>(items: T[], pick: (item: T) => number) {
  let total = 0
  for (const item of items) total += pick(item)
  return total
}

export function gweiToEth(gwei: number) {
  return gwei / 1e9
}
