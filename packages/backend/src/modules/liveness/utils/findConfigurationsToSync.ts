import { assert } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { LivenessConfigurationRecord } from '../repositories/LivenessConfigurationRepository'
import { LivenessConfigEntry } from '../types/LivenessConfig'
import { isTimestampInRange } from './isTimestampInRange'

export function findConfigurationsToSync(
  runtimeConfigurations: LivenessConfigEntry[],
  databaseEntries: LivenessConfigurationRecord[],
  from: UnixTime,
  to: UnixTime,
): LivenessConfigEntry[] {
  return runtimeConfigurations.filter((entry) => {
    const dbEntry = databaseEntries.find((dbEntry) => dbEntry.id === entry.id)
    assert(dbEntry, 'Database entry should not be undefined here!')

    return isTimestampInRange(
      entry.sinceTimestamp,
      entry.untilTimestamp,
      dbEntry.lastSyncedTimestamp,
      from,
      to,
    )
  })
}
