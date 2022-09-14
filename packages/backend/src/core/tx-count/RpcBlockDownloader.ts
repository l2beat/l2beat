import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'

import { TxCountRepository } from '../../peripherals/database/TxCountRepository'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { Clock } from '../Clock'

interface L2Client {
  projectId: ProjectId
  client: EthereumClient
}
export class RpcBlockDownloader {
  private taskQueue = new TaskQueue<void>(() => this.update(), this.logger)
  private blockQueue = new TaskQueue(this.getBlock.bind(this), this.logger, 100)

  private l2Clients = new Map<ProjectId, EthereumClient>()

  constructor(
    l2Clients: L2Client[],
    private txCountRepository: TxCountRepository,
    private clock: Clock,
    private logger: Logger,
  ) {
    this.logger = logger.for(this)
    for (const { projectId, client } of l2Clients) {
      this.l2Clients.set(projectId, client)
    }
  }

  async getBlock({
    number,
    projectId,
  }: {
    number: number
    projectId: ProjectId
  }) {
    const ethereumClient = this.l2Clients.get(projectId)
    if (!ethereumClient) {
      throw new Error('')
    }
    const block = await ethereumClient.getBlock(number)
    const timestamp = new UnixTime(block.timestamp)

    if (timestamp.gt(this.clock.getLastHour())) {
      return
    }

    await this.txCountRepository.add({
      projectId,
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

    for (const [projectId, client] of this.l2Clients) {
      const missingBlocks = await this.txCountRepository.getMissingByProject(
        projectId,
      )
      for (const block of missingBlocks) {
        this.blockQueue.addToBack({ number: block, projectId })
      }

      const lastBlock = await this.txCountRepository.findLatestByProject(
        projectId,
      )
      const latestBlock = await client.getBlockNumber()
      let lastBlockNumber = lastBlock ? lastBlock.blockNumber : 0

      while (lastBlockNumber < 1000) {
        this.blockQueue.addToBack({ number: lastBlockNumber, projectId })
        lastBlockNumber++
      }
    }

    this.logger.info('Update completed')
  }
}
