import { UnixTime } from '@l2beat/common'

import { BlockNumberRepository } from '../peripherals/database/BlockNumberRepository'
import { EtherscanClient } from '../peripherals/etherscan'

export class BlockNumberUpdater {
  constructor(
    private etherscanClient: EtherscanClient,
    private blockNumberRepository: BlockNumberRepository
  ) {}

  async update(timestamps: UnixTime[]): Promise<bigint[]> {
    const knownBlocks = await this.blockNumberRepository.getAll()
    const blocksByTimestamp = new Map(
      knownBlocks.map((x) => [x.timestamp.toNumber(), x.blockNumber])
    )
    return Promise.all(
      timestamps.map((timestamp) => {
        const known = blocksByTimestamp.get(timestamp.toNumber())
        if (known !== undefined) {
          return known
        }
        return this.fetchBlockNumber(timestamp)
      })
    )
  }

  private async fetchBlockNumber(timestamp: UnixTime) {
    const blockNumber = await this.etherscanClient.getBlockNumberAtOrBefore(
      timestamp
    )
    const block = { timestamp, blockNumber }
    await this.blockNumberRepository.add(block)
    return blockNumber
  }
}
