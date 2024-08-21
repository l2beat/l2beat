import { Logger } from '@l2beat/backend-tools'
import { assert, UnixTime } from '@l2beat/shared-pure'

import { Database, ValueRecord } from '@l2beat/database'
import { Dictionary, groupBy } from 'lodash'
import { Clock } from '../../../../../tools/Clock'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import { getValuesStatus } from '../../utils/getValuesStatus'
import { ApiProject } from '../../utils/types'

interface Dependencies {
  readonly db: Database
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
    const valueRecords = await this.$.db.value.getForProjects(
      projects.map((p) => p.id),
    )

    const valuesByProject = groupBy(valueRecords, 'projectId')

    const result: Dictionary<Dictionary<ValueRecord[]>> = {}
    for (const [projectId, projectValues] of Object.entries(valuesByProject)) {
      const project = projects.find((p) => p.id === projectId)
      assert(project, `Project ${projectId.toString()} not found`)

      const valuesByTimestamp = groupBy(projectValues, 'timestamp')
      const status = getValuesStatus(
        project,
        valuesByTimestamp,
        targetTimestamp,
      )

      const timestamps = this.$.clock.getAllTimestampsForApi(targetTimestamp, {
        minTimestampOverride: project.minTimestamp,
      })
      const valuesByTimestampForProject: Dictionary<ValueRecord[]> = {}
      for (const timestamp of timestamps) {
        const values = (valuesByTimestamp[timestamp.toString()] ?? []).filter(
          (v) => {
            if (status.excluded.has(v.dataSource)) {
              return false
            }
            const projectSource = project.sources.get(v.dataSource)
            if (!projectSource) return false

            return timestamp.gte(projectSource.minTimestamp)
          },
        )

        const interpolatedValues = status.lagging
          .filter((l) => timestamp.gt(l.latestTimestamp))
          .map((l) => {
            const record = valuesByTimestamp[
              l.latestTimestamp.toString()
            ]?.find((v) => l.id === v.dataSource)
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
    }
  }
}
