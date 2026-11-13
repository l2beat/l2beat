import { formatNumber, UnixTime } from '@l2beat/shared-pure'
import type {
  LiquidStakingLatestValue,
  LiquidStakingSummary,
} from '~/server/features/defi/liquid-staking/getLiquidStakingSummary'
import { formatRange, formatTimestamp } from '~/utils/dates'
import {
  ALL_ROUTES_TOOLTIP,
  type CostOfExitDescription,
} from './costOfExitDescription'
import { formatDays, formatYield } from './formatLiquidStaking'

/** Shown next to the metrics, in the table and on project pages. */
export const TVL_TOOLTIP = 'Total USD value of assets locked in the protocol.'

export interface LiquidStakingMetric {
  key: keyof Pick<LiquidStakingSummary, 'yield' | 'costOfExit'>
  title: string
  tooltip: string
  format: (value: number) => string
  /**
   * A value is a day's average or median, not a moment, so its date shows as
   * the day's range. A yield is the 30 days up to its date.
   */
  dailyBuckets: boolean
}

export const YIELD_METRIC: LiquidStakingMetric = {
  key: 'yield',
  title: 'Yield',
  tooltip:
    "What a holder earned, net of protocol fees: the annualised change of the token's exchange rate over the previous 30 days.",
  format: formatYield,
  dailyBuckets: false,
}

export const COST_OF_EXIT_METRIC: LiquidStakingMetric = {
  key: 'costOfExit',
  title: 'Cost of exit',
  tooltip: ALL_ROUTES_TOOLTIP,
  format: formatDays,
  dailyBuckets: true,
}

/** On a project's page, the cost of exit names only the routes it has. */
export function getProjectMetricTooltip(
  metric: LiquidStakingMetric,
  costOfExitDescription: CostOfExitDescription,
): string {
  return metric.key === 'costOfExit'
    ? costOfExitDescription.tooltip
    : metric.tooltip
}

/** A latest value, marked with ~ when it's an estimate. */
export function formatLatestValue(
  metric: LiquidStakingMetric,
  latest: LiquidStakingLatestValue,
): string {
  return `${latest.estimated ? '~' : ''}${metric.format(latest.value)}`
}

/** The date of a metric's value: the day it covers, or the day it is as of. */
export function formatMetricDate(
  metric: LiquidStakingMetric,
  timestamp: number,
): string {
  return metric.dailyBuckets
    ? formatRange(timestamp, timestamp + UnixTime.DAY)
    : formatTimestamp(timestamp, { mode: 'date' })
}

/** The chart values, also shown in the table and on project pages. */
export const LIQUID_STAKING_METRICS = [YIELD_METRIC, COST_OF_EXIT_METRIC]

export const ETH_STAKED_TITLE = 'ETH staked'
export const ETH_STAKED_TOOLTIP = 'Balance of all active Ethereum validators.'

export function formatEthStaked(value: number): string {
  return `${formatNumber(value)} ETH`
}
