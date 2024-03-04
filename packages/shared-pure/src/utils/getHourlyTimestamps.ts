import { UnixTime } from '../types'

const SECONDS_PER_HOUR = 3600

export function getHourlyTimestamps(from: UnixTime, to: UnixTime): UnixTime[] {
  if (from.gt(to)) throw new Error('FROM cannot be greater than TO')

  from = from.toEndOf('hour')
  to = to.toStartOf('hour')

  const result: UnixTime[] = []
  for (let i = from.toNumber(); i <= to.toNumber(); i += SECONDS_PER_HOUR) {
    result.push(new UnixTime(i))
  }
  return result
}
