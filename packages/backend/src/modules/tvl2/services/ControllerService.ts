import { assert, Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { Dictionary, groupBy } from 'lodash'
import { ApiProject } from '../api/Tvl2Controller'
import { ValueRecord, ValueRepository } from '../repositories/ValueRepository'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export interface ControllerServiceDependencies {
  readonly valueRepository: ValueRepository
  readonly syncOptimizer: SyncOptimizer
  logger: Logger
}

export class ControllerService {
  constructor(private readonly $: ControllerServiceDependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getValuesForProjects(projects: ApiProject[], lastHour: UnixTime) {
    const values = await this.$.valueRepository.getForProjects(
      projects.map((p) => p.id),
    )

    const sixHourlyCutOff = this.$.syncOptimizer.sixHourlyCutOff
    const hourlyCutOff = this.$.syncOptimizer.hourlyCutOff

    const valuesToSync = values.filter((value) => {
      if (value.timestamp.isFull('day')) {
        return true
      }

      if (value.timestamp.isFull('six hours')) {
        return value.timestamp.gte(sixHourlyCutOff)
      }

      if (value.timestamp.isFull('hour')) {
        return value.timestamp.gte(hourlyCutOff)
      }
    })

    const valuesByProject = groupBy(valuesToSync, 'projectId')

    const valuesByProjectByTimestamp: Dictionary<Dictionary<ValueRecord[]>> = {}

    for (const [projectId, valueByProject] of Object.entries(valuesByProject)) {
      const vv = groupBy(valueByProject, 'timestamp')
      const project = projects.find((p) => p.id === projectId)
      assert(project, `Project ${projectId.toString()} not found`)

      const filteredValues = filterValues(vv, project)

      // TODO: Interpolate here
      assert(
        vv[lastHour.toString()],
        `Missing value for last hour for ${projectId}, timestamp: ${lastHour.toString}`,
      )

      valuesByProjectByTimestamp[projectId] = filteredValues
    }

    const projectsMinTimestamp = projects
      .map((x) => x.minTimestamp)
      .reduce((acc, curr) => UnixTime.min(acc, curr), UnixTime.now())

    const minTimestamp = projectsMinTimestamp.toEndOf('day')

    return {
      valuesByProjectByTimestamp,
      dailyStart: minTimestamp,
      sixHourlyStart: UnixTime.max(sixHourlyCutOff, minTimestamp).toEndOf(
        'day',
      ),
      hourlyStart: UnixTime.max(hourlyCutOff, minTimestamp),
    }
  }
}

export function filterValues(
  vv: Dictionary<ValueRecord[]>,
  project: ApiProject,
) {
  return Object.fromEntries(
    Object.entries(vv).map(([timestamp, values]) => {
      const configuredSources = getConfiguredSources(
        values,
        project,
        new UnixTime(+timestamp),
      )

      return [
        timestamp,
        values.filter((v) => configuredSources.includes(v.dataSource)),
      ]
    }),
  )
}

function getConfiguredSources(
  values: ValueRecord[],
  project: ApiProject,
  timestamp: UnixTime,
) {
  const valuesSources = values.map((x) => x.dataSource)
  const configuredSources = Array.from(project.sources.values())
    .filter((s) => s.minTimestamp.lte(timestamp))
    .map((s) => s.name)

  const missingSources = configuredSources.filter(
    (s) => !valuesSources.includes(s),
  )

  // TODO: Interpolate here
  assert(
    missingSources.length === 0,
    `Missing data sources [${missingSources.join(
      ', ',
    )}] for ${project.id.toString()} at ${timestamp.toNumber()}`,
  )
  return configuredSources
}
