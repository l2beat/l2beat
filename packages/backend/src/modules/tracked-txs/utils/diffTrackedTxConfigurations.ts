import { UnixTime } from '@l2beat/shared-pure'

import {
  trackedTxConfigEntryToRow,
  TrackedTxsConfigRecord,
} from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from '../types/TrackedTxId'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'

export function diffTrackedTxConfigurations(
  runtimeEntries: TrackedTxConfigEntry[],
  databaseEntries: TrackedTxsConfigRecord[],
): {
  toAdd: TrackedTxsConfigRecord[]
  toTrim: { id: TrackedTxId; untilTimestamp: UnixTime }[]
  toRemove: TrackedTxId[]
} {
  const toAdd: TrackedTxsConfigRecord[] = []
  const toTrim: { id: TrackedTxId; untilTimestamp: UnixTime }[] = []

  for (const entry of runtimeEntries) {
    for (const entryUse of entry.uses) {
      const databaseEntry = databaseEntries.find((e) => e.id === entryUse.id)

      if (!databaseEntry) {
        const record = trackedTxConfigEntryToRow(entry, entryUse)
        toAdd.push(record)
        continue
      }

      if (
        entry.untilTimestamp &&
        (!databaseEntry.untilTimestamp ||
          entry.untilTimestamp < databaseEntry.untilTimestamp)
      ) {
        toTrim.push({ id: entryUse.id, untilTimestamp: entry.untilTimestamp })
      }
    }
  }
  const toRemove = databaseEntries
    .filter(
      (entry) =>
        !runtimeEntries.find((e) => e.uses.some((u) => u.id === entry.id)),
    )
    .map((entry) => entry.id)

  return { toAdd, toTrim, toRemove }
}
