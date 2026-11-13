import { v } from '@l2beat/validate'

/** Fees per transaction in USD */
export const GAS_FEES_USD_METRICS = [
  'avgFee',
  'medianFee',
  'transfer',
  'erc20',
  'swap',
] as const
/** Prices per unit of gas in the chain's gas unit (gwei, fri) */
export const GAS_FEES_GAS_METRICS = [
  'gasPrice',
  'baseFeePerGas',
  'priorityFeePerGas',
] as const
export const GAS_FEES_METRICS = [
  ...GAS_FEES_USD_METRICS,
  ...GAS_FEES_GAS_METRICS,
] as const
export type GasFeesUsdMetric = (typeof GAS_FEES_USD_METRICS)[number]
export type GasFeesGasMetric = (typeof GAS_FEES_GAS_METRICS)[number]
export type GasFeesMetric = (typeof GAS_FEES_METRICS)[number]
export const GasFeesMetric = v.enum(GAS_FEES_METRICS)

export type GasFeesUnit = 'usd' | 'gas'

export function isGasMetric(metric: GasFeesMetric): metric is GasFeesGasMetric {
  return (GAS_FEES_GAS_METRICS as readonly string[]).includes(metric)
}

/** One UTC day of fees on one chain */
export interface GasFeesRecord {
  timestamp: number
  txCount: number
  /** USD */
  totalFees: number
  /** On L2s the L2 execution base fee. null on Ethereum before London. */
  baseFees: number | null
  /** null before London and on chains without priority fees */
  priorityFees: number | null
  /** What L2 users pay for posting data to Ethereum, 0 on Ethereum */
  l1DataFees: number
  medianFee: number
  /** Cost of an action at the day's typical fee, see GAS_PER_ACTION */
  transfer: number
  erc20: number
  swap: number
  /** Per gas in the chain's gas unit (gwei, fri), averaged over the day */
  gasPrice: number
  /** null when baseFees is */
  baseFeePerGas: number | null
  /** null when priorityFees is */
  priorityFeePerGas: number | null
}

export const GAS_PER_ACTION = {
  transfer: 21_000,
  erc20: 65_000,
  swap: 180_000,
} as const
