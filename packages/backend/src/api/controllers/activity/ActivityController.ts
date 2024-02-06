import {
  ActivityApiCharts,
  ActivityApiResponse,
  assert,
  json,
  ProjectId,
} from '@l2beat/shared-pure'

import { SequenceProcessor } from '../../../core/activity/SequenceProcessor'
import { Clock } from '../../../core/Clock'
import { DailyTransactionCountViewRepository } from '../../../peripherals/database/activity/DailyTransactionCountViewRepository'
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
    private readonly viewRepository: DailyTransactionCountViewRepository,
    private readonly clock: Clock,
  ) {}

  async getActivity(): Promise<ActivityApiResponse> {
    const projectsCounts = await this.getPostprocessedDailyCounts()
    const layer2sCounts: DailyTransactionCountProjectsMap = new Map()
    let ethereumCounts: DailyTransactionCount[] | undefined

    for (const [projectId, counts] of projectsCounts) {
      if (projectId === ProjectId.ETHEREUM) {
        ethereumCounts = counts
        continue
      }
      if (!this.projectIds.includes(projectId)) {
        continue
      }
      layer2sCounts.set(projectId, counts)
    }
    assert(ethereumCounts, 'Ethereum missing in daily transaction count')

    const combinedChartPoints = alignActivityData(
      toCombinedActivity(layer2sCounts),
      ethereumCounts,
    )

    const projects: ActivityApiResponse['projects'] = {}
    for (const [projectId, counts] of layer2sCounts.entries()) {
      projects[projectId.toString()] = formatActivityChart(
        alignActivityData(counts, ethereumCounts),
      )
    }

    return {
      combined: formatActivityChart(combinedChartPoints),
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
    for (const counter of this.processors) {
      const projectId = counter.projectId
      if (!this.projectIds.includes(projectId)) continue
      const projectCounts = counts.filter((c) => c.projectId === projectId)
      const postprocessedCounts = postprocessCounts(
        projectCounts,
        counter.hasProcessedAll(),
        now,
      )
      result.set(projectId, postprocessedCounts)
    }
    return result
  }
}
