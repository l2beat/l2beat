import type { ValueRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { Dictionary } from 'lodash'
import type { TvsProject } from './get-tvs-projects'

const CONSIDER_EXCLUDED_AFTER_DAYS = 7

export function getValuesStatus(
  project: TvsProject,
  valuesByTimestamp: Dictionary<ValueRecord[]>,
  targetTimestamp: UnixTime,
) {
  const lagging = []
  const excluded = new Set<string>()

  const configuredSources = Array.from(project.sources.entries())

  for (const [source, { minTimestamp }] of configuredSources) {
    const latestValue = valuesByTimestamp[targetTimestamp.toString()]?.find(
      (v) => v.dataSource === source,
    )

    if (latestValue) {
      continue
    }

    const excludedHeuristic = UnixTime.max(
      targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days'),
      minTimestamp,
    )

    const valueAtExcludedHeuristic = valuesByTimestamp[
      excludedHeuristic.toString()
    ]?.find((v) => v.dataSource === source)

    if (valueAtExcludedHeuristic === undefined) {
      excluded.add(source)
      continue
    }

    for (
      let i = targetTimestamp.add(-1, 'hours').toNumber();
      i >=
      targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days').toNumber();
      i -= 3600
    ) {
      const valueAtTimestamp = valuesByTimestamp[i.toString()]?.find(
        (v) => v.dataSource === source,
      )

      if (valueAtTimestamp) {
        lagging.push({
          id: valueAtTimestamp.dataSource,
          latestTimestamp: valueAtTimestamp.timestamp,
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
