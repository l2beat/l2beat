import { Logger } from '@l2beat/backend-tools'

import { ActivityViewRepository } from '../../peripherals/database/activity/ActivityViewRepository'
import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'
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
      { metricsId: ActivityViewRefresher.name },
    )
  }

  start() {
    this.logger.info('Started')
    this.processors.forEach((processor) =>
      processor.onProcessedAll(() => {
        this.logger.info('Scheduling refresh', {
          processedProject: processor.projectId.toString(),
        })
        this.refreshQueue.addIfEmpty()
      }),
    )
    this.clock.onNewHour(() => this.refreshQueue.addIfEmpty())
    this.refreshQueue.addIfEmpty()
  }
}
