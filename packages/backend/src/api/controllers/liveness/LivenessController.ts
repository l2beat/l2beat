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
    for (const project of this.projects) {
      if (project.livenessConfig === undefined) {
        continue
      }
      const records = await this.livenessRepository.getWithType(
        project.projectId,
      )

      const groupedByType = groupByType(records)
      const intervals = calcIntervalWithAvgsPerProject(groupedByType)
      const withAnomalies = calculateAnomaliesPerProject(intervals)
      projects[project.projectId.toString()] = withAnomalies
    }

    return { projects }
  }
}
