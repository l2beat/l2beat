import { UnixTime } from '@l2beat/shared-pure'

export function isTimestampInRange(
  untilTimestamp: UnixTime | undefined,
  from: UnixTime,
  to: UnixTime,
): boolean {
  if (untilTimestamp === undefined) {
    return true
  }

  if (untilTimestamp.lt(from)) {
    return false
  }

  if (untilTimestamp.lte(to)) {
    return true
  }

  return true
}
