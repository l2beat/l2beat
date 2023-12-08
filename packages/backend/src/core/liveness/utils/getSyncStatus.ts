import { UnixTime } from '@l2beat/shared-pure'

import { LivenessConfigurationRecord } from '../../../peripherals/database/LivenessConfigurationRepository'
import { LivenessConfigEntry } from '../types/LivenessConfig'

export function getSyncStatus(
  databaseEntries: LivenessConfigurationRecord[],
  toAdd: LivenessConfigEntry[],
  minTimestamp: UnixTime,
) {
  if (toAdd.length > 0) {
    return minTimestamp
  }

  const syncedTimestamps = databaseEntries.map(
    (c) => c.lastSyncedTimestamp ?? minTimestamp,
  )

  const syncStatus = syncedTimestamps.reduce((min, value) =>
    min.lt(value) ? min : value,
  )

  return syncStatus
}
