import { UnixTime } from '@l2beat/shared-pure'

export function adjustRangeForBigQueryCall(
  from: number,
  to: number,
): { from: UnixTime; to: UnixTime } {
  const fromUnixTime = new UnixTime(from)
  const toUnixTime = new UnixTime(to)

  if (!fromUnixTime.toStartOf('day').equals(toUnixTime.toStartOf('day'))) {
    return { from: fromUnixTime, to: fromUnixTime.toNext('day') }
  } else {
    return { from: fromUnixTime, to: toUnixTime }
  }
}
