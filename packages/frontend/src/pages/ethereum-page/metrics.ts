import type { HeadBlock, TodaySoFar } from './live/types'

export const SLOT_SECONDS = 12
export const SLOTS_PER_EPOCH = 32
export const BLOB_BYTES = 131_072
export const BLOB_GAS_PER_BLOB = 131_072
export const TRANSFER_GAS = 21_000

/**
 * Gas each action typically takes. Fixed estimates, stated next to the costs
 * so readers can redo the math: an ERC-20 transfer to a fresh holder and a
 * single-hop Uniswap swap.
 */
export const ACTIONS = [
  { id: 'transfer', name: 'Send ETH', gas: TRANSFER_GAS },
  { id: 'erc20', name: 'Send a token (ERC-20)', gas: 65_000 },
  { id: 'swap', name: 'Swap on Uniswap', gas: 150_000 },
] as const

export function blockMetrics(block: HeadBlock) {
  return {
    dataBytes: block.blobCount * BLOB_BYTES,
    dataPerSecond: (block.blobCount * BLOB_BYTES) / SLOT_SECONDS,
    gasPerSecond: block.gasUsed / SLOT_SECONDS,
    tps: block.txCount / SLOT_SECONDS,
    uops: block.uopsCount / SLOT_SECONDS,
    gasShare: block.gasUsed / block.gasLimit,
  }
}

/** What the gas of one action costs in a block, base fee plus the median tip */
export function actionCostEth(block: HeadBlock, gas: number) {
  return (gas * (block.baseFeeGwei + block.priorityFeeGwei)) / 1e9
}

export function blobFeeEth(block: HeadBlock) {
  return (block.blobBaseFeeWei * BLOB_GAS_PER_BLOB) / 1e18
}

export function epochOf(slot: number) {
  return Math.floor(slot / SLOTS_PER_EPOCH)
}

export function median(values: number[]) {
  if (values.length === 0) return undefined
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? (sorted[mid] as number)
    : ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2
}

/** Seconds since 00:00 UTC that today's running totals cover */
export function elapsedToday(today: TodaySoFar) {
  return today.slots * SLOT_SECONDS
}
