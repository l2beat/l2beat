import { UnixTime } from '@l2beat/shared-pure'
import { formatRange, formatTimestamp } from '../dates'
import type { OneTimeEvent } from './getOneTimeEvents'

export function getNiceEventDate(event: OneTimeEvent) {
  const start = UnixTime.fromDate(event.data.startDate)
  if (!event.data.endDate) {
    return formatTimestamp(start, { mode: 'datetime' })
  }

  const end = UnixTime.fromDate(event.data.endDate)
  if (isSameUtcDay(start, end)) {
    return formatRange(start, end)
  }
  // formatRange shows hours for short spans; day starts keep an overnight event as two dates
  return formatRange(
    UnixTime.toStartOf(start, 'day'),
    UnixTime.toStartOf(end, 'day'),
  )
}

function isSameUtcDay(a: UnixTime, b: UnixTime) {
  return UnixTime.toStartOf(a, 'day') === UnixTime.toStartOf(b, 'day')
}
