import { UnixTime } from '@l2beat/shared-pure'
import type { ActivityResolution } from '~/server/features/layer2s/activity/utils/getActivityResolution'

/**
 * The seconds a point's count is spread over. A period still under way
 * counts only up to the newest block, so its rate compares with whole ones
 */
export function getActivityPeriodSeconds(
  timestamp: number,
  resolution: ActivityResolution,
  liveUntil: number | undefined,
): number {
  const whole = UnixTime.periodToSeconds(resolution)
  return liveUntil !== undefined && timestamp + whole > liveUntil
    ? Math.max(1, liveUntil - timestamp + 1)
    : whole
}

/** A chart's range, ending with the newest block when its last period is under way */
export function capTimeRange(
  range: [number, number] | undefined,
  liveUntil: number | undefined,
): [number, number] | undefined {
  if (!range || liveUntil === undefined) return range
  return [range[0], Math.min(range[1], liveUntil + 1)]
}
