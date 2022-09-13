import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'

import { TxCountRepository } from '../../peripherals/database/TxCountRepository'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { Clock } from '../Clock'

export class RpcCount {
  private taskQueue = new TaskQueue<void>(() => this.update(), this.logger)
  private blockQueue = new TaskQueue(this.getBlock.bind(this), this.logger, 100)

  constructor(
    private etheteumClient: EthereumClient,
    private txCountRepository: TxCountRepository,
    private clock: Clock,
    private logger: Logger,
    private projectId: ProjectId,
  ) {
    this.logger = logger.for(this)
  }

  async getBlock(number: number) {
    const block = await this.etheteumClient.getBlock(number)
    const timestamp = new UnixTime(block.timestamp)

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
    return this.clock.onEveryHour(() => {
      this.taskQueue.addIfEmpty()
    })
  }

  async update() {
    this.logger.info('Update started')

    const missingBlocks = await this.txCountRepository.getMissingByProject(
      this.projectId,
    )
    for (const block of missingBlocks) {
      this.blockQueue.addToBack(block)
    }

    const lastBlock = await this.txCountRepository.findLatestByProject(
      this.projectId,
    )
    const latestBlock = await this.etheteumClient.getBlockNumber()
    let lastBlockNumber = lastBlock ? lastBlock.blockNumber : 0

    while (lastBlockNumber < Number(latestBlock)) {
      this.blockQueue.addToBack(lastBlockNumber)
      lastBlockNumber++
    }
    this.logger.info('Update completed')
  }
}
