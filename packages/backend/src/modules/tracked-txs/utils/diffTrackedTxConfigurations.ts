import { UnixTime } from '@l2beat/shared-pure'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'
import { TrackedTxId } from '../types/TrackedTxId'

export function diffTrackedTxConfigurations(
  runtimeEntries: TrackedTxConfigEntry[],
  databaseEntries: TrackedTxsConfigRecord[],
): {
  toAdd: TrackedTxConfigEntry[]
  toTrim: { id: TrackedTxId; untilTimestamp: UnixTime }[]
  toRemove: TrackedTxId[]
} {
  const toAdd: TrackedTxConfigEntry[] = []
  const toTrim: { id: TrackedTxId; untilTimestamp: UnixTime }[] = []
  const toRemove: TrackedTxId[] = []

  for (const entry of runtimeEntries) {
    for (const entryUse of entry.uses) {
      const databaseEntry = databaseEntries.find((e) => e.id === entryUse.id)
      if (!databaseEntry) {
        toAdd.push(entry)
      } else if (
        entry.untilTimestamp &&
        (!databaseEntry.untilTimestamp ||
          entry.untilTimestamp < databaseEntry.untilTimestamp)
      ) {
        toTrim.push({ id: entryUse.id, untilTimestamp: entry.untilTimestamp })
      } else {
        toRemove.push(entryUse.id)
      }
    }
  }

  return { toAdd, toTrim, toRemove }
}
