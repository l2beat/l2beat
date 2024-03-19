import { UnixTime } from '@l2beat/shared-pure'

export function isTimestampInRange(
  sinceTimestampInclusive: UnixTime,
  untilTimestampExclusive: UnixTime | undefined,
  lastSyncedTimestamp: UnixTime | undefined,
  from: UnixTime,
  to: UnixTime,
): boolean {
  if (sinceTimestampInclusive.gte(to)) {
    return false
  }

  if (lastSyncedTimestamp?.gte(to)) {
    return false
  }

  if (untilTimestampExclusive === undefined) {
    return true
  }

  if (untilTimestampExclusive.lte(from)) {
    return false
  }

  if (untilTimestampExclusive.lte(to)) {
    return true
  }

  return true
}
