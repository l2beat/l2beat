import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'

import { TxCountRepository } from '../../peripherals/database/TxCountRepository'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { Clock } from '../Clock'

export class BlockTxCountUpdater {
  private updateQueue = new TaskQueue<void>(() => this.update(), this.logger)
  private blockQueue = new TaskQueue(this.getBlock.bind(this), this.logger, {
    workers: 100,
  })
  private queuedBlocks = new Set<number>()

  constructor(
    private ethereumClient: EthereumClient,
    private txCountRepository: TxCountRepository,
    private clock: Clock,
    private logger: Logger,
    private projectId: ProjectId,
  ) {
    this.logger = logger.for(this)
  }

  async getBlock(number: number) {
    this.queuedBlocks.delete(number)
    const block = await this.ethereumClient.getBlock(number)
    const timestamp = new UnixTime(block.timestamp)

    // We download all the blocks, but discard those that are more recent
    // than clock.getLastHour() to avoid dealing with potential reorgs
    if (timestamp.gt(this.clock.getLastHour())) {
      return
    }

    await this.txCountRepository.add({
      projectId: this.projectId,
      timestamp,
      blockNumber: block.number,
      count: block.transactions.length,
    })
  }

  start() {
    this.logger.info('Started')
    this.updateQueue.addIfEmpty()
    return this.clock.onNewHour(() => {
      this.updateQueue.addIfEmpty()
    })
  }

  async update() {
    this.logger.info('Update started')

    const missingRange = await this.txCountRepository.getMissingRangesByProject(
      this.projectId,
    )
    for (const range of missingRange) {
      // Adding one as range is an open interval
      for (let i = range[0] + 1; i < range[1]; i++) {
        this.queueBlock(i)
      }
    }

    const lastBlock = await this.txCountRepository.findLatestByProject(
      this.projectId,
    )
    const latestBlock = await this.ethereumClient.getBlockNumber()
    let lastBlockNumber = lastBlock ? lastBlock.blockNumber : 0

    while (lastBlockNumber < Number(latestBlock)) {
      lastBlockNumber++
      this.queueBlock(lastBlockNumber)
    }

    this.logger.info('Update queued')
  }

  private queueBlock(number: number) {
    if (!this.queuedBlocks.has(number)) {
      this.blockQueue.addToBack(number)
      this.queuedBlocks.add(number)
    }
  }
}
