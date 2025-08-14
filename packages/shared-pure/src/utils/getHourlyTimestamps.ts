import { UnixTime } from '../types'

export function getHourlyTimestamps(from: UnixTime, to: UnixTime): UnixTime[] {
  if (from > to) throw new Error('From cannot be greater than to')

  from = UnixTime.toEndOf(from, 'hour')
  to = UnixTime.toStartOf(to, 'hour')

  const result: UnixTime[] = []
  for (let i = from; i <= to; i += UnixTime.HOUR) {
    result.push(i)
  }
  return result
}
