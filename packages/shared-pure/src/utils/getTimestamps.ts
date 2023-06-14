import { UnixTime } from '../types'

type Granularity = 'daily' | 'hourly'

const SECONDS_PER_HOUR = 3600
const SECONDS_PER_DAY = 86400

export function getTimestamps(
  from: UnixTime,
  to: UnixTime,
  granularity: Granularity,
): UnixTime[] {
  if (from.gt(to)) throw new Error('FROM cannot be greater than TO')

  const [start, end] = adjust(from, to, granularity)

  const result: UnixTime[] = []
  const TIME_STEP =
    granularity === 'hourly' ? SECONDS_PER_HOUR : SECONDS_PER_DAY
  for (let i = start.toNumber(); i <= end.toNumber(); i += TIME_STEP) {
    result.push(new UnixTime(i))
  }
  return result
}

function adjust(from: UnixTime, to: UnixTime, granularity: Granularity) {
  const period = granularity === 'hourly' ? 'hour' : 'day'
  return [
    from.isFull(period) ? from : from.toNext(period),
    to.isFull(period) ? to : to.toStartOf(period),
  ]
}
