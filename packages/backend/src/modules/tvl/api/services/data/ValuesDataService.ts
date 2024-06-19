import { assert, Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { Dictionary, groupBy } from 'lodash'
import {
  ValueRecord,
  ValueRepository,
} from '../../../repositories/ValueRepository'
import { SyncOptimizer } from '../../../utils/SyncOptimizer'
import { ApiProject } from '../../utils/types'

interface Dependencies {
  readonly valueRepository: ValueRepository
  readonly syncOptimizer: SyncOptimizer
  logger: Logger
}

export class ValuesDataService {
  constructor(private readonly $: Dependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getValuesForProjects(
    projects: ApiProject[],
    targetTimestamp: UnixTime,
  ) {
    const values = await this.$.valueRepository.getForProjects(
      projects.map((p) => p.id),
    )
    const valuesByProject = groupBy(values, 'projectId')

    const result = {
      valuesByTimestampForProject: {} as Dictionary<Dictionary<ValueRecord[]>>,
      lagging: new Map<
        string,
        { latestTimestamp: UnixTime; latestValue: ValueRecord }
      >(),
      syncing: new Set<string>(),
    }

    for (const [projectId, projectValues] of Object.entries(valuesByProject)) {
      const valuesByTimestamp = groupBy(projectValues, 'timestamp')
      const project = projects.find((p) => p.id === projectId)
      assert(project, `Project ${projectId.toString()} not found`)

      const { lagging, syncing } = getLaggingAndSyncing(
        valuesByTimestamp,
        targetTimestamp,
        project,
      )

      lagging.forEach((l) => result.lagging.set(l.source, { ...l }))
      syncing.forEach((s) => result.syncing.add(s))

      const valuesByTimestampForProject: Dictionary<ValueRecord[]> = {}

      for (const [timestamp, values] of Object.entries(valuesByTimestamp)) {
        if (!this.shouldTimestampBeCalculated(new UnixTime(+timestamp))) {
          continue
        }

        const configuredValues = getConfiguredValuesForTimestamp(
          values,
          project,
          new UnixTime(+timestamp),
          result.lagging,
          result.syncing,
        )

        valuesByTimestampForProject[timestamp] = configuredValues
      }

      // TODO: Interpolate here
      assert(
        valuesByTimestamp[targetTimestamp.toString()],
        `Missing value for last hour for ${projectId}, timestamp: ${targetTimestamp.toString}`,
      )

      result.valuesByTimestampForProject[projectId] =
        valuesByTimestampForProject
    }

    return result
  }

  shouldTimestampBeCalculated(timestamp: UnixTime) {
    if (timestamp.isFull('day')) {
      return true
    }

    if (timestamp.isFull('six hours')) {
      return timestamp.gte(this.$.syncOptimizer.sixHourlyCutOff)
    }

    if (timestamp.isFull('hour')) {
      return timestamp.gte(this.$.syncOptimizer.hourlyCutOff)
    }
  }
}

function getConfiguredValuesForTimestamp(
  values: ValueRecord[],
  project: ApiProject,
  timestamp: UnixTime,
  lagging: Map<string, { latestTimestamp: UnixTime; latestValue: ValueRecord }>,
  syncing: Set<string>,
) {
  const configuredSources = Array.from(project.sources.values())
    .filter((s) => s.minTimestamp.lte(timestamp))
    .filter((s) => !syncing.has(`${project.id}-${s.name}`))
    .map((s) => s.name)

  const configuredValues = values.filter((v) =>
    configuredSources.includes(v.dataSource),
  )

  const valuesSources = values.map((x) => x.dataSource)
  const missingSources = configuredSources.filter(
    (s) => !valuesSources.includes(s),
  )

  for (const source of missingSources) {
    const laggingEntry = lagging.get(`${project.id}-${source}`)
    assert(laggingEntry, `Missing lagging entry for ${project.id}-${source}`)

    configuredValues.push({
      ...laggingEntry.latestValue,
      timestamp: timestamp,
    })
  }

  return configuredValues
}

function getLaggingAndSyncing(
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

  const configuredSources = Array.from(project.sources.values())

  for (const source of configuredSources) {
    const v = latestValues.find((v) => v.dataSource === source.name)

    if (v) {
      continue
    }

    if (v === undefined) {
      syncing.push(`${project.id}-${source.name}`)
      continue
    }

    const vv = valuesByTimestamp[
      targetTimestamp.add(-7, 'days').toString()
    ].find((v) => v.dataSource === source.name)

    if (vv === undefined) {
      syncing.push(`${project.id}-${source.name}`)
      continue
    }

    for (
      let i = targetTimestamp.add(-1, 'hours').toNumber();
      i <= targetTimestamp.add(-7, 'days').toNumber();
      i += 3600
    ) {
      const vvv = valuesByTimestamp[i.toString()].find(
        (v) => v.dataSource === source.name,
      )

      if (vvv) {
        lagging.push({
          source: `${project.id}-${source.name}`,
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
