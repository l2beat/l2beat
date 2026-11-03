import { v } from '@l2beat/validate'

export const GAS_FEES_METRICS = [
  'avgFee',
  'medianFee',
  'transfer',
  'erc20',
  'swap',
  'nftMint',
] as const
export type GasFeesMetric = (typeof GAS_FEES_METRICS)[number]
export const GasFeesMetric = v.enum(GAS_FEES_METRICS)

/** One UTC day of fees on one chain, in USD */
export interface GasFeesRecord {
  timestamp: number
  txCount: number
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
  nftMint: number
}

export const GAS_PER_ACTION = {
  transfer: 21_000,
  erc20: 65_000,
  swap: 180_000,
  nftMint: 120_000,
} as const
