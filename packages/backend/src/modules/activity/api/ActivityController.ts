import {
  ActivityApiCharts,
  ActivityApiResponse,
  assert,
  json,
  ProjectId,
} from '@l2beat/shared-pure'

import { Clock } from '../../../tools/Clock'
import { ActivityViewRepository } from '../repositories/ActivityViewRepository'
import { SequenceProcessor } from '../SequenceProcessor'
import { alignActivityData } from './alignActivityData'
import { formatActivityChart } from './formatActivityChart'
import { postprocessCounts } from './postprocessCounts'
import { toCombinedActivity } from './toCombinedActivity'
import {
  DailyTransactionCount,
  DailyTransactionCountProjectsMap,
} from './types'

export class ActivityController {
  constructor(
    private readonly projectIds: ProjectId[],
    private readonly processors: SequenceProcessor[],
    private readonly viewRepository: ActivityViewRepository,
    private readonly clock: Clock,
  ) {}

  async getActivity(): Promise<ActivityApiResponse> {
    const dbCounts = await this.getPostprocessedDailyCounts()
    const projectCounts: DailyTransactionCountProjectsMap = new Map()
    let ethereumCounts: DailyTransactionCount[] | undefined

    for (const [projectId, counts] of dbCounts) {
      if (projectId === ProjectId.ETHEREUM) {
        ethereumCounts = counts
        continue
      }
      if (!this.projectIds.includes(projectId)) {
        continue
      }
      projectCounts.set(projectId, counts)
    }
    assert(ethereumCounts, 'Ethereum missing in daily transaction count')

    const { daily: combinedDaily, ...estimationInfo } =
      toCombinedActivity(projectCounts)

    const combinedChartPoints = alignActivityData(combinedDaily, ethereumCounts)

    const projects: ActivityApiResponse['projects'] = {}
    for (const [projectId, counts] of projectCounts.entries()) {
      projects[projectId.toString()] = formatActivityChart(
        alignActivityData(counts, ethereumCounts),
      )
    }

    return {
      combined: {
        ...formatActivityChart(combinedChartPoints),
        ...estimationInfo,
      },
      projects,
    }
  }

  async getAggregatedActivity(
    projects: ProjectId[],
  ): Promise<ActivityApiCharts> {
    const [aggregatedDailyCounts, ethereumCounts] = await Promise.all([
      await this.viewRepository.getProjectsAggregatedDailyCount(projects),
      await this.viewRepository.getDailyCountsPerProject(ProjectId.ETHEREUM),
    ])
    const now = this.clock.getLastHour()

    const processedCounts = postprocessCounts(aggregatedDailyCounts, true, now)
    const processedEthereumCounts = postprocessCounts(ethereumCounts, true, now)

    const chartPoints = alignActivityData(
      processedCounts,
      processedEthereumCounts,
    )

    return formatActivityChart(chartPoints)
  }

  getStatus(): json {
    const projects = this.processors.map((processor) => {
      return {
        projectId: processor.projectId.toString(),
        includedInApi: this.projectIds.includes(processor.projectId),
        ...processor.getStatus(),
      }
    })
    return projects.reduce<Record<string, json>>((result, project) => {
      result[project.projectId] = project
      return result
    }, {})
  }

  private async getPostprocessedDailyCounts(): Promise<DailyTransactionCountProjectsMap> {
    const counts = await this.viewRepository.getDailyCounts()
    const result: DailyTransactionCountProjectsMap = new Map()
    const now = this.clock.getLastHour()
    for (const processor of this.processors) {
      // Exclude projects that have not been fully synced yet
      if (!processor.getStatus().syncedOnce) continue

      const projectId = processor.projectId
      if (!this.projectIds.includes(projectId)) continue
      const projectCounts = counts.filter((c) => c.projectId === projectId)
      const postprocessedCounts = postprocessCounts(
        projectCounts,
        processor.hasProcessedAll(),
        now,
      )
      result.set(projectId, postprocessedCounts)
    }
    return result
  }
}
