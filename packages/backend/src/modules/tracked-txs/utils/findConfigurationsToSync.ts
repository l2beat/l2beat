import { assert } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'
import { isTimestampInRange } from './isTimestampInRange'

export function findConfigurationsToSync(
  runtimeConfigurations: TrackedTxConfigEntry[],
  databaseEntries: TrackedTxsConfigRecord[],
  from: UnixTime,
  to: UnixTime,
): TrackedTxConfigEntry[] {
  return runtimeConfigurations.filter((entry) => {
    const dbEntry = databaseEntries.find((dbEntry) =>
      entry.uses.map((u) => u.id).includes(dbEntry.id),
    )
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
