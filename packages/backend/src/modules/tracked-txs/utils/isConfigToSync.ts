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

  if (sinceTimestampInclusive.inExclusiveRange(from, to)) {
    return { include: false, syncTo: sinceTimestampInclusive }
  }

  if (sinceTimestampInclusive.gte(to)) {
    return { include: false }
  }

  if (
    untilTimestampExclusive &&
    lastSyncedTimestamp?.equals(untilTimestampExclusive)
  ) {
    return { include: false }
  }

  if (lastSyncedTimestamp?.lt(from)) {
    throw new Error('gap between lastSyncedTimestamp and from')
  }

  if (lastSyncedTimestamp?.inExclusiveRange(from, to)) {
    return { include: false, syncTo: lastSyncedTimestamp }
  }

  if (lastSyncedTimestamp?.gte(to)) {
    return { include: false }
  }

  if (untilTimestampExclusive?.lte(from)) {
    return { include: false }
  }

  if (untilTimestampExclusive?.inExclusiveRange(from, to)) {
    return { include: true, syncTo: untilTimestampExclusive }
  }

  return { include: true }
}
