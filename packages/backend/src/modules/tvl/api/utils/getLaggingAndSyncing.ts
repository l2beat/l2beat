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
) {
  const lagging: {
    source: string
    latestTimestamp: UnixTime
    latestValue: ValueRecord
  }[] = []
  const syncing: string[] = []

  const latestValues = valuesByTimestamp[targetTimestamp.toString()]

  const configuredSources = Array.from(project.sources.keys())

  for (const source of configuredSources) {
    const v = latestValues.find((v) => v.dataSource === source)

    if (v) {
      continue
    }

    const vv = valuesByTimestamp[
      targetTimestamp.add(-CONSIDER_SYNCING_AFTER_DAYS, 'days').toString()
    ]?.find((v) => v.dataSource === source)

    if (vv === undefined) {
      syncing.push(`${project.id}-${source}`)
      continue
    }

    for (
      let i = targetTimestamp.add(-1, 'hours').toNumber();
      i <= targetTimestamp.add(-CONSIDER_SYNCING_AFTER_DAYS, 'days').toNumber();
      i += 3600
    ) {
      const vvv = valuesByTimestamp[i.toString()]?.find(
        (v) => v.dataSource === source,
      )

      if (vvv) {
        lagging.push({
          source: `${project.id}-${source}`,
          latestTimestamp: new UnixTime(i),
          latestValue: vvv,
        })
      }
    }
  }

  return {
    lagging,
    syncing,
  }
}
