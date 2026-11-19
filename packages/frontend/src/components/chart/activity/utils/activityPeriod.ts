import { UnixTime } from '@l2beat/shared-pure'
import type { ChartTimeRangeValue } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import type { ActivityResolution } from '~/server/features/layer2s/activity/utils/getActivityResolution'
import { formatRange } from '~/utils/dates'

/**
 * Where a point's period ends. One under way ends with the newest block, so
 * its rate compares with whole ones
 */
export function getActivityPeriodEnd(
  timestamp: number,
  resolution: ActivityResolution,
  liveUntil: number | undefined,
): number {
  const end = timestamp + UnixTime.periodToSeconds(resolution)
  return liveUntil !== undefined && end > liveUntil
    ? Math.max(timestamp, liveUntil) + 1
    : end
}

export function formatActivityPeriod(
  timestamp: number,
  resolution: ActivityResolution,
  end = timestamp + UnixTime.periodToSeconds(resolution),
): string {
  const range = formatRange(timestamp, end)
  return end - timestamp < UnixTime.periodToSeconds(resolution)
    ? `${range} so far`
    : range
}

export function capTimeRange(
  range: ChartTimeRangeValue,
  liveUntil: number | undefined,
): ChartTimeRangeValue {
  if (!range || liveUntil === undefined) return range
  return [range[0], Math.min(range[1], liveUntil + 1)]
}
