import { UnixTime } from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'
import { ValueRecord } from '../../repositories/ValueRepository'
import { ApiProject } from './types'

const CONSIDER_SYNCING_AFTER_DAYS = 7

// In this function we assume that the values data is saved to DB without holes with hourly granularity
export function getLaggingAndSyncing(
  valuesByTimestamp: Dictionary<ValueRecord[]>,
  targetTimestamp: UnixTime,
  project: ApiProject,
): {
  lagging: {
    source: string
    latestTimestamp: UnixTime
    latestValue: ValueRecord
  }[]
  syncing: string[]
} {
  const lagging = []
  const syncing = []

  const configuredSources = Array.from(project.sources.entries())

  for (const [source, { minTimestamp }] of configuredSources) {
    const latestValue = valuesByTimestamp[targetTimestamp.toString()]?.find(
      (v) => v.dataSource === source,
    )

    if (latestValue) {
      continue
    }

    const syncingHeuristic = UnixTime.max(
      targetTimestamp.add(-CONSIDER_SYNCING_AFTER_DAYS, 'days'),
      minTimestamp,
    )

    const valueAtSyncingHeuristic = valuesByTimestamp[
      syncingHeuristic.toString()
    ]?.find((v) => v.dataSource === source)

    if (valueAtSyncingHeuristic === undefined) {
      syncing.push(`${project.id}-${source}`)
      continue
    }

    for (
      let i = targetTimestamp.add(-1, 'hours').toNumber();
      i >= targetTimestamp.add(-CONSIDER_SYNCING_AFTER_DAYS, 'days').toNumber();
      i -= 3600
    ) {
      const valueAtTimestamp = valuesByTimestamp[i.toString()]?.find(
        (v) => v.dataSource === source,
      )

      if (valueAtTimestamp) {
        lagging.push({
          source: `${project.id}-${source}`,
          latestTimestamp: new UnixTime(i),
          latestValue: valueAtTimestamp,
        })
        break
      }
    }
  }

  return {
    lagging,
    syncing,
  }
}
