import { LivenessApiResponse } from '@l2beat/shared-pure'

import { Project } from '../../../model'
import { LivenessRepository } from '../../../peripherals/database/LivenessRepository'
import { calculateAnomaliesPerProject } from './calculateAnomalies'
import { calcIntervalWithAvgsPerProject } from './calculateIntervalWithAverages'
import { groupByType } from './groupByProjectIdAndType'

export class LivenessController {
  constructor(
    private readonly livenessRepository: LivenessRepository,
    private readonly projects: Project[],
  ) {}

  async getLiveness(): Promise<LivenessApiResponse> {
    const projects: LivenessApiResponse['projects'] = {}
    console.time('getLiveness')

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
    return { projects }
  }
}
