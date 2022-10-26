import { Logger, TaskQueue } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'

import { BlockTransactionCountRepository } from '../../peripherals/database/BlockTransactionCountRepository'
import { ZksyncTransactionRepository } from '../../peripherals/database/ZksyncTransactionRepository'
import { Clock } from '../Clock'
import { TransactionCounter } from './TransactionCounter'

export class MaterializedViewRefresher {
  private readonly queue: TaskQueue<void>

  constructor(
    private readonly blockTransactionCountRepository: BlockTransactionCountRepository,
    private readonly zksyncTransactionRepository: ZksyncTransactionRepository,
    private readonly blockTransactionCounters: TransactionCounter[],
    private readonly otherTransactionCounters: TransactionCounter[],
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly delayHours: number,
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
    await this.blockTransactionCountRepository.refreshDailyCounts(
      this.blockTransactionCounters.map((c) => c.projectId),
    )
    await this.zksyncTransactionRepository.refreshDailyCounts()
    this.logger.info('Refresh finished')
    await this.checkIfFullySynced()
  }

  private async checkIfFullySynced() {
    const lastHour = this.clock.getLastHour()
    const startOfDay = lastHour.toStartOf('day')
    if (!lastHour.equals(startOfDay.add(this.delayHours + 1, 'hours'))) {
      this.logger.debug('Skipping fully sync check - too early')
      return
    }
    const expectedTip = startOfDay.add(-1, 'days')
    this.logger.info('Fully sync check started', {
      day: expectedTip.toYYYYMMDD(),
    })
    const lagging = await this.getLaggingProjects(startOfDay)
    if (lagging.length > 0) {
      this.logger.error({
        message: 'Transaction counters are not fully synced',
        lagging,
        expectedTip: expectedTip.toYYYYMMDD(),
      })
    } else {
      this.logger.info('Transaction counters are fully synced', {
        day: expectedTip.toYYYYMMDD(),
      })
    }
    this.logger.info('Fully sync check finished', {
      day: expectedTip.toYYYYMMDD(),
    })
  }

  private async getLaggingProjects(expectedTip: UnixTime) {
    const tips = await Promise.all(
      [...this.blockTransactionCounters, ...this.otherTransactionCounters].map(
        async (counter) => ({
          projectId: counter.projectId,
          timestamp: (await counter.getDailyCounts()).at(-1)?.timestamp,
        }),
      ),
    )
    const lagging = tips.filter((tip) => !tip.timestamp?.equals(expectedTip))
    return lagging
  }
}
