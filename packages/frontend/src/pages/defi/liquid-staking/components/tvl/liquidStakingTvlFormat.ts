import { formatCurrency, UnixTime } from '@l2beat/shared-pure'
import type { ChartUnit } from '~/components/chart/types'
import type { EthChange } from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import { formatTimestamp } from '~/utils/dates'

/** Undefined when unknown, which the caller shows as such. */
export function formatAmount(
  value: number | null | undefined,
  unit: ChartUnit,
): string | undefined {
  return value != null ? formatCurrency(value, unit) : undefined
}

/** A share, or undefined when either side is unknown. */
export function shareOf(
  part: number | null | undefined,
  total: number | null | undefined,
): number | undefined {
  return part != null && total ? part / total : undefined
}

export function formatSigned(value: number, format: (abs: number) => string) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${format(Math.abs(value))}`
}

/**
 * The period a change covers, as the site writes it after a percent change
 * ("/ 1y"); a year short by a day or two still reads as one.
 */
export function formatChangePeriod(change: EthChange): string {
  const days = Math.round((change.until - change.since) / UnixTime.DAY)
  return days >= 360 ? '1y' : `${days}d`
}

export function formatChangeDates(change: EthChange): string {
  return `${formatTimestamp(change.since, { mode: 'date' })} to ${formatTimestamp(change.until, { mode: 'date' })}`
}
