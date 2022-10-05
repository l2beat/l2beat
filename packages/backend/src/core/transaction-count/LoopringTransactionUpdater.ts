import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'

import { BlockTransactionCountRepository } from '../../peripherals/database/BlockTransactionCountRepository'
import { LoopringClient } from '../../peripherals/loopring'
import { Clock } from '../Clock'
import { TransactionCounter } from './TransactionCounter'
import { BACK_OFF_AND_DROP } from './utils'

interface LoopringTransactionUpdaterOpts {
  workQueueWorkers?: number
}

export class LoopringTransactionUpdater implements TransactionCounter {
  private readonly updateQueue: TaskQueue<void>
  private readonly blockQueue: TaskQueue<number>

  constructor(
    private readonly loopringClient: LoopringClient,
    private readonly blockTransactionCountRepository: BlockTransactionCountRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
    readonly projectId: ProjectId,
    private readonly opts?: LoopringTransactionUpdaterOpts,
  ) {
    this.logger = logger.for(this)
    this.updateQueue = new TaskQueue<void>(
      () => this.update(),
      this.logger.for('updateQueue'),
    )
    this.blockQueue = new TaskQueue(
      (block) => this.updateBlock(block),
      this.logger.for('blockQueue'),
      {
        workers: this.opts?.workQueueWorkers,
        shouldRetry: BACK_OFF_AND_DROP,
      },
    )
  }

  start() {
    this.logger.info('Started')
    this.updateQueue.addIfEmpty()
    return this.clock.onNewHour(() => {
      this.updateQueue.addIfEmpty()
    })
  }

  async updateBlock(blockNumber: number) {
    const block = await this.loopringClient.getBlock(blockNumber)

    // We download all the blocks, but discard those that are more recent
    // than clock.getLastHour() to avoid dealing with potential reorgs
    if (block.createdAt.gt(this.clock.getLastHour())) {
      return
    }

    await this.blockTransactionCountRepository.add({
      projectId: this.projectId,
      timestamp: block.createdAt,
      blockNumber,
      count: block.transactions,
    })

    this.logger.debug('Block updated', {
      project: this.projectId.toString(),
      blockNumber,
    })
  }

  async update() {
    this.logger.info('Update started')

    await this.blockQueue.waitTilEmpty()

    const missingRanges =
      await this.blockTransactionCountRepository.getMissingRangesByProject(
        this.projectId,
      )

    const finalizedBlock = await this.loopringClient.getFinalizedBlockNumber()

    for (const [start, end] of missingRanges) {
      for (
        let i = Math.max(start, 1);
        i < Math.min(end, finalizedBlock + 1);
        i++
      ) {
        this.blockQueue.addToBack(i)
      }
    }

    this.logger.info('Update enqueued')
  }

  async getDailyTransactionCounts() {
    return await this.blockTransactionCountRepository.getDailyTransactionCount(
      this.projectId,
    )
  }

  async getStatus() {
    return {
      queuedJobsCount: this.blockQueue.length,
      missingRanges:
        await this.blockTransactionCountRepository.getMissingRangesByProject(
          this.projectId,
        ),
      busyWorkers: this.blockQueue.getBusyWorkers(),
    }
  }
}
