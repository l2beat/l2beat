import { UnixTime } from '@l2beat/shared-pure'
import { rangeToDays } from './range-to-days'

export type TimeRange = '1d' | '7d' | '30d' | '90d' | '180d' | '1y' | 'max'
export type Resolution = 'hourly' | 'daily' | 'sixHourly'

export function getRange(
  range: TimeRange,
  resolution: Resolution,
): [UnixTime, UnixTime] {
  const days = rangeToDays(range)

  const roundedNow = UnixTime.now().toStartOf(
    resolution === 'hourly' ? 'hour' : 'day',
  )

  const start = roundedNow.add(-days, 'days')
  const end = roundedNow

  return [start, end]
}
