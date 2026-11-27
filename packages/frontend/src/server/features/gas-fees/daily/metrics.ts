import { ACTION_GAS } from '../chains'
import { sum } from '../math'
import { getPerGasPrices, usdPerToken } from './feeRules'
import type { GasFeesDay } from './getGasFeesDays'

const ACTION_METRICS = ['transfer', 'erc20', 'swap'] as const
/** USD per transaction */
const COST_METRICS = ['avgFee', 'medianFee', ...ACTION_METRICS] as const
/** Gwei per gas, in the chain's gas token */
const GAS_METRICS = ['gasPrice', 'baseFee', 'priorityFee'] as const
export const GAS_FEES_METRICS = [...COST_METRICS, ...GAS_METRICS] as const
export type GasFeesMetric = (typeof GAS_FEES_METRICS)[number]

/** No period median can be had from daily medians */
export const PERIOD_METRICS = ['avgFee', ...ACTION_METRICS] as const
export type PeriodMetric = (typeof PERIOD_METRICS)[number]

export function isGasMetric(metric: GasFeesMetric): boolean {
  return (GAS_METRICS as readonly string[]).includes(metric)
}

export type DayValues = Record<GasFeesMetric, number | null>

/** Fees over transactions, USD; null without a transaction */
export function avgFee(
  days: Pick<GasFeesDay, 'totalFeeUsd' | 'txCount'>[],
): number | null {
  const txCount = sum(days.map((d) => d.txCount))
  return txCount > 0 ? sum(days.map((d) => d.totalFeeUsd)) / txCount : null
}

/** A day with no transactions has true zero totals and no prices */
export function getDayValues(d: GasFeesDay): DayValues {
  const prices = getPerGasPrices(d)
  const usd = usdPerToken(d)
  // The action's gas is its execution alone, so the L1 fee is added on every chain
  const action = (gas: number) =>
    prices && usd !== undefined
      ? (gas * prices.gasPrice + d.l1FeeNative / d.txCount) * usd
      : null
  const gwei = (perGas: number | null | undefined) =>
    perGas === null || perGas === undefined ? null : perGas * 1e9
  return {
    avgFee: avgFee([d]),
    medianFee: d.txCount > 0 ? d.medianFeeUsd : null,
    transfer: action(ACTION_GAS.transfer),
    erc20: action(ACTION_GAS.erc20),
    swap: action(ACTION_GAS.swap),
    gasPrice: gwei(prices?.gasPrice),
    baseFee: gwei(prices?.baseFee),
    priorityFee: gwei(prices?.priorityFee),
  }
}
