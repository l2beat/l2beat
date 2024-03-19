import { assert } from '@l2beat/backend-tools'
import { notUndefined, UnixTime } from '@l2beat/shared-pure'

import { TrackedTxsConfigRecord } from '../repositories/TrackedTxsConfigsRepository'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'
import { isTimestampInRange } from './isTimestampInRange'

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
  const configs = runtimeConfigurations
    .map((config) => {
      const filteredUses = config.uses.filter((use) => {
        if (!enabledUpdaterTypes.includes(use.type)) {
          return false
        }

        const dbEntry = databaseEntries.find((dbEntry) => dbEntry.id === use.id)
        assert(dbEntry, 'Database entry should not be undefined here!')

        return isTimestampInRange(
          config.sinceTimestampInclusive,
          config.untilTimestampExclusive,
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
    .map((c) => {
      if (
        c.untilTimestampExclusive &&
        !c.untilTimestampExclusive.equals(from)
      ) {
        return c.untilTimestampExclusive.toNumber()
      }
    })
    .filter(notUndefined)

  const syncTo = Math.min(to.toNumber(), ...untilTimestamps)

  return { configurationsToSync: configs, syncTo: new UnixTime(syncTo) }
}
