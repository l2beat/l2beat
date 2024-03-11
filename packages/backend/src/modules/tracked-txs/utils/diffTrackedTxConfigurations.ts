import { UnixTime } from '@l2beat/shared-pure'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'
import { TrackedTxsId } from '../types/TrackedTxsId'

export function diffTrackedTxConfigurations(
  runtimeEntries: TrackedTxConfigEntry[],
  databaseEntries: TrackedTxsConfigRecord[],
): {
  toAdd: TrackedTxConfigEntry[]
  toTrim: { id: TrackedTxsId; untilTimestamp: UnixTime }[]
  toRemove: TrackedTxsId[]
} {
  const toAdd: TrackedTxConfigEntry[] = []
  const toTrim: { id: TrackedTxsId; untilTimestamp: UnixTime }[] = []
  const toRemove: TrackedTxsId[] = []

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
