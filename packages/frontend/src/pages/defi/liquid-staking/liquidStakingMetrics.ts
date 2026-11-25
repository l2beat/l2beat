import { formatCurrency, formatNumber, UnixTime } from '@l2beat/shared-pure'
import type {
  LiquidStakingLatestValue,
  LiquidStakingSummary,
} from '~/server/features/defi/liquid-staking/getLiquidStakingSummary'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatRange, formatTimestamp } from '~/utils/dates'
import {
  ALL_ROUTES_COST_OF_EXIT,
  type CostOfExitDescription,
} from './costOfExitDescription'
import { formatDays, formatYield } from './formatLiquidStaking'

/** Shown next to the metrics, in the table and on project pages. */
export const TVL_TOOLTIP = 'Total USD value of assets locked in the protocol.'
/** For the table, whose TVL column has the TVL in ETH in brackets. */
export const TVL_WITH_ETH_TOOLTIP = `${TVL_TOOLTIP} In brackets, the ETH the protocol's tokens stand for at its own exchange rate.`

export const STAKED_ETH_SHARE_TOOLTIP =
  "The ETH the protocol's tokens stand for at its own exchange rate, as a share of the balance of all active Ethereum validators. The protocol's ETH includes ETH not yet staked, or exited but not yet withdrawn, so the share can read slightly high."

/** E.g. "24.1% of staked ETH". */
export function formatStakedEthShare(share: number): string {
  return `${formatPercent(share)} of staked ETH`
}

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
  tooltip: 'Annualised return over the last 30 days, net of protocol fees.',
  format: formatYield,
  dailyBuckets: false,
}

export const COST_OF_EXIT_METRIC: LiquidStakingMetric = {
  key: 'costOfExit',
  title: 'Cost of exit',
  tooltip: ALL_ROUTES_COST_OF_EXIT.tooltip,
  format: formatDays,
  dailyBuckets: true,
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

/**
 * On a project's page, the cost of exit names only the routes it has. An
 * untracked one has no routes to name.
 */
export function getProjectMetrics(
  costOfExit: CostOfExitDescription | undefined,
): LiquidStakingMetric[] {
  return costOfExit
    ? [YIELD_METRIC, { ...COST_OF_EXIT_METRIC, tooltip: costOfExit.tooltip }]
    : LIQUID_STAKING_METRICS
}

export const ETH_STAKED_TITLE = 'ETH staked'
export const ETH_STAKED_TOOLTIP = 'Balance of all active Ethereum validators.'

export function formatEthStaked(value: number): string {
  return `${formatNumber(value)} ETH`
}

/** The ETH staked, with its USD value in brackets when there is one. */
export function formatEthStakedWithUsd(
  value: number,
  valueUsd: number | null,
): string {
  const usd = valueUsd !== null ? ` (${formatCurrency(valueUsd, 'usd')})` : ''
  return `${formatEthStaked(value)}${usd}`
}
