import { assert } from '@l2beat/common'
import { ActivityApiResponse, ProjectId } from '@l2beat/types'

import { DailyTransactionCountService } from '../../../core/activity/DailyTransactionCountService'
import { DailyTransactionCount } from '../../../core/transaction-count/TransactionCounter'
import { countsToChart } from './countsToChart'
import { toCombinedActivity } from './toCombinedActivity'
import { toProjectsActivity } from './toProjectsActivity'

export class ActivityV2Controller {
  constructor(
    private readonly projectIds: ProjectId[],
    private readonly dailyCountView: DailyTransactionCountService,
  ) {}

  async getActivity(): Promise<ActivityApiResponse> {
    const projectsCounts = await this.dailyCountView.getDailyCounts()
    const layer2sCounts = new Map<ProjectId, DailyTransactionCount[]>()
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

  async getDailyCounts() {
    const projectCounts = await this.dailyCountView.getDailyCounts()
    const result: Record<string, DailyTransactionCount[]> = {}
    for (const [projectId, counts] of projectCounts) {
      if (!this.projectIds.includes(projectId)) continue
      result[projectId.toString()] = counts
    }
    return result
  }
}
