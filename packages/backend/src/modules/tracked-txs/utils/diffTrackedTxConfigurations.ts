import { UnixTime } from '@l2beat/shared-pure'

import {
  trackedTxConfigEntryToRecord,
  TrackedTxsConfigRecord,
} from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from '../types/TrackedTxId'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'

export type ToChangeUntilTimestamp = {
  id: TrackedTxId
  untilTimestampExclusive: UnixTime
  lastSyncedTimestamp: UnixTime | undefined
}

export function diffTrackedTxConfigurations(
  runtimeEntries: TrackedTxConfigEntry[],
  databaseEntries: TrackedTxsConfigRecord[],
): {
  toAdd: TrackedTxsConfigRecord[]
  toRemove: TrackedTxId[]
  toChangeUntilTimestamp: ToChangeUntilTimestamp[]
} {
  const toAdd: TrackedTxsConfigRecord[] = []
  const toChangeUntilTimestamp: ToChangeUntilTimestamp[] = []

  for (const entry of runtimeEntries) {
    for (const entryUse of entry.uses) {
      const databaseEntry = databaseEntries.find((e) => e.id === entryUse.id)

      if (!databaseEntry) {
        const record = trackedTxConfigEntryToRecord(entry, entryUse)
        toAdd.push(record)
        continue
      }

      if (
        entry.untilTimestampExclusive &&
        (!databaseEntry.untilTimestampExclusive ||
          !entry.untilTimestampExclusive.equals(
            databaseEntry.untilTimestampExclusive,
          ))
      ) {
        toChangeUntilTimestamp.push({
          id: entryUse.id,
          untilTimestampExclusive: entry.untilTimestampExclusive,
          lastSyncedTimestamp: databaseEntry.lastSyncedTimestamp,
        })
      }
    }
  }
  const toRemove = databaseEntries
    .filter(
      (entry) =>
        !runtimeEntries.find((e) => e.uses.some((u) => u.id === entry.id)),
    )
    .map((entry) => entry.id)
  return { toAdd, toChangeUntilTimestamp, toRemove }
}
