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
