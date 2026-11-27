import {
  GAS_FEES_TIER_RULES,
  type GasFeesTier,
  type GasFeesTierRule,
} from '@l2beat/shared-pure'

/** The per-block percentiles to read with eth_feeHistory, the columns of a block's tips */
export const BLOCK_PERCENTILES = [
  ...new Set(Object.values(GAS_FEES_TIER_RULES).map((t) => t.blockPercentile)),
]
export const HISTORY_BLOCKS = Math.max(
  ...Object.values(GAS_FEES_TIER_RULES).map((t) => t.blocks),
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
  const slow = tierTip(blockTips, GAS_FEES_TIER_RULES.slow, 0)
  const medium = tierTip(blockTips, GAS_FEES_TIER_RULES.medium, slow)
  const fast = tierTip(blockTips, GAS_FEES_TIER_RULES.fast, medium)
  return { slow, medium, fast }
}

/** The tip that beats `share` of the rule's blocks, and is at least the tier below */
function tierTip(
  blockTips: readonly (readonly number[])[],
  rule: GasFeesTierRule,
  tierBelow: number,
): number {
  const column = BLOCK_PERCENTILES.indexOf(rule.blockPercentile)
  const values = blockTips
    .slice(-rule.blocks)
    .map((row) => required(row[column]))
    .sort((a, b) => a - b)
  const index = Math.min(
    values.length - 1,
    Math.floor(rule.share * values.length),
  )
  return Math.max(tierBelow, required(values[index]))
}

function required(tip: number | undefined): number {
  if (tip === undefined) {
    throw new Error('Block tips lack a percentile')
  }
  return tip
}
