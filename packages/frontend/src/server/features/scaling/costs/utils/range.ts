import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRange } from '~/utils/range/range'

export function rangeToResolution(range: ChartRange) {
  if (range[0] === null) return 'daily'
  if (range[0] > UnixTime.toStartOf(UnixTime.now(), 'day') - 30 * UnixTime.DAY)
    return 'hourly'
  if (range[0] > UnixTime.toStartOf(UnixTime.now(), 'day') - 90 * UnixTime.DAY)
    return 'sixHourly'
  return 'daily'
}
