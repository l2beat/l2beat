import { UnixTime } from '@l2beat/shared-pure'
import type { ChartTimeRangeValue } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import type { ActivityResolution } from '~/server/features/layer2s/activity/utils/getActivityResolution'
import { formatRange } from '~/utils/dates'

/**
 * The seconds a point's count is spread over. A period still under way
 * counts only up to the newest block, so its rate compares with whole ones
 */
export function getActivityPeriod(
  timestamp: number,
  resolution: ActivityResolution,
  liveUntil: number | undefined,
): { seconds: number; underWay: boolean } {
  const whole = UnixTime.periodToSeconds(resolution)
  const seconds =
    liveUntil !== undefined && timestamp + whole > liveUntil
      ? Math.max(1, liveUntil - timestamp + 1)
      : whole
  return { seconds, underWay: seconds < whole }
}

/** A point's period, up to the newest block while under way */
export function formatActivityPeriod(
  timestamp: number,
  resolution: ActivityResolution,
  liveUntil: number | undefined,
): string {
  const { seconds, underWay } = getActivityPeriod(
    timestamp,
    resolution,
    liveUntil,
  )
  const range = formatRange(timestamp, timestamp + seconds)
  return underWay ? `${range} so far` : range
}

/** A chart's range, ending with the newest block when its last period is under way */
export function capTimeRange(
  range: ChartTimeRangeValue,
  liveUntil: number | undefined,
): ChartTimeRangeValue {
  if (!range || liveUntil === undefined) return range
  return [range[0], Math.min(range[1], liveUntil + 1)]
}
