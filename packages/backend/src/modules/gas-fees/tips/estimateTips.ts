import type { GasFeesTier } from '@l2beat/database'

export const GAS_FEES_TIERS: GasFeesTier[] = ['slow', 'medium', 'fast']

/**
 * Each tier beats `share` of the last `blocks` blocks' tips at `blockPercentile`, and is at least the
 * tier below. Slow's share comes from its target: with 5 chances and a 1.7% chance of arriving too late
 * for the first block, (1 - a * 0.983) * (1 - a)^4 = 0.05. Medium and fast are the cheapest rules that
 * kept 95% on average and 90% in every week of Nov 2025 to Apr 2026.
 */
const TIERS: Record<GasFeesTier, TierRule> = {
  slow: { blockPercentile: 10, blocks: 300, share: 0.4522 },
  medium: { blockPercentile: 25, blocks: 300, share: 0.85 },
  fast: { blockPercentile: 25, blocks: 1800, share: 0.99 },
}

interface TierRule {
  blockPercentile: number
  blocks: number
  share: number
}

/** The per-block percentiles to read with eth_feeHistory, the columns of a block's tips */
export const BLOCK_PERCENTILES = [
  ...new Set(Object.values(TIERS).map((t) => t.blockPercentile)),
]
export const HISTORY_BLOCKS = Math.max(
  ...Object.values(TIERS).map((t) => t.blocks),
)

export type TierTips = Record<GasFeesTier, number>

/**
 * Our tips from past blocks only, so anyone with a node can compute the same
 * numbers. `blockTips` holds each block's tips at BLOCK_PERCENTILES, oldest
 * first, ending at the newest block; at least HISTORY_BLOCKS of them.
 */
export function estimateTips(
  blockTips: readonly (readonly number[])[],
): TierTips {
  if (blockTips.length < HISTORY_BLOCKS) {
    throw new Error('Too few blocks for the estimate', {
      cause: { blocks: blockTips.length },
    })
  }
  const slow = tierTip(blockTips, TIERS.slow, 0)
  const medium = tierTip(blockTips, TIERS.medium, slow)
  const fast = tierTip(blockTips, TIERS.fast, medium)
  return { slow, medium, fast }
}

/** The tip that beats `share` of the rule's blocks, and is at least the tier below */
function tierTip(
  blockTips: readonly (readonly number[])[],
  rule: TierRule,
  tierBelow: number,
): number {
  const column = BLOCK_PERCENTILES.indexOf(rule.blockPercentile)
  const values = blockTips
    .slice(-rule.blocks)
    .map((row) => row[column] ?? 0)
    .sort((a, b) => a - b)
  const index = Math.min(
    values.length - 1,
    Math.floor(rule.share * values.length),
  )
  return Math.max(tierBelow, values[index] ?? 0)
}
