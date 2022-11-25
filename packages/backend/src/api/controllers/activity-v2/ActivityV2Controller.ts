import { assert } from '@l2beat/common'
import { ActivityApiResponse, ProjectId } from '@l2beat/types'

import { TransactionCounter } from '../../../core/activity/TransactionCounter'
import { DailyTransactionCount } from '../../../core/transaction-count/TransactionCounter'
import { DailyTransactionCountViewRepository } from '../../../peripherals/database/activity-v2/DailyTransactionCountViewRepository'
import { countsToChart } from './countsToChart'
import { postprocessCounts } from './postprocessCounts'
import { toCombinedActivity } from './toCombinedActivity'
import { toProjectsActivity } from './toProjectsActivity'
import { DailyTransactionCountProjectsMap } from './types'

export class ActivityV2Controller {
  constructor(
    private readonly projectIds: ProjectId[],
    private readonly counters: TransactionCounter[],
    private readonly viewRepository: DailyTransactionCountViewRepository,
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

  private async getPostprocessedDailyCounts(): Promise<DailyTransactionCountProjectsMap> {
    const counts = await this.viewRepository.getDailyCounts()
    const result: DailyTransactionCountProjectsMap = new Map()
    for (const counter of this.counters) {
      const projectId = counter.projectId
      if (!this.projectIds.includes(projectId)) continue
      const projectCounts = counts.filter((c) => c.projectId === projectId)
      const postprocessedCounts = postprocessCounts(
        projectCounts,
        counter.hasProcessedAll(),
      )
      result.set(projectId, postprocessedCounts)
    }
    return result
  }
}
