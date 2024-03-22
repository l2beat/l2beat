import { UnixTime } from '@l2beat/shared-pure'

import {
  trackedTxConfigEntryToRecord,
  TrackedTxsConfigRecord,
} from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from '../types/TrackedTxId'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'

export type ToChangeUntilTimestamp = {
  id: TrackedTxId
  untilTimestampExclusive: UnixTime | undefined
  trim: boolean
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
        entry.untilTimestampExclusive?.toNumber() ===
        databaseEntry.untilTimestampExclusive?.toNumber()
      ) {
        continue
      }

      const trim =
        databaseEntry.lastSyncedTimestamp &&
        entry.untilTimestampExclusive &&
        entry.untilTimestampExclusive < databaseEntry.lastSyncedTimestamp

      toChangeUntilTimestamp.push({
        id: entryUse.id,
        untilTimestampExclusive: entry.untilTimestampExclusive,
        trim: !!trim,
      })
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
