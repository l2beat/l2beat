import { UnixTime } from '@l2beat/shared-pure'
import { type ChartRange, rangeToResolution } from '~/utils/range/range'

/** How long each activity data point counts, from its timestamp */
export type ActivityResolution = 'day' | 'hour'

/** Hours are kept for two weeks only, so only the shortest ranges use them */
export function getActivityResolution(range: ChartRange): ActivityResolution {
  return rangeToResolution(range) === 'hour' ? 'hour' : 'day'
}

/** Hourly charts end with the hours of the day the daily ones end with */
export function getLastHourOfDay(timestamp: UnixTime): UnixTime {
  return UnixTime.toStartOf(timestamp, 'day') + UnixTime.DAY - UnixTime.HOUR
}
