import { UnixTime } from '@l2beat/shared-pure'

import { LivenessConfigurationRecord } from '../../../peripherals/database/LivenessConfigurationRepository'
import { LivenessConfigEntry } from '../types/LivenessConfig'

export function getSafeHeight(
  databaseEntries: LivenessConfigurationRecord[],
  toAdd: LivenessConfigEntry[],
  minTimestamp: UnixTime,
): number {
  if (databaseEntries.length === 0 && toAdd.length === 0) {
    return minTimestamp.toNumber()
  }

  const databaseTimestamps = databaseEntries.map(
    (c) => c.lastSyncedTimestamp ?? c.sinceTimestamp,
  )

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
