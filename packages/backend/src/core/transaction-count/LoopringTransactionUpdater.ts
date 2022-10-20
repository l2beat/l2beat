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
  private latestBlock?: number

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
        trackEvents: true,
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

    const boundaries =
      await this.blockTransactionCountRepository.findBoundariesByProject(
        this.projectId,
      )
    this.logger.debug('Gaps query started')
    const gaps = await this.blockTransactionCountRepository.getGapsByProject(
      this.projectId,
    )
    this.logger.debug('Gaps query finished')
    const finalizedBlock = await this.loopringClient.getFinalizedBlockNumber()
    this.latestBlock = finalizedBlock
    if (!boundaries) {
      gaps.push([1, finalizedBlock])
    } else {
      if (boundaries.max < finalizedBlock) {
        gaps.push([boundaries.max + 1, finalizedBlock])
      }
      if (boundaries.min > 1) {
        gaps.push([1, boundaries.min - 1])
      }
    }

    for (const [start, end] of gaps) {
      for (let i = start; i <= end; i++) {
        this.blockQueue.addToBack(i)
      }
    }

    this.logger.info('Update enqueued')
  }

  async getDailyCounts() {
    return await this.blockTransactionCountRepository.getDailyCounts(
      this.projectId,
    )
  }

  async getStatus() {
    const storedTip =
      await this.blockTransactionCountRepository.findTipByProject(
        this.projectId,
      )
    const fullySyncedTip = (await this.getDailyCounts()).at(-1)
    return {
      workQueue: this.blockQueue.getStats(),
      latestBlock: this.latestBlock?.toString() ?? null,
      storedTip: storedTip?.timestamp.toDate().toISOString() ?? null,
      fullySyncedTip: fullySyncedTip?.timestamp.toDate().toISOString() ?? null,
    }
  }
}
