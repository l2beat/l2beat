import { UnixTime } from '@l2beat/shared-pure'

export function isTimestampInRange(
  sinceTimestamp: UnixTime,
  untilTimestamp: UnixTime | undefined,
  lastSyncedTimestamp: UnixTime | undefined,
  from: UnixTime,
  to: UnixTime,
): boolean {
  if (sinceTimestamp.gte(to)) {
    return false
  }

  if (lastSyncedTimestamp?.gte(to)) {
    return false
  }

  if (untilTimestamp === undefined) {
    return true
  }

  if (untilTimestamp.lte(from)) {
    return false
  }

  if (untilTimestamp.lte(to)) {
    return true
  }

  return true
}
