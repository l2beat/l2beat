import { Logger, TaskQueue } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { setTimeout } from 'timers/promises'

import { BlockNumberRepository } from '../peripherals/database/BlockNumberRepository'
import { EtherscanClient } from '../peripherals/etherscan'
import { Clock } from './Clock'

export class BlockNumberUpdater {
  private blocksByTimestamp = new Map<number, bigint>()
  private taskQueue = new TaskQueue(this.update.bind(this), this.logger)

  constructor(
    private etherscanClient: EtherscanClient,
    private blockNumberRepository: BlockNumberRepository,
    private clock: Clock,
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
      this.logger.debug('something is waiting for getBlockNumberWhenReady')
      await setTimeout(refreshIntervalMs)
    }
  }

  async getBlockRangeWhenReady(
    from: UnixTime,
    to: UnixTime,
    refreshIntervalMs = 1000,
  ): Promise<{ timestamp: UnixTime; blockNumber: bigint }[]> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      const blocks: { timestamp: UnixTime; blockNumber: bigint }[] = []
      let noHoles = true
      for (let t = from; t.lte(to); t = t.add(1, 'hours')) {
        const blockNumber = this.blocksByTimestamp.get(t.toNumber())
        if (blockNumber !== undefined) {
          blocks.push({
            timestamp: t,
            blockNumber,
          })
        } else {
          noHoles = false
          break
        }
      }
      if (noHoles) {
        return blocks
      } else {
        this.logger.debug('something is waiting for getBlockRangeWhenReady')
        await setTimeout(refreshIntervalMs)
      }
    }
  }

  async start() {
    const known = await this.blockNumberRepository.getAll()
    for (const { timestamp, blockNumber } of known) {
      this.blocksByTimestamp.set(timestamp.toNumber(), blockNumber)
    }

    this.logger.info('Started')
    return this.clock.onEveryHour((timestamp) => {
      if (!this.blocksByTimestamp.has(timestamp.toNumber())) {
        // we add to front to sync from newest to oldest
        this.taskQueue.addToFront(timestamp)
      }
    })
  }

  async update(timestamp: UnixTime) {
    this.logger.debug('Update started', { timestamp: timestamp.toNumber() })
    const blockNumber = await this.etherscanClient.getBlockNumberAtOrBefore(
      timestamp,
    )
    const block = { timestamp, blockNumber }
    await this.blockNumberRepository.add(block)
    this.blocksByTimestamp.set(timestamp.toNumber(), blockNumber)
    this.logger.info('Update completed', {
      blockNumber: Number(blockNumber),
      timestamp: timestamp.toNumber(),
    })
  }
}
