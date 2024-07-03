import { assert, Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { Dictionary, groupBy } from 'lodash'
import { Clock } from '../../../../../tools/Clock'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import {
  ValueRecord,
  ValueRepository,
} from '../../../repositories/ValueRepository'
import { ApiProject } from '../../utils/types'

interface Dependencies {
  readonly valueRepository: ValueRepository
  readonly indexerService: IndexerService
  readonly clock: Clock
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
    const [valueRecords, status] = await Promise.all([
      this.$.valueRepository.getForProjects(projects.map((p) => p.id)),
      this.$.indexerService.getValuesStatus(targetTimestamp),
    ])

    const valuesByProject = groupBy(valueRecords, 'projectId')

    const result: Dictionary<Dictionary<ValueRecord[]>> = {}
    for (const [projectId, projectValues] of Object.entries(valuesByProject)) {
      const project = projects.find((p) => p.id === projectId)
      assert(project, `Project ${projectId.toString()} not found`)

      const valuesByTimestamp = groupBy(projectValues, 'timestamp')

      const timestamps = this.$.clock.getAllTimestampsForApi(targetTimestamp, {
        minTimestampOverride: project.minTimestamp,
      })
      const valuesByTimestampForProject: Dictionary<ValueRecord[]> = {}
      for (const timestamp of timestamps) {
        const values = (valuesByTimestamp[timestamp.toString()] ?? []).filter(
          (v) => {
            if (status.excluded.has(`${v.projectId}_${v.dataSource}`)) {
              return false
            }
            const projectSource = project.sources.get(v.dataSource)
            if (!projectSource) return false

            return timestamp.gte(projectSource.minTimestamp)
          },
        )

        const interpolatedValues = status.lagging
          .filter((l) => l.id.split('_')[0] === projectId)
          .filter((l) => timestamp.gt(l.latestTimestamp))
          .map((l) => {
            const record = valuesByTimestamp[
              l.latestTimestamp.toString()
            ]?.find((v) => l.id === `${v.projectId}_${v.dataSource}`)
            assert(
              record,
              `Value should be defined for ${
                l.id
              } at ${l.latestTimestamp.toString()} in project ${projectId}`,
            )
            return record
          })

        valuesByTimestampForProject[timestamp.toString()] = [
          ...values,
          ...interpolatedValues,
        ]
      }

      result[projectId] = valuesByTimestampForProject
    }

    return {
      valuesByTimestampForProjects: result,
      lagging: new Map(status.lagging.map((l) => [l.id, l.latestTimestamp])),
      excluded: new Set<string>(status.excluded),
    }
  }
}
