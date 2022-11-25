import { Logger } from '@l2beat/common'
import { groupBy } from 'lodash'

import { DailyTransactionCountViewRepository } from '../../peripherals/database/activity-v2/DailyTransactionCountViewRepository'
import { postprocessCounts } from './postprocessCounts'
import { TransactionCounter } from './TransactionCounter'
import { DailyTransactionCountProjectsMap } from './types'

export class DailyTransactionCountService {
  constructor(
    private readonly counters: TransactionCounter[],
    private readonly viewRepository: DailyTransactionCountViewRepository,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  /**
   * Returns postprocessed counts with timestamps lower than or equal to yesterday.
   */
  async getPostprocessedDailyCounts(): Promise<DailyTransactionCountProjectsMap> {
    const allCounts = await this.viewRepository.getDailyCounts()
    const groupedCounts = groupBy(allCounts, (r) => r.projectId.toString())
    const result = new Map()

    for (const [projectId, counts] of Object.entries(groupedCounts)) {
      const counter = this.counters.find(
        (c) => c.projectId.toString() === projectId,
      )
      if (!counter) {
        this.logger.debug(
          `Skipping ${projectId.toString()} from daily counts - no counter found`,
        )
        continue
      }
      const processedAll = counter.hasProcessedAll()
      const postprocessed = postprocessCounts(counts, processedAll)
      result.set(projectId, postprocessed)
    }

    return result
  }
}
