import { Logger } from '@l2beat/backend-tools'
import {
  LivenessApiResponse,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { Clock } from '../../../core/Clock'
import { Project } from '../../../model'
import { LivenessConfigurationRepository } from '../../../peripherals/database/LivenessConfigurationRepository'
import { LivenessRepository } from '../../../peripherals/database/LivenessRepository'
import { calculateAnomaliesPerProject } from './calculateAnomalies'
import { calcIntervalWithAvgsPerProject } from './calculateIntervalWithAverages'
import { groupByType } from './groupByProjectIdAndType'

type LivenessResult =
  | {
      type: 'success'
      data: LivenessApiResponse
    }
  | {
      type: 'error'
      error: 'DATA_NOT_FULLY_SYNCED'
    }

export class LivenessController {
  constructor(
    private readonly livenessRepository: LivenessRepository,
    private readonly projects: Project[],
    private readonly clock: Clock,
    private readonly configurationRepository: LivenessConfigurationRepository,
    private readonly logger: Logger,
  ) {}

  async getLiveness(): Promise<LivenessResult> {
    const projects: LivenessApiResponse['projects'] = {}
    console.time('getLiveness')

    const requiredTimestamp = this.clock.getLastHour().add(-1, 'hours')
    const configurations = await this.configurationRepository.getAll()
    const areAllSynced = configurations.every((config) =>
      config.lastSyncedTimestamp?.gte(requiredTimestamp),
    )

    if (!areAllSynced) {
      console.timeEnd('getLiveness')
      this.logger.error('[API]: Liveness data is not synced')
      return { type: 'error', error: 'DATA_NOT_FULLY_SYNCED' }
    }

    await Promise.all(
      this.projects
        .filter((p) => !p.isArchived)
        .map(async (project) => {
          if (project.livenessConfig === undefined) {
            return
          }
          console.time(`getWithType ${project.projectId.toString()}`)
          const records =
            await this.livenessRepository.getWithTypeDistinctTimestamp(
              project.projectId,
            )
          console.timeEnd(`getWithType ${project.projectId.toString()}`)

          console.time(`groupedByType ${project.projectId.toString()}`)
          const groupedByType = groupByType(records)
          console.timeEnd(`groupedByType ${project.projectId.toString()}`)

          console.time(`intervals ${project.projectId.toString()}`)
          const intervals = calcIntervalWithAvgsPerProject(groupedByType)
          console.timeEnd(`intervals ${project.projectId.toString()}`)

          console.time(`withAnomalies ${project.projectId.toString()}`)
          const withAnomalies = calculateAnomaliesPerProject(intervals)
          console.timeEnd(`withAnomalies ${project.projectId.toString()}`)

          if (withAnomalies && project.livenessConfig.duplicateData) {
            for (const duplicateData of project.livenessConfig.duplicateData) {
              withAnomalies[duplicateData.to] = {
                ...withAnomalies[duplicateData.from],
              }
            }
          }

          projects[project.projectId.toString()] = withAnomalies
        }),
    )

    console.timeEnd('getLiveness')
    return { type: 'success', data: { projects } }
  }

  async getLivenessPerProjectAndType(
    projectId: ProjectId,
    livenessType: LivenessType,
  ): Promise<{
    projectId: ProjectId
    type: LivenessType
    data: UnixTime[]
  }> {
    const records = await this.livenessRepository.getByProjectIdAndType(
      projectId,
      livenessType,
      UnixTime.now().add(-30, 'days'),
    )

    return {
      projectId: projectId,
      type: livenessType,
      data: records.map((r) => r.timestamp).sort(),
    }
  }
}
