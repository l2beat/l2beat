import { Logger, TaskQueue } from '@l2beat/common'

import { DailyTransactionCountViewRepository } from '../../peripherals/database/activity-v2/DailyTransactionCountViewRepository'
import { Clock } from '../Clock'
import { ALL_PROCESSED_EVENT, SequenceProcessor } from '../SequenceProcessor'

export class DailyTransactionCountViewRefresher {
  private readonly refreshQueue: TaskQueue<void>
  constructor(
    private readonly processors: SequenceProcessor[],
    private readonly viewRepository: DailyTransactionCountViewRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
    this.refreshQueue = new TaskQueue<void>(async () => {
      this.logger.info('Refresh started')
      await this.viewRepository.refresh()
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
}
