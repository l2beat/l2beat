import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRange } from '~/utils/range/range'

export const DaThroughputTimeRangeValues = [
  '7d',
  '30d',
  '90d',
  '180d',
  '1y',
  'max',
] as const

export type DaThroughputResolution = ReturnType<typeof rangeToResolution>
export function rangeToResolution(range: ChartRange) {
  if (range[0] === null) return 'daily'
  if (range[0] > UnixTime.toStartOf(UnixTime.now(), 'day') - 7 * UnixTime.DAY)
    return 'hourly'
  if (range[0] > UnixTime.toStartOf(UnixTime.now(), 'day') - 180 * UnixTime.DAY)
    return 'sixHourly'
  return 'daily'
}
