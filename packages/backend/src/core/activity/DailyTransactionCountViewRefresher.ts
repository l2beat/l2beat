import { Logger } from '@l2beat/shared'

import { DailyTransactionCountViewRepository } from '../../peripherals/database/activity/DailyTransactionCountViewRepository'
import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'
import { TransactionCounter } from './TransactionCounter'

export class DailyTransactionCountViewRefresher {
  private readonly refreshQueue: TaskQueue<void>
  constructor(
    private readonly counters: TransactionCounter[],
    private readonly viewRepository: DailyTransactionCountViewRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
    this.refreshQueue = new TaskQueue<void>(
      async () => {
        this.logger.info('Refresh started')
        await this.viewRepository.refresh()
        this.logger.info('Refresh finished')
      },
      this.logger.for('refreshQueue'),
      { metricsId: DailyTransactionCountViewRefresher.name },
    )
  }

  start() {
    this.logger.info('Started')
    this.counters.forEach((counter) =>
      counter.onProcessedAll(() => {
        this.logger.info(
          `Processed all for project ${counter.projectId.toString()} - scheduling refresh`,
        )
        this.refreshQueue.addIfEmpty()
      }),
    )
    this.clock.onEveryHour(() => this.refreshQueue.addIfEmpty())
    this.refreshQueue.addIfEmpty()
  }
}
