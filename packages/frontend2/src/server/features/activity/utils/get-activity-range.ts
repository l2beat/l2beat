import { UnixTime } from '@l2beat/shared-pure'
import { type TimeRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/range-to-days'

export function getActivityRange(range: TimeRange): [UnixTime, UnixTime] {
  const days = rangeToDays(range)

  const startOfDay = UnixTime.now().toStartOf('day')

  const end = startOfDay
  const start = end.add(-days, 'days')
  return [start, end]
}
