import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'

import { BlockTransactionCountRepository } from '../../peripherals/database/BlockTransactionCountRepository'
import { ZksyncTransactionRepository } from '../../peripherals/database/ZksyncTransactionRepository'
import { Clock } from '../Clock'

export class MaterializedViewRefresher {
  private readonly queue: TaskQueue<void>

  constructor(
    private readonly blockTransactionCountRepository: BlockTransactionCountRepository,
    private readonly zksyncTransactionRepository: ZksyncTransactionRepository,
    private readonly blockProjectIds: ProjectId[],
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
    for (const projectId of this.blockProjectIds) {
      await this.blockTransactionCountRepository.refreshProjectTip(projectId)
    }
    await this.blockTransactionCountRepository.refreshFullySyncedDailyCounts()
    await this.zksyncTransactionRepository.refreshTip()
    await this.zksyncTransactionRepository.refreshFullySyncedDailyCounts()
    this.logger.info('Refresh finished')
  }
}
