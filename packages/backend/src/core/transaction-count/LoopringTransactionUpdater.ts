import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'

import { BlockTransactionCountRepository } from '../../peripherals/database/BlockTransactionCountRepository'
import { LoopringClient } from '../../peripherals/loopring'
import { waitUntilDefined } from '../../tools/waitUntilDefined'
import { Clock } from '../Clock'
import { getFilledDailyCounts } from './getFilledDailyCounts'
import { TransactionCounter } from './TransactionCounter'
import { BACK_OFF_AND_DROP } from './utils'

interface LoopringTransactionUpdaterOpts {
  workQueueWorkers?: number
}

export class LoopringTransactionUpdater implements TransactionCounter {
  private readonly updateQueue: TaskQueue<void>
  private readonly blockQueue: TaskQueue<number>
  private latestBlock?: { number: number; timestamp: UnixTime }

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
    if (block.timestamp.gt(this.clock.getLastHour())) {
      return
    }

    await this.blockTransactionCountRepository.add({
      projectId: this.projectId,
      timestamp: block.timestamp,
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

    this.latestBlock = await this.loopringClient.getLatestBlock()
    const gaps = await this.blockTransactionCountRepository.getGapsByProject(
      this.projectId,
      1,
      this.latestBlock.number,
    )

    for (const [start, end] of gaps) {
      for (let i = start; i <= end; i++) {
        this.blockQueue.addToBack(i)
      }
    }

    this.logger.info('Update enqueued')
  }

  async getDailyCounts() {
    const start = Date.now()
    this.logger.info('Daily count started')
    const [counts, tip] = await Promise.all([
      await this.blockTransactionCountRepository.getDailyCountsByProject(
        this.projectId,
      ),
      await this.blockTransactionCountRepository.findTipByProject(
        this.projectId,
      ),
    ])
    const latestBlock = await waitUntilDefined(() => this.latestBlock)
    const result = getFilledDailyCounts(
      UnixTime.now(),
      counts,
      latestBlock.timestamp,
      tip?.timestamp,
    )
    this.logger.info('Daily count finished', { timeMs: Date.now() - start })
    return result
  }

  async getStatus() {
    const fullySyncedTip = (await this.getDailyCounts()).at(-1)
    return {
      workQueue: this.blockQueue.getStats(),
      latestBlock: this.latestBlock
        ? {
            number: this.latestBlock.number,
            timestamp: this.latestBlock.timestamp.toString(),
          }
        : null,
      fullySyncedTip: fullySyncedTip?.timestamp.toDate().toISOString() ?? null,
    }
  }
}
