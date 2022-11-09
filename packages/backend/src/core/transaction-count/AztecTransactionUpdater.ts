import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'

import { AztecClient } from '../../peripherals/aztec'
import { BlockTransactionCountRepository } from '../../peripherals/database/BlockTransactionCountRepository'
import { waitUntilDefined } from '../../tools/waitUntilDefined'
import { Clock } from '../Clock'
import { getFilledDailyCounts } from './getFilledDailyCounts'
import { TransactionCounter } from './TransactionCounter'
import { BACK_OFF_AND_DROP } from './utils'

interface AztecTransactionUpdaterOpts {
  workQueueWorkers?: number
}

export class AztecTransactionUpdater implements TransactionCounter {
  private readonly updateQueue: TaskQueue<void>
  private readonly blockQueue: TaskQueue<number>
  private latestBlock?: { number: number; timestamp: UnixTime }

  constructor(
    private readonly aztecClient: AztecClient,
    private readonly blockTransactionCountRepository: BlockTransactionCountRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
    readonly projectId: ProjectId,
    private readonly opts?: AztecTransactionUpdaterOpts,
  ) {
    this.logger = logger.for(
      `${AztecTransactionUpdater.name}[${projectId.toString()}]`,
    )
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
    const block = await this.aztecClient.getBlock(blockNumber)

    await this.blockTransactionCountRepository.add({
      projectId: this.projectId,
      timestamp: block.timestamp,
      blockNumber: block.number,
      count: block.transactionCount,
    })

    this.logger.debug('Block updated', {
      project: this.projectId.toString(),
      blockNumber,
    })
  }

  async update() {
    this.logger.info('Update started')

    await this.blockQueue.waitTilEmpty()

    const latestBlock = await this.aztecClient.getLatestBlock()
    this.latestBlock = latestBlock
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
      latestBlock: this.latestBlock?.toString() ?? null,
      fullySyncedTip: fullySyncedTip?.timestamp.toDate().toISOString() ?? null,
    }
  }
}
