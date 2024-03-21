import { notUndefined, UnixTime } from '@l2beat/shared-pure'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'

export function getSafeHeight(
  databaseEntries: TrackedTxsConfigRecord[],
  minTimestamp: UnixTime,
): number {
  if (databaseEntries.length === 0) {
    return minTimestamp.toNumber()
  }

  const applicableTimestamps = databaseEntries
    .map((e) => {
      const entryNeverSynced = !e.lastSyncedTimestamp
      if (entryNeverSynced) {
        return e.sinceTimestampInclusive
      }

      const entrySyncedButNotToTheTop =
        e.lastSyncedTimestamp &&
        (!e.untilTimestampExclusive ||
          e.untilTimestampExclusive.gt(e.lastSyncedTimestamp))
      if (entrySyncedButNotToTheTop) {
        return e.lastSyncedTimestamp
      }
    })
    .filter(notUndefined)

  if (applicableTimestamps.length === 0) {
    return minTimestamp.toNumber()
  }

  const earliestTimestamp = Math.min(
    ...applicableTimestamps.map((t) => t.toNumber()),
  )

  return Math.max(minTimestamp.toNumber(), earliestTimestamp)
}
