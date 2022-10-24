import { Logger, TaskQueue } from '@l2beat/common'
import { StarkexProduct } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/types'

import { StarkexTransactionCountRepository } from '../../peripherals/database/StarkexTransactionCountRepository'
import { StarkexClient } from '../../peripherals/starkex'
import { Clock } from '../Clock'
import { TransactionCounter } from './TransactionCounter'
import { BACK_OFF_AND_DROP } from './utils'

interface StarkexTransactionUpdaterOpts {
  workQueueWorkers?: number
  apiDelayHours?: number
}

export class StarkexTransactionUpdater implements TransactionCounter {
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
    private readonly opts?: StarkexTransactionUpdaterOpts,
  ) {
    this.logger = logger.for(
      `${StarkexTransactionUpdater.name}[${projectId.toString()}]`,
    )
    this.updateQueue = new TaskQueue<void>(
      () => this.update(),
      this.logger.for('updateQueue'),
    )
    this.daysQueue = new TaskQueue(
      (day) => this.updateDay(day),
      this.logger.for('daysQueue'),
      {
        workers: this.opts?.workQueueWorkers,
        shouldRetry: BACK_OFF_AND_DROP,
        trackEvents: true,
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

    const lastDay = this.clock
      .getLastHour()
      .add(-(this.opts?.apiDelayHours ?? 0), 'hours')
      .toStartOf('day')
      .toDays()

    const gaps = await this.starkexTransactionCountRepository.getGapsByProject(
      this.projectId,
      this.startDay,
      lastDay,
    )

    for (const [start, end] of gaps) {
      for (let i = start; i <= end; i++) {
        this.daysQueue.addToBack(i)
      }
    }

    this.logger.info('Update enqueued', { project: this.projectId.toString() })
  }

  async getDailyCounts() {
    return this.starkexTransactionCountRepository.getDailyCountsByProject(
      this.projectId,
    )
  }

  async getStatus() {
    const fullySyncedTip = (await this.getDailyCounts()).at(-1)
    return {
      workQueue: this.daysQueue.getStats(),
      fullySyncedTip: fullySyncedTip?.timestamp.toDate().toISOString() ?? null,
    }
  }
}
