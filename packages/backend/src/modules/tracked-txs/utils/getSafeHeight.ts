import { notUndefined, UnixTime } from '@l2beat/shared-pure'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'

export function getSafeHeight(
  databaseEntries: TrackedTxsConfigRecord[],
  minTimestamp: UnixTime,
): number {
  if (databaseEntries.length === 0) {
    return minTimestamp.toNumber()
  }

  const applicableEntries = databaseEntries.filter((e) => {
    return (
      e.lastSyncedTimestamp &&
      (!e.untilTimestampExclusive ||
        e.untilTimestampExclusive.gt(e.lastSyncedTimestamp))
    )
  })

  if (applicableEntries.length === 0) {
    return minTimestamp.toNumber()
  }

  const applicableLastSyncedTimestamps = applicableEntries
    .map((e) => e.lastSyncedTimestamp?.toNumber())
    .filter(notUndefined)

  const earliestLastSyncedTimestamp = Math.min(
    ...applicableLastSyncedTimestamps,
  )

  return Math.max(minTimestamp.toNumber(), earliestLastSyncedTimestamp)
}
