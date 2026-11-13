import { formatNumber, UnixTime } from '@l2beat/shared-pure'
import type {
  LiquidStakingLatestValue,
  LiquidStakingSummary,
} from '~/server/features/defi/liquid-staking/getLiquidStakingSummary'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatRange, formatTimestamp } from '~/utils/dates'
import { formatDays, formatYield } from './formatLiquidStaking'

/** Shown next to the metrics, in the table and on project pages. */
export const TVL_TOOLTIP = 'Total USD value of assets locked in the protocol.'

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
  tooltip:
    "What a holder earned, net of protocol fees: the annualised change of the token's exchange rate over the previous 30 days.",
  format: formatYield,
  dailyBuckets: false,
}

export const COST_OF_EXIT_METRIC: LiquidStakingMetric = {
  key: 'costOfExit',
  title: 'Cost of exit',
  tooltip:
    "How many days of staking yield a holder gives up to exit about 100 ETH, by the cheapest route: the protocol's withdrawal queue, which earns nothing while it waits; the protocol's instant exit, for its fee; or selling on the best onchain pool, for its discount. ~ marks an estimate: requests still queued are timed at the last 7 days' pace.",
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

export const ETH_STAKED_TITLE = 'ETH staked'
export const ETH_STAKED_TOOLTIP = 'Balance of all active Ethereum validators.'

export function formatEthStaked(value: number): string {
  return `${formatNumber(value)} ETH`
}
