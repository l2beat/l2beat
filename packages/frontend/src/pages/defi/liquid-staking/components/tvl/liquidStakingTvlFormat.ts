import { UnixTime } from '@l2beat/shared-pure'
import {
  type EthChange,
  YEAR_CHANGE_DAYS,
} from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'

export function shareOf(
  part: number | null | undefined,
  total: number | null | undefined,
): number | undefined {
  return part != null && total ? part / total : undefined
}

export function formatShare(
  part: number | null | undefined,
  total: number | null | undefined,
): string | undefined {
  const share = shareOf(part, total)
  return share !== undefined ? formatPercent(share) : undefined
}

export function formatSigned(value: number, format: (abs: number) => string) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${format(Math.abs(value))}`
}

/**
 * The period a change covers, as the site writes it after a percent change
 * ("/ 1y"); a year short by a few days still reads as one.
 */
export function formatChangePeriod(change: EthChange): string {
  const days = Math.round((change.until - change.since) / UnixTime.DAY)
  return days >= YEAR_CHANGE_DAYS - 5 ? '1y' : `${days}d`
}

export function formatChangeDates(change: EthChange): string {
  return `${formatTimestamp(change.since, { mode: 'date' })} to ${formatTimestamp(change.until, { mode: 'date' })}`
}
