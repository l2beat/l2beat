import { assert } from '@l2beat/backend-tools'
import { notUndefined, UnixTime } from '@l2beat/shared-pure'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'
import { isConfigToSync } from './isConfigToSync'

/* EXAMPLE

Given 3 configurations:

- config1: sinceTimestampInclusive: 0, untilTimestampExclusive: undefined
- config2: sinceTimestampInclusive: 0, untilTimestampExclusive: undefined
- config3: sinceTimestampInclusive: 0, untilTimestampExclusive: 30
- config4: sinceTimestampInclusive: 0, untilTimestampExclusive: 60

and a sync range from: 0, to: 50

the result will be:

- {configurationsToSync: [config1, config2, config3, config4], syncTo: 30}


The next sync range asked by indexer should be from 30 to 50, for this one the result will be:

- {configurationsToSync: [config1, config2, config4], syncTo: 50}

Next range from 50 to 100 will be:

- {configurationsToSync: [config1, config2, config4], syncTo: 60}

Next range from 60 to 100 will be:

- {configurationsToSync: [config1, config2], syncTo: 100}

*/

export function findConfigurationsToSync(
  enabledUpdaterTypes: string[],
  runtimeConfigurations: TrackedTxConfigEntry[],
  databaseEntries: TrackedTxsConfigRecord[],
  from: UnixTime,
  to: UnixTime,
): { configurationsToSync: TrackedTxConfigEntry[]; syncTo: UnixTime } {
  const allSyncTo: number[] = []

  const configurationsToSync = runtimeConfigurations
    .map((config) => {
      const filteredUses = config.uses.filter((use) => {
        if (!enabledUpdaterTypes.includes(use.type)) {
          return false
        }

        const dbEntry = databaseEntries.find((dbEntry) => dbEntry.id === use.id)
        assert(dbEntry, 'Database entry should not be undefined here!')
        const { include, syncTo } = isConfigToSync(config, dbEntry, from, to)

        if (syncTo) {
          allSyncTo.push(syncTo.toNumber())
        }

        return include
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

  const syncTo = Math.min(to.toNumber(), ...allSyncTo)
  return { configurationsToSync, syncTo: new UnixTime(syncTo) }
}
