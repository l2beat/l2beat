import { v } from '@l2beat/validate'

/** Fees per transaction in USD */
export const GAS_FEES_USD_METRICS = [
  'avgFee',
  'medianFee',
  'transfer',
  'erc20',
  'swap',
] as const
/** Prices per unit of gas in gwei */
export const GAS_FEES_GAS_METRICS = [
  'gasPrice',
  'baseFeePerGas',
  'priorityFeePerGas',
] as const
export const GAS_FEES_METRICS = [
  ...GAS_FEES_USD_METRICS,
  ...GAS_FEES_GAS_METRICS,
] as const
/**
 * The fees a period has one figure for. Not the median fee: the median of a
 * period's transactions can't be had from its days' medians.
 */
export const GAS_FEES_PERIOD_METRICS = [
  'avgFee',
  'transfer',
  'erc20',
  'swap',
] as const
export type GasFeesUsdMetric = (typeof GAS_FEES_USD_METRICS)[number]
export type GasFeesPeriodMetric = (typeof GAS_FEES_PERIOD_METRICS)[number]
export type GasFeesGasMetric = (typeof GAS_FEES_GAS_METRICS)[number]
export type GasFeesMetric = (typeof GAS_FEES_METRICS)[number]
export const GasFeesMetric = v.enum(GAS_FEES_METRICS)

export type GasFeesUnit = 'usd' | 'gas'

export function isGasMetric(metric: GasFeesMetric): metric is GasFeesGasMetric {
  return (GAS_FEES_GAS_METRICS as readonly string[]).includes(metric)
}

/**
 * One UTC day of fees on one chain. Amounts are in USD. Every price is null
 * on a day without transactions: nothing was paid, so nothing has a price.
 */
export interface GasFeesRecord {
  timestamp: number
  txCount: number
  gasUsed: number
  totalFees: number
  /** What the chain sets for its own execution. With priorityFees and l1DataFees it adds up to totalFees */
  baseFees: number
  /** null on chains without priority fees */
  priorityFees: number | null
  /** What L2 users pay for posting data to Ethereum, 0 on Ethereum */
  l1DataFees: number
  medianFee: number | null
  /** Cost of an action at the day's average gas price, see GAS_PER_ACTION */
  transfer: number | null
  erc20: number | null
  swap: number | null
  /** Per gas in gwei of the chain's gas token, averaged over the day's gas */
  gasPrice: number | null
  baseFeePerGas: number | null
  /** null on chains without priority fees */
  priorityFeePerGas: number | null
}

/**
 * 21,000 is what the protocol charges for an ETH transfer. The others are the
 * median gas of successful ERC-20 transfers and router swaps on Ethereum on
 * 2 Nov 2026, as the tips on this page use.
 */
export const GAS_PER_ACTION = {
  transfer: 21_000,
  erc20: 46_109,
  swap: 123_119,
} as const

/** What a tip adds to the cost of an ERC-20 transfer */
export function tipToUsd(gwei: number, ethUsd: number) {
  return gwei * GAS_PER_ACTION.erc20 * 1e-9 * ethUsd
}
