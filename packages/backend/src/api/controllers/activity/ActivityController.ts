import {
  ActivityApiResponse,
  assert,
  json,
  ProjectId,
} from '@l2beat/shared-pure'

import { TransactionCounter } from '../../../core/activity/TransactionCounter'
import { Clock } from '../../../core/Clock'
import { DailyTransactionCountViewRepository } from '../../../peripherals/database/activity/DailyTransactionCountViewRepository'
import { countsToChart } from './countsToChart'
import { postprocessCounts } from './postprocessCounts'
import { toCombinedActivity } from './toCombinedActivity'
import { toProjectsActivity } from './toProjectsActivity'
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

    return {
      combined: toCombinedActivity(layer2sCounts),
      projects: toProjectsActivity(layer2sCounts),
      ethereum: countsToChart(ethereumCounts),
    }
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
