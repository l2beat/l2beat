import { Logger } from '@l2beat/backend-tools'

import { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import { ActivityViewRepository } from './repositories/ActivityViewRepository'
import { SequenceProcessor } from './SequenceProcessor'

export class ActivityViewRefresher {
  private readonly refreshQueue: TaskQueue<void>
  constructor(
    private readonly processors: SequenceProcessor[],
    private readonly viewRepository: ActivityViewRepository,
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
      // TODO: rename to 'ActivityViewRefresher' and update grafana
      { metricsId: 'DailyTransactionCountViewRefresher' },
    )
  }

  start() {
    // TODO(imxeno): Commented out refreshing on startup / processedAll,
    // because materialized view is refreshed every deploy and the operations
    // pile up, taking even 3 hours to complete.

    this.logger.info('Started')
    this.processors.forEach((processor) =>
      processor.onProcessedAll(() => {
        this.logger.info('Scheduling refresh', {
          processedProject: processor.projectId.toString(),
        })
        // this.refreshQueue.addIfEmpty()
      }),
    )
    this.clock.onNewHour(() => this.refreshQueue.addIfEmpty())
    // this.refreshQueue.addIfEmpty()
  }
}
