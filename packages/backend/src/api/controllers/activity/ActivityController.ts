import { bridges, layer2s } from '@l2beat/config'
import {
  ActivityApiCharts,
  ActivityApiResponse,
  assert,
  json,
  ProjectId,
} from '@l2beat/shared-pure'

import { TransactionCounter } from '../../../core/activity/TransactionCounter'
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
    private readonly counters: TransactionCounter[],
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
    filteredProjectsSlugs: string[] = [],
  ): Promise<ActivityApiCharts> {
    const projectIdsFilter = [...layer2s, ...bridges]
      .filter((project) => filteredProjectsSlugs.includes(project.display.slug))
      .map((project) => project.id)

    const [aggregatedDailyCounts, ethereumCounts] = await Promise.all([
      await this.viewRepository.getProjectsAggregatedDailyCount(
        projectIdsFilter,
      ),
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

  async getStatus(): Promise<json> {
    const now = this.clock.getLastHour()
    const projects = await Promise.all(
      this.counters.map(async (counter) => {
        return {
          projectId: counter.projectId.toString(),
          includedInApi: this.projectIds.includes(counter.projectId),
          ...(await counter.getStatus(now)),
        }
      }),
    )
    return {
      systemNow: now.toDate().toISOString(),
      projects,
    }
  }

  private async getPostprocessedDailyCounts(): Promise<DailyTransactionCountProjectsMap> {
    const counts = await this.viewRepository.getDailyCounts()
    const result: DailyTransactionCountProjectsMap = new Map()
    const now = this.clock.getLastHour()
    for (const counter of this.counters) {
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
