import { Layer2, layer2s, Layer3, layer3s } from '@l2beat/config'
import {
  ActivityApiCharts,
  ActivityApiResponse,
  assert,
  json,
  ProjectId,
  Result,
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

export type ActivityResult = Result<
  ActivityApiResponse,
  'DATA_NOT_SYNCED' | 'ETHEREUM_DATA_DELAYED'
>

export type AggregatedActivityResult = Result<
  ActivityApiCharts,
  'DATA_NOT_SYNCED' | 'ETHEREUM_DATA_DELAYED'
>

export type MapSlugsToProjectIdsResult = Result<
  ProjectId[],
  'UNKNOWN_PROJECT' | 'NO_TRANSACTION_API' | 'EMPTY_PROJECTS'
>

export class ActivityController {
  constructor(
    private readonly projectIds: ProjectId[],
    private readonly processors: SequenceProcessor[],
    private readonly viewRepository: ActivityViewRepository,
    private readonly clock: Clock,
  ) {}

  async getActivity(): Promise<ActivityResult> {
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

    const combinedAlignmentResult = alignActivityData(
      toCombinedActivity(projectCounts),
      ethereumCounts,
    )

    if (combinedAlignmentResult.type === 'error') {
      return combinedAlignmentResult
    }

    const projects: ActivityApiResponse['projects'] = {}
    for (const [projectId, counts] of projectCounts.entries()) {
      const activityAlignmentResult = alignActivityData(counts, ethereumCounts)

      if (activityAlignmentResult.type === 'error') {
        return activityAlignmentResult
      }

      projects[projectId.toString()] = formatActivityChart(
        activityAlignmentResult.data,
      )
    }

    return {
      type: 'success',
      data: {
        combined: formatActivityChart(combinedAlignmentResult.data),
        projects,
      },
    }
  }

  async getAggregatedActivity(
    projects: ProjectId[],
  ): Promise<AggregatedActivityResult> {
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

    if (chartPoints.type === 'error') {
      return chartPoints
    }

    return {
      type: 'success',
      data: formatActivityChart(chartPoints.data),
    }
  }

  mapSlugsToProjectIds(slugs: string[]): MapSlugsToProjectIdsResult {
    if (slugs.length === 0) {
      return {
        type: 'error',
        error: 'EMPTY_PROJECTS',
      }
    }

    const projects: (Layer2 | Layer3)[] = []
    const allProjects = [...layer2s, ...layer3s]
    for (const s of slugs) {
      const project = allProjects.find((project) => project.display.slug === s)

      if (!project) {
        return {
          type: 'error',
          error: 'UNKNOWN_PROJECT',
        }
      }

      projects.push(project)
    }

    if (!projects.some((p) => p.config.transactionApi)) {
      return {
        type: 'error',
        error: 'NO_TRANSACTION_API',
      }
    }

    return {
      type: 'success',
      data: projects.map((p) => p.id),
    }
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
