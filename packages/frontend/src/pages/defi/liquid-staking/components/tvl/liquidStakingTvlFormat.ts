import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRangeOptionValue } from '~/components/core/chart/utils/rangeToOption'
import type { EthChange } from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatRange, formatTimestamp } from '~/utils/dates'

const PRESET_DAYS: Partial<Record<ChartRangeOptionValue, number>> = {
  '30d': 30,
  '90d': 90,
  '180d': 180,
  '1y': 365,
}
const PRESET_TOLERANCE_DAYS = 5

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
 * ("/ 90d"). Preset ranges keep their button's label when the data is only a
 * few days short (the latest complete day is yesterday); ranges ending before
 * `latestTimestamp` show their actual date span instead of a day count.
 */
export function formatChangePeriod(
  change: EthChange,
  opts?: {
    preset?: ChartRangeOptionValue | 'custom'
    latestTimestamp?: number
  },
): string {
  if (
    opts?.latestTimestamp !== undefined &&
    change.until !== opts.latestTimestamp
  ) {
    return formatRange(change.since, change.until).replaceAll('\n', ' ')
  }
  const days = Math.round((change.until - change.since) / UnixTime.DAY)
  const preset = opts?.preset
  if (preset && preset !== 'custom') {
    const presetDays = PRESET_DAYS[preset]
    if (
      presetDays !== undefined &&
      Math.abs(days - presetDays) <= PRESET_TOLERANCE_DAYS
    ) {
      return preset
    }
  }
  return days >= 360 ? `${Number((days / 365).toFixed(1))}y` : `${days}d`
}

export function formatChangeDates(change: EthChange): string {
  return `${formatTimestamp(change.since, { mode: 'date' })} to ${formatTimestamp(change.until, { mode: 'date' })}`
}
