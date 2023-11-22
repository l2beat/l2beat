import { layer2s } from '@l2beat/config'
import { LivenessApiResponse, LivenessType } from '@l2beat/shared-pure'

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
      this.projects.map(async (project) => {
        if (project.livenessConfig === undefined) {
          return
        }
        console.time(`getWithType ${project.projectId.toString()}`)
        const records = await this.livenessRepository.getWithType(
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

        if (withAnomalies) {
          const l2project = layer2s.find((l) => l.id === project.projectId)
          const anomalies = withAnomalies.anomalies
          if (l2project?.config.liveness?.duplicatedData?.batchSubmissions) {
            withAnomalies.batchSubmissions = { ...withAnomalies.stateUpdates }
            if (anomalies) {
              withAnomalies.anomalies = [
                ...anomalies,
                ...anomalies.map((a) => ({
                  ...a,
                  type: LivenessType('DA'),
                })),
              ]
            }
          } else if (l2project?.config.liveness?.duplicatedData?.stateUpdates) {
            withAnomalies.stateUpdates = { ...withAnomalies.batchSubmissions }
            if (anomalies) {
              withAnomalies.anomalies = [
                ...anomalies,
                ...anomalies.map((a) => ({
                  ...a,
                  type: LivenessType('STATE'),
                })),
              ]
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
