import type { HeadBlock, TodaySoFar } from '../../live/types'

export const SLOT_SECONDS = 12
export const SLOTS_PER_EPOCH = 32
export const BLOB_BYTES = 131_072
export const BLOB_GAS_PER_BLOB = 131_072

/**
 * Gas each action typically takes. Fixed estimates, stated next to the costs
 * so readers can redo the math: an ERC-20 transfer to a fresh holder and a
 * single-hop Uniswap swap.
 */
export const ACTIONS = [
  { id: 'transfer', name: 'Send ETH', gas: 21_000 },
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

/**
 * Today's totals as they stood when `block` was the head: the head's totals
 * minus every later block in the window. Exact, since the window holds them all.
 */
export function todayAsOf(
  today: TodaySoFar | undefined,
  later: HeadBlock[],
  /** Blocks of a losing branch the reader is still looking at, added back */
  orphaned: HeadBlock[] = [],
): TodaySoFar | undefined {
  if (!today) return undefined
  let result = today
  for (const b of later) result = applyToToday(result, b, -1)
  for (const b of orphaned) result = applyToToday(result, b, 1)
  return result
}

function applyToToday(t: TodaySoFar, b: HeadBlock, sign: 1 | -1): TodaySoFar {
  if (dayOf(b.timestamp) !== t.startedAt) return t
  const proposed = b.status === 'proposed' ? 1 : 0
  return {
    ...t,
    slots: t.slots + sign,
    blocks: t.blocks + sign * proposed,
    missed: t.missed + sign * (1 - proposed),
    blobs: t.blobs + sign * b.blobCount,
    txs: t.txs + sign * b.txCount,
    uops: t.uops + sign * b.uopsCount,
    gasUsed: t.gasUsed + sign * b.gasUsed,
    burnedEth: t.burnedEth + sign * b.burnedEth,
    issuedEth: t.issuedEth + sign * b.issuedEth,
    priorityFeesEth:
      t.priorityFeesEth + (sign * b.priorityFeeGwei * b.gasUsed) / 1e9,
  }
}

export function supplyAsOf(
  supply: number | undefined,
  later: HeadBlock[],
  orphaned: HeadBlock[] = [],
) {
  if (supply === undefined) return undefined
  const net = (b: HeadBlock) => b.issuedEth - b.burnedEth
  return (
    later.reduce((s, b) => s - net(b), supply) +
    orphaned.reduce((s, b) => s + net(b), 0)
  )
}

export function epochOf(slot: number) {
  return Math.floor(slot / SLOTS_PER_EPOCH)
}

export function dayOf(timestamp: number) {
  return Math.floor(timestamp / 86_400) * 86_400
}

export function median(values: number[]) {
  if (values.length === 0) return undefined
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? (sorted[mid] as number)
    : ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2
}
