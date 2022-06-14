import { Logger, UnixTime } from '@l2beat/common'

import { BlockNumberRepository } from '../peripherals/database/BlockNumberRepository'
import { EtherscanClient } from '../peripherals/etherscan'

export class BlockNumberUpdater {
  constructor(
    private etherscanClient: EtherscanClient,
    private blockNumberRepository: BlockNumberRepository,
    private logger: Logger
  ) {
    this.logger = this.logger.for(this)
  }

  async update(timestamps: UnixTime[]): Promise<bigint[]> {
    const knownBlocks = await this.blockNumberRepository.getAll()
    const blocksByTimestamp = new Map(
      knownBlocks.map((x) => [x.timestamp.toNumber(), x.blockNumber])
    )

    this.logger.info('Update started', { timestamps: timestamps.length })
    const result = await Promise.all(
      timestamps.map((timestamp) => {
        const known = blocksByTimestamp.get(timestamp.toNumber())
        if (known !== undefined) {
          return known
        }
        return this.fetchBlockNumber(timestamp)
      })
    )
    this.logger.info('Update completed', { timestamps: timestamps.length })
    return result
  }

  private async fetchBlockNumber(timestamp: UnixTime) {
    const blockNumber = await this.etherscanClient.getBlockNumberAtOrBefore(
      timestamp
    )
    const block = { timestamp, blockNumber }
    await this.blockNumberRepository.add(block)
    this.logger.info('Fetched block', {
      blockNumber: Number(blockNumber),
      timestamp: timestamp.toNumber(),
    })
    return blockNumber
  }
}
