import { UnixTime } from '@l2beat/shared-pure'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'

export function getSafeHeight(
  databaseEntries: TrackedTxsConfigRecord[],
  toAdd: TrackedTxsConfigRecord[],
  minTimestamp: UnixTime,
): number {
  if (databaseEntries.length === 0 && toAdd.length === 0) {
    return minTimestamp.toNumber()
  }

  const databaseTimestamps = databaseEntries
    .filter((entry) => {
      if (
        entry.untilTimestampExclusive === undefined ||
        entry.lastSyncedTimestamp === undefined
      ) {
        return true
      }
      // Filter out archived configurations which have already been synced
      return entry.untilTimestampExclusive?.gt(entry.lastSyncedTimestamp)
    })
    .map((c) => c.lastSyncedTimestamp ?? c.sinceTimestampInclusive)

  const newEntryTimestamps = toAdd.map((c) => c.sinceTimestampInclusive)

  const earliestTimestamp = findEarliestTimestamp([
    ...databaseTimestamps,
    ...newEntryTimestamps,
  ])

  return earliestTimestamp.lt(minTimestamp)
    ? minTimestamp.toNumber()
    : earliestTimestamp.toNumber()
}

function findEarliestTimestamp(timestamps: UnixTime[]): UnixTime {
  return timestamps.reduce((min, current) => (min.lt(current) ? min : current))
}
