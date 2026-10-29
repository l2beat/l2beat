import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRange } from '~/utils/range/range'

/** How long each activity data point counts, from its timestamp */
export type ActivityResolution = 'day' | 'hour'

/**
 * Hours are kept for two weeks only, so only the shortest ranges use them.
 * Range options end 75 minutes back, so just after midnight the 7D option
 * starts eight days back, hence a day of slack
 */
export function getActivityResolution(range: ChartRange): ActivityResolution {
  const today = UnixTime.toStartOf(UnixTime.now(), 'day')
  return range[0] !== null && range[0] >= today - 8 * UnixTime.DAY
    ? 'hour'
    : 'day'
}
