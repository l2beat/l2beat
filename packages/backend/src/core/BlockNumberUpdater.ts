import { Logger, UnixTime } from '@l2beat/common'
import { setTimeout } from 'timers/promises'

import { BlockNumberRepository } from '../peripherals/database/BlockNumberRepository'
import { EtherscanClient } from '../peripherals/etherscan'

export class BlockNumberUpdater {
  private blocksByTimestamp = new Map<number, bigint>()

  constructor(
    private etherscanClient: EtherscanClient,
    private blockNumberRepository: BlockNumberRepository,
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async getBlockNumberWhenReady(timestamp: UnixTime, refreshIntervalMs = 1000) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      const blockNumber = this.blocksByTimestamp.get(timestamp.toNumber())
      if (blockNumber !== undefined) {
        return blockNumber
      }
      await setTimeout(refreshIntervalMs)
    }
  }

  async update(timestamps: UnixTime[]): Promise<bigint[]> {
    const knownBlocks = await this.blockNumberRepository.getAll()
    for (const { timestamp, blockNumber } of knownBlocks) {
      this.blocksByTimestamp.set(timestamp.toNumber(), blockNumber)
    }

    this.logger.info('Update started', { timestamps: timestamps.length })
    const result = await Promise.all(
      timestamps.map((timestamp) => {
        const known = this.blocksByTimestamp.get(timestamp.toNumber())
        if (known !== undefined) {
          return known
        }
        return this.fetchBlockNumber(timestamp)
      }),
    )
    this.logger.info('Update completed', { timestamps: timestamps.length })
    return result
  }

  private async fetchBlockNumber(timestamp: UnixTime) {
    const blockNumber = await this.etherscanClient.getBlockNumberAtOrBefore(
      timestamp,
    )
    const block = { timestamp, blockNumber }
    await this.blockNumberRepository.add(block)
    this.blocksByTimestamp.set(timestamp.toNumber(), blockNumber)
    this.logger.info('Fetched block', {
      blockNumber: Number(blockNumber),
      timestamp: timestamp.toNumber(),
    })
    return blockNumber
  }
}
