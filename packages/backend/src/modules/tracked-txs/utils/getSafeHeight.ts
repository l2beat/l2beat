import { UnixTime } from '@l2beat/shared-pure'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'

export function getSafeHeight(
  databaseEntries: TrackedTxsConfigRecord[],
  toAdd: TrackedTxConfigEntry[],
  minTimestamp: UnixTime,
): number {
  if (databaseEntries.length === 0 && toAdd.length === 0) {
    return minTimestamp.toNumber()
  }

  const databaseTimestamps = databaseEntries
    .filter((entry) => {
      if (
        entry.untilTimestamp === undefined ||
        entry.lastSyncedTimestamp === undefined
      ) {
        return true
      }
      // Filter out archived configurations which have already been synced
      return entry.untilTimestamp?.gt(entry.lastSyncedTimestamp)
    })
    .map((c) => c.lastSyncedTimestamp ?? c.sinceTimestamp)

  const newEntryTimestamps = toAdd.map((c) => c.sinceTimestamp)

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
