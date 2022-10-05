import { Logger, TaskQueue } from '@l2beat/common'
import { StarkexProduct } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/types'

import { StarkexTransactionCountRepository } from '../../peripherals/database/StarkexTransactionCountRepository'
import { StarkexClient } from '../../peripherals/starkex'
import { Clock } from '../Clock'
import { TransactionCounter } from './TransactionCounter'
import { BACK_OFF_AND_DROP } from './utils'

interface StarkexTransactionCountUpdaterOpts {
  workQueueWorkers?: number
}

export class StarkexTransactionCountUpdater implements TransactionCounter {
  private readonly updateQueue: TaskQueue<void>
  private readonly daysQueue: TaskQueue<number>
  private readonly startDay: number

  constructor(
    private readonly starkexTransactionCountRepository: StarkexTransactionCountRepository,
    private readonly starkexClient: StarkexClient,
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly product: StarkexProduct,
    readonly projectId: ProjectId,
    startTimestamp: UnixTime,
    private readonly opts?: StarkexTransactionCountUpdaterOpts,
  ) {
    this.logger = logger.for(
      `${StarkexTransactionCountUpdater.name}[${projectId.toString()}]`,
    )
    this.updateQueue = new TaskQueue<void>(
      this.update.bind(this),
      this.logger.for('updateQueue'),
    )
    this.daysQueue = new TaskQueue(
      this.updateDay.bind(this),
      this.logger.for('daysQueue'),
      {
        workers: this.opts?.workQueueWorkers,
        shouldRetry: BACK_OFF_AND_DROP,
      },
    )
    this.startDay = startTimestamp.toStartOf('day').toDays()
  }

  start() {
    this.logger.info('Started', { project: this.projectId.toString() })
    this.updateQueue.addIfEmpty()
    return this.clock.onNewHour(() => {
      this.updateQueue.addIfEmpty()
    })
  }

  async updateDay(day: number) {
    const count = await this.starkexClient.getDailyCount(day, this.product)

    await this.starkexTransactionCountRepository.add({
      projectId: this.projectId,
      timestamp: UnixTime.fromDays(day),
      count,
    })

    this.logger.debug('Day updated', {
      projectId: this.projectId.toString(),
      day,
      count,
    })
  }

  async update() {
    this.logger.info('Update started', { project: this.projectId.toString() })

    await this.daysQueue.waitTilEmpty()

    const missingRanges =
      await this.starkexTransactionCountRepository.getMissingRangesByProject(
        this.projectId,
      )

    // Because starkex API operates on days (unix_timestamp / 86400)
    // it is easier to loop through all days we want to update.
    const today = this.clock.getLastHour().toStartOf('day').toDays()

    for (const [start, end] of missingRanges) {
      for (
        let i = Math.max(start, this.startDay);
        i < Math.min(end, today);
        i++
      ) {
        this.daysQueue.addToBack(i)
      }
    }

    this.logger.info('Update enqueued', { project: this.projectId.toString() })
  }

  async getDailyTransactionCounts() {
    return this.starkexTransactionCountRepository.getDailyTransactionCount(
      this.projectId,
    )
  }

  async getStatus() {
    return {
      queuedJobsCount: this.daysQueue.length,
      missingRanges:
        await this.starkexTransactionCountRepository.getMissingRangesByProject(
          this.projectId,
        ),
      busyWorkers: this.daysQueue.getBusyWorkers(),
    }
  }
}
