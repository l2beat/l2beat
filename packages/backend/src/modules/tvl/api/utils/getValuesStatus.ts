import { UnixTime } from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'
import { CONSIDER_EXCLUDED_AFTER_DAYS } from '../../../../tools/uif/IndexerService'
import { ValueRecord } from '../../repositories/ValueRepository'
import { ApiProject } from './types'

export function getValuesStatus(
  project: ApiProject,
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
