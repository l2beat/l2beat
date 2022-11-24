import { Logger } from '@l2beat/common'
import { groupBy } from 'lodash'

import { DailyTransactionCountViewRepository } from '../../peripherals/database/activity-v2/DailyTransactionCountViewRepository'
import { SequenceProcessor } from '../SequenceProcessor'
import { postprocessCounts } from './postprocessCounts'
import { DailyTransactionCountProjectsMap } from './types'

export class DailyTransactionCountService {
  constructor(
    private readonly processors: SequenceProcessor[],
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
      const processor = this.processors.find(
        (p) => p.id === projectId.toString(),
      )
      if (!processor) {
        this.logger.debug(
          `Skipping ${projectId.toString()} from daily counts - no processor found`,
        )
        continue
      }
      const processedAll = processor.hasProcessedAll()
      const postprocessed = postprocessCounts(counts, processedAll)
      result.set(projectId, postprocessed)
    }

    return result
  }
}
