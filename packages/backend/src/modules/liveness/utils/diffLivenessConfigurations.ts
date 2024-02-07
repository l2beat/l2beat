import { UnixTime } from '@l2beat/shared-pure'

import { LivenessConfigurationRecord } from '../repositories/LivenessConfigurationRepository'
import { LivenessConfigEntry } from '../types/LivenessConfig'
import { LivenessId } from '../types/LivenessId'

export function diffLivenessConfigurations(
  runtimeEntries: LivenessConfigEntry[],
  databaseEntries: LivenessConfigurationRecord[],
): {
  toAdd: LivenessConfigEntry[]
  toTrim: { id: LivenessId; untilTimestamp: UnixTime }[]
  toRemove: LivenessId[]
} {
  const toAdd: LivenessConfigEntry[] = []
  const toTrim: { id: LivenessId; untilTimestamp: UnixTime }[] = []
  for (const entry of runtimeEntries) {
    const databaseEntry = databaseEntries.find((x) => entry.id === x.id)
    if (!databaseEntry) {
      toAdd.push(entry)
    } else {
      if (
        entry.untilTimestamp &&
        (!databaseEntry.untilTimestamp ||
          entry.untilTimestamp < databaseEntry.untilTimestamp)
      ) {
        toTrim.push({ id: entry.id, untilTimestamp: entry.untilTimestamp })
      }
    }
  }

  const toRemove = databaseEntries
    .filter((x) => !runtimeEntries.find((y) => x.id === y.id))
    .map((x) => x.id)

  return { toAdd, toTrim, toRemove }
}
