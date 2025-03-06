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

    const excludedHeuristic = Math.max(
      targetTimestamp - CONSIDER_EXCLUDED_AFTER_DAYS * UnixTime.DAY,
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
      let i = targetTimestamp - 1 * UnixTime.HOUR;
      i >= targetTimestamp - CONSIDER_EXCLUDED_AFTER_DAYS * UnixTime.DAY;
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
