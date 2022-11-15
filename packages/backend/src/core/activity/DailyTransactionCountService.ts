import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'
import { groupBy } from 'lodash'

import { DailyTransactionCountViewRepository } from '../../peripherals/database/activity-v2/DailyTransactionCountRepository'
import { Clock } from '../Clock'
import { ALL_PROCESSED_EVENT, SequenceProcessor } from '../SequenceProcessor'
import { postprocessCounts } from './postprocessCounts'
import { DailyTransactionCount } from './types'

export class DailyTransactionCountService {
  private readonly refreshQueue: TaskQueue<void>

  constructor(
    private readonly processors: SequenceProcessor[],
    private readonly dailyTransactionCountRepository: DailyTransactionCountViewRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
    this.refreshQueue = new TaskQueue<void>(async () => {
      this.logger.info('Refresh started')
      await this.dailyTransactionCountRepository.refresh()
      // TODO: check sync correctness
      this.logger.info('Refresh finished')
    }, this.logger.for('refreshQueue'))
  }

  start() {
    this.logger.info('Started')
    this.processors.forEach((processor) =>
      processor.on(ALL_PROCESSED_EVENT, () => {
        this.logger.info(
          `Received ${ALL_PROCESSED_EVENT} event for ${processor.id} - scheduling refresh`,
        )
        this.refreshQueue.addIfEmpty()
      }),
    )
    this.clock.onEveryHour(() => this.refreshQueue.addIfEmpty())
    this.refreshQueue.addIfEmpty()
  }

  /**
   * Returns counts with timestamps lower than or equal to yesterday.
   */
  async getDailyCounts(): Promise<Map<ProjectId, DailyTransactionCount[]>> {
    const allCounts =
      await this.dailyTransactionCountRepository.getDailyCounts()
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
