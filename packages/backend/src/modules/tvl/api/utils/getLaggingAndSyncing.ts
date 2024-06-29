import { UnixTime } from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'

// If there is no data before it then most likely indexer is still syncing data
// or there is no data (zeroes)
export const CONSIDER_EXCLUDED_AFTER_DAYS = 7

/**
 * WARNING:  In this function we assume that the values data is saved to DB without holes with hourly granularity
 */
export function getLaggingAndSyncing<T>(
  configurations: { id: string; minTimestamp: UnixTime }[],
  recordsByTimestamp: Dictionary<T[]>,
  getIdFromRecord: (t: T) => string,
  targetTimestamp: UnixTime,
): {
  lagging: {
    id: string
    latestTimestamp: UnixTime
    latestValue: T
  }[]
  excluded: string[]
} {
  const lagging = []
  const excluded = []

  for (const configuration of configurations) {
    const latestValue = recordsByTimestamp[targetTimestamp.toString()]?.find(
      (v) => getIdFromRecord(v) === configuration.id,
    )
    if (latestValue) {
      continue
    }

    const excludedHeuristic = UnixTime.max(
      targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days'),
      configuration.minTimestamp,
    )
    const valueAtExcludedHeuristic = recordsByTimestamp[
      excludedHeuristic.toString()
    ]?.find((v) => getIdFromRecord(v) === configuration.id)
    if (valueAtExcludedHeuristic === undefined) {
      excluded.push(configuration.id)
      continue
    }

    for (
      let i = targetTimestamp.add(-1, 'hours').toNumber();
      i >=
      targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days').toNumber();
      i -= 3600
    ) {
      const valueAtTimestamp = recordsByTimestamp[i.toString()]?.find(
        (v) => getIdFromRecord(v) === configuration.id,
      )

      if (valueAtTimestamp) {
        lagging.push({
          id: configuration.id,
          latestTimestamp: new UnixTime(i),
          latestValue: valueAtTimestamp,
        })
        break
      }
    }
  }

  return {
    lagging,
    excluded,
  }
}
