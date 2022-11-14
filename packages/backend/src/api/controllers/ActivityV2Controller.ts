import { ProjectId } from '@l2beat/types'

import { DailyTransactionCountView } from '../../core/activity/DailyTransactionCountView'
import { DailyTransactionCountRecord } from '../../peripherals/database/activity-v2/DailyTransactionCountRepository'

export class ActivityV2Controller {
  constructor(
    private readonly projectIds: ProjectId[],
    private readonly dailyCountView: DailyTransactionCountView,
  ) {}

  async getDailyCounts() {
    const projectCounts = await this.dailyCountView.getDailyCounts()
    const result: Record<
      string,
      Omit<DailyTransactionCountRecord, 'projectId'>[]
    > = {}
    for (const [projectId, counts] of projectCounts) {
      if (!this.projectIds.includes(projectId)) continue
      result[projectId.toString()] = counts
    }
    return result
  }
}
