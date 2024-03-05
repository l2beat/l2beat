import { UnixTime } from '@l2beat/shared-pure'

export function adjustToForBigqueryCall(from: number, to: number): UnixTime {
  const fromUnixTime = new UnixTime(from)
  const toUnixTime = new UnixTime(to)

  if (!fromUnixTime.toStartOf('day').equals(toUnixTime.toStartOf('day'))) {
    return fromUnixTime.toNext('day')
  } else {
    return toUnixTime
  }
}
