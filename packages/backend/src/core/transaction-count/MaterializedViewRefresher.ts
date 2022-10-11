import { Logger, TaskQueue } from '@l2beat/common'

import { BlockTransactionCountRepository } from '../../peripherals/database/BlockTransactionCountRepository'
import { Clock } from '../Clock'

export class MaterializedViewRefresher {
  private readonly queue: TaskQueue<void>

  constructor(
    private readonly blockTransactionCountRepository: BlockTransactionCountRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
    this.queue = new TaskQueue<void>(
      () => this.update(),
      this.logger.for('queue'),
    )
  }

  start() {
    this.logger.info('Started')
    this.queue.addIfEmpty()
    return this.clock.onNewHour(() => {
      this.queue.addIfEmpty()
    })
  }

  async update() {
    this.logger.info('Refresh started')
    await this.blockTransactionCountRepository.refresh()
    this.logger.info('Refresh finished')
  }
}
