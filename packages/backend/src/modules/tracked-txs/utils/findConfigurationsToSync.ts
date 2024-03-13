import { assert } from '@l2beat/backend-tools'
import { notUndefined, UnixTime } from '@l2beat/shared-pure'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'
import { isTimestampInRange } from './isTimestampInRange'

export function findConfigurationsToSync(
  runtimeConfigurations: TrackedTxConfigEntry[],
  databaseEntries: TrackedTxsConfigRecord[],
  from: UnixTime,
  to: UnixTime,
): { configurationsToSync: TrackedTxConfigEntry[]; syncTo: UnixTime } {
  const configs = runtimeConfigurations
    .map((config) => {
      const filteredUses = config.uses.filter((use) => {
        const dbEntry = databaseEntries.find((dbEntry) => dbEntry.id === use.id)
        assert(dbEntry, 'Database entry should not be undefined here!')

        return isTimestampInRange(
          config.sinceTimestamp,
          config.untilTimestamp,
          dbEntry.lastSyncedTimestamp,
          from,
          to,
        )
      })

      if (filteredUses.length === 0) {
        return
      }

      return {
        ...config,
        uses: filteredUses,
      }
    })
    .filter(notUndefined)

  const untilTimestamps = configs
    .map((c) => c.untilTimestamp?.toNumber())
    .filter(notUndefined)
  const syncTo = Math.min(to.toNumber(), ...untilTimestamps)

  return { configurationsToSync: configs, syncTo: new UnixTime(syncTo) }
}
