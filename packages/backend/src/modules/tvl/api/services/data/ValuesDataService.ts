import { assert, Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { Dictionary, groupBy } from 'lodash'
import { Clock } from '../../../../../tools/Clock'
import {
  ValueRecord,
  ValueRepository,
} from '../../../repositories/ValueRepository'
import { getConfiguredValuesForTimestamp } from '../../utils/getConfiguredValuesForTimestamp'
import { getLaggingAndSyncing } from '../../utils/getLaggingAndSyncing'
import { ApiProject } from '../../utils/types'

interface Dependencies {
  readonly valueRepository: ValueRepository
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

      const { lagging, excluded } = getLaggingAndSyncing<ValueRecord>(
        Array.from(project.sources.entries()).map(([source, v]) => ({
          id: source,
          minTimestamp: v.minTimestamp,
        })),
        valuesByTimestamp,
        (value: ValueRecord) => value.dataSource,
        targetTimestamp,
      )

      lagging.forEach((l) =>
        result.lagging.set(`${project.id}-${l.id}`, { ...l }),
      )
      excluded.forEach((s) => result.syncing.add(s))

      const valuesByTimestampForProject: Dictionary<ValueRecord[]> = {}

      const timestamps = this.$.clock.getAllTimestampsForApi(targetTimestamp, {
        minTimestampOverride: project.minTimestamp,
      })
      for (const timestamp of timestamps) {
        const configuredValues = getConfiguredValuesForTimestamp(
          valuesByTimestamp[timestamp.toString()],
          project,
          new UnixTime(+timestamp),
          result.lagging,
          result.syncing,
        )

        valuesByTimestampForProject[timestamp.toString()] = configuredValues
      }

      assert(
        valuesByTimestamp[targetTimestamp.toString()],
        `Missing value for last hour for ${projectId}, timestamp: ${targetTimestamp.toString()}`,
      )

      result.valuesByTimestampForProject[projectId] =
        valuesByTimestampForProject
    }

    return result
  }
}
