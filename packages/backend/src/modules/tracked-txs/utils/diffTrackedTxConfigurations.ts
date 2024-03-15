import { UnixTime } from '@l2beat/shared-pure'

import {
  trackedTxConfigEntryToRecord,
  TrackedTxsConfigRecord,
} from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxId } from '../types/TrackedTxId'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'

export function diffTrackedTxConfigurations(
  runtimeEntries: TrackedTxConfigEntry[],
  databaseEntries: TrackedTxsConfigRecord[],
): {
  toAdd: TrackedTxsConfigRecord[]
  toTrim: { id: TrackedTxId; untilTimestampExclusive: UnixTime }[]
  toRemove: TrackedTxId[]
} {
  const toAdd: TrackedTxsConfigRecord[] = []
  const toTrim: { id: TrackedTxId; untilTimestampExclusive: UnixTime }[] = []

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
          entry.untilTimestampExclusive < databaseEntry.untilTimestampExclusive)
      ) {
        toTrim.push({
          id: entryUse.id,
          untilTimestampExclusive: entry.untilTimestampExclusive,
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

  return { toAdd, toTrim, toRemove }
}
