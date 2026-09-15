/**
 * Public deposit-amount thresholds in token base units, shared by every
 * privacy project that tracks anonymity sets for these tokens. Each token has
 * two tiers that are kept comparable across tokens and projects. These are
 * analytical thresholds, not protocol minimums.
 */
export const PRIVACY_ANONYMITY_SET_MINIMUM_AMOUNTS: Partial<
  Record<string, string[]>
> = {
  ETH: ['100000000000000000', '10000000000000000000'],
  WETH: ['100000000000000000', '10000000000000000000'],
  DAI: ['200000000000000000000', '20000000000000000000000'],
  USDC: ['200000000', '20000000000'],
  USDT: ['200000000', '20000000000'],
}
