import { UnixTime } from '../types/UnixTime.js'

export function getHourlyTimestamps(from: UnixTime, to: UnixTime): UnixTime[] {
  if (from > to) throw new Error('FROM cannot be greater than TO')

  from = UnixTime.toEndOf(from, 'hour')
  to = UnixTime.toStartOf(to, 'hour')

  const result: UnixTime[] = []
  for (let i = from; i <= to; i += UnixTime.HOUR) {
    result.push(i)
  }
  return result
}
