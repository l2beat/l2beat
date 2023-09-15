import { UnixTime } from '../types'

const SECONDS_PER_HOUR = 3600

export function getHourlyTimestamps(from: UnixTime, to: UnixTime): UnixTime[] {
  if (from.gt(to)) throw new Error('FROM cannot be greater than TO')

  const [start, end] = adjust(from, to)

  const result: UnixTime[] = []
  const TIME_STEP = SECONDS_PER_HOUR
  for (let i = start.toNumber(); i <= end.toNumber(); i += TIME_STEP) {
    result.push(new UnixTime(i))
  }
  return result
}

function adjust(from: UnixTime, to: UnixTime) {
  const period = 'hour'
  return [
    from.isFull(period) ? from : from.toNext(period),
    to.isFull(period) ? to : to.toStartOf(period),
  ]
}
