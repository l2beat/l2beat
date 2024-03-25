import { UnixTime } from '@l2beat/shared-pure'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'

export function isConfigToSync(
  configEntry: TrackedTxConfigEntry,
  databaseEntry: TrackedTxsConfigRecord,
  from: UnixTime,
  to: UnixTime,
): { include: boolean; syncTo?: UnixTime } {
  const { lastSyncedTimestamp } = databaseEntry
  const { sinceTimestampInclusive, untilTimestampExclusive } = configEntry

  // untilTimestamp set and config synced to it - skip config
  if (
    untilTimestampExclusive &&
    lastSyncedTimestamp?.equals(untilTimestampExclusive)
  ) {
    return { include: false }
  }

  if (lastSyncedTimestamp?.lt(from)) {
    throw new Error(
      'Programmer error: lastSyncedTimestamp should be after or equal to from',
    )
  }

  // config synced somewhere in the range - skip config, split the range
  if (lastSyncedTimestamp?.inExclusiveRange(from, to)) {
    return { include: false, syncTo: lastSyncedTimestamp }
  }

  // config synced - skip config
  if (lastSyncedTimestamp?.gte(to)) {
    return { include: false }
  }

  // config starts inside the range to sync - skip config, split the range
  if (sinceTimestampInclusive.inExclusiveRange(from, to)) {
    return { include: false, syncTo: sinceTimestampInclusive }
  }

  // config starts after the range - skip config
  if (sinceTimestampInclusive.gte(to)) {
    return { include: false }
  }

  // config ends before the range - skip config
  if (untilTimestampExclusive?.lte(from)) {
    return { include: false }
  }

  // config ends inside the range - include config, split the range
  if (untilTimestampExclusive?.inExclusiveRange(from, to)) {
    return { include: true, syncTo: untilTimestampExclusive }
  }

  return { include: true }
}
