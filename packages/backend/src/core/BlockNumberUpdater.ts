import { BlockNumberProvider, Logger } from '@l2beat/shared'
import { assert, ChainId, UnixTime } from '@l2beat/shared-pure'
import { setTimeout } from 'timers/promises'

import { BlockNumberRepository } from '../peripherals/database/BlockNumberRepository'
import { Clock } from './Clock'
import { TaskQueue } from './queue/TaskQueue'

export class BlockNumberUpdater {
  private readonly blocksByTimestamp = new Map<number, number>()
  private readonly taskQueue: TaskQueue<UnixTime>

  constructor(
    private readonly blockNumberProvider: BlockNumberProvider,
    private readonly blockNumberRepository: BlockNumberRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly chainId: ChainId,
    private readonly minTimestamp: UnixTime,
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: BlockNumberUpdater.name,
      },
    )

    assert(
      this.chainId === blockNumberProvider.getChainId(),
      'chainId mismatch between blockNumberProvider and consturctor argument',
    )
  }

  getMinTimestamp() {
    return this.minTimestamp
  }

  async getBlockNumberWhenReady(timestamp: UnixTime, refreshIntervalMs = 1000) {
    assert(
      timestamp.gte(this.minTimestamp),
      'Programmer error: requested timestamp does not exist',
    )
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      const blockNumber = this.blocksByTimestamp.get(timestamp.toNumber())
      if (blockNumber !== undefined) {
        return blockNumber
      }
      this.logger.debug('Something is waiting for getBlockNumberWhenReady', {
        timestamp: timestamp.toString(),
      })
      await setTimeout(refreshIntervalMs)
    }
  }

  async start() {
    const known = await this.blockNumberRepository.getAll(this.chainId)
    for (const { timestamp, blockNumber } of known) {
      this.blocksByTimestamp.set(timestamp.toNumber(), blockNumber)
    }

    this.logger.info('Started')
    return this.clock.onEveryHour((timestamp) => {
      if (!this.blocksByTimestamp.has(timestamp.toNumber())) {
        if (timestamp.gte(this.minTimestamp)) {
          // we add to front to sync from newest to oldest
          this.taskQueue.addToFront(timestamp)
        }
      }
    })
  }

  async update(timestamp: UnixTime) {
    assert(
      timestamp.gte(this.minTimestamp),
      'Timestamp cannot be smaller than minTimestamp',
    )

    this.logger.debug('Update started', { timestamp: timestamp.toNumber() })
    const blockNumber = await this.blockNumberProvider.getBlockNumberAtOrBefore(
      timestamp,
    )
    const block = { timestamp, blockNumber, chainId: this.chainId }
    await this.blockNumberRepository.add(block)
    this.blocksByTimestamp.set(timestamp.toNumber(), blockNumber)
    this.logger.info('Update completed', {
      blockNumber: Number(blockNumber),
      timestamp: timestamp.toNumber(),
      chainId: this.chainId.toString(),
    })
  }
}
