import type {
  LiquidStakingLatestValue,
  LiquidStakingSummary,
} from '~/server/features/defi/liquid-staking/getLiquidStakingSummary'
import { formatDays, formatYield } from './formatLiquidStaking'

/** Shown next to the metrics, in the table and on project pages. */
export const TVL_TOOLTIP = 'Total USD value of assets locked in the protocol.'

export interface LiquidStakingMetric {
  key: keyof Pick<LiquidStakingSummary, 'yield' | 'costOfExit'>
  title: string
  tooltip: string
  format: (value: number) => string
}

export const YIELD_METRIC: LiquidStakingMetric = {
  key: 'yield',
  title: 'Yield',
  tooltip:
    "What a holder earned, net of protocol fees: the annualised change of the token's exchange rate over the previous 30 days.",
  format: formatYield,
}

export const COST_OF_EXIT_METRIC: LiquidStakingMetric = {
  key: 'costOfExit',
  title: 'Cost of exit',
  tooltip:
    "How many days of staking yield a holder gives up to exit about 100 ETH, by the cheapest route: the protocol's withdrawal queue, which earns nothing while it waits; the protocol's instant exit, for its fee; or selling on the best onchain pool, for its discount. ~ marks an estimate: requests still queued are timed at the last 7 days' pace.",
  format: formatDays,
}

/** A latest value, marked with ~ when it's an estimate. */
export function formatLatestValue(
  metric: LiquidStakingMetric,
  latest: LiquidStakingLatestValue,
): string {
  return `${latest.estimated ? '~' : ''}${metric.format(latest.value)}`
}

/** The chart values, also shown in the table and on project pages. */
export const LIQUID_STAKING_METRICS = [YIELD_METRIC, COST_OF_EXIT_METRIC]
