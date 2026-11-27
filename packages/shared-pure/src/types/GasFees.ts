/** The gas fees page's chains, Ethereum first. The ids are also their project ids */
export const GAS_FEES_CHAIN_IDS = [
  'ethereum',
  'arbitrum',
  'base',
  'optimism',
  'zksync2',
  'linea',
  'scroll',
  'unichain',
  'ink',
  'abstract',
  'taiko',
  'mantle',
] as const
export type GasFeesChainId = (typeof GAS_FEES_CHAIN_IDS)[number]

export type GasFeesToken = 'ETH' | 'MNT'

/** The token a chain's fees are paid in */
export function gasFeesTokenOf(chain: GasFeesChainId): GasFeesToken {
  return chain === 'mantle' ? 'MNT' : 'ETH'
}

/** Our estimated tip's speeds, slowest first */
export const GAS_FEES_TIERS = ['slow', 'medium', 'fast'] as const
export type GasFeesTier = (typeof GAS_FEES_TIERS)[number]

export interface GasFeesTierRule {
  blockPercentile: number
  blocks: number
  share: number
}

/**
 * Each tier beats `share` of the last `blocks` blocks' tips at `blockPercentile`, and is at least the
 * tier below. Slow's share comes from its target: with 5 chances and a 1.7% chance of arriving too late
 * for the first block, (1 - a * 0.983) * (1 - a)^4 = 0.05. Medium and fast are the cheapest rules that
 * kept 95% on average and 90% in every week of Nov 2025 to Apr 2026.
 */
export const GAS_FEES_TIER_RULES: Record<GasFeesTier, GasFeesTierRule> = {
  slow: { blockPercentile: 10, blocks: 300, share: 0.4522 },
  medium: { blockPercentile: 25, blocks: 300, share: 0.85 },
  fast: { blockPercentile: 25, blocks: 1800, share: 0.99 },
}

/**
 * The bands ordinary tips are counted in, gwei: each from its lower bound up
 * to, not including, its upper. A tip at or above the last bound is not ordinary
 */
export const GAS_FEES_TIP_BANDS = {
  low: [0, 0.1],
  middle: [0.1, 1],
  high: [1, 2.5],
} as const
export type GasFeesTipBand = keyof typeof GAS_FEES_TIP_BANDS
