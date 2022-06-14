import { getTimestamps, JobQueue, Logger, UnixTime } from '@l2beat/common'

import { BalanceUpdater } from './BalanceUpdater'
import { BlockNumberUpdater } from './BlockNumberUpdater'
import { PriceUpdater } from './PriceUpdater'
import { ReportUpdater } from './ReportUpdater'

export class SyncScheduler {
  private jobQueue: JobQueue
  private intervalID: NodeJS.Timer | undefined

  constructor(
    private blockUpdater: BlockNumberUpdater,
    private priceUpdater: PriceUpdater,
    private balanceUpdater: BalanceUpdater,
    private reportUpdater: ReportUpdater,
    private minTimestamp: UnixTime,
    private logger: Logger,
    private interval: number = 10 * 60 * 1000
  ) {
    this.logger = this.logger.for(this)
    this.jobQueue = new JobQueue({ maxConcurrentJobs: 1 }, this.logger)
  }

  start() {
    this.jobQueue.add({
      name: `sync triggered @ ${UnixTime.now().toString()}`,
      execute: () => this.sync(),
    })
    this.intervalID = setInterval(
      () =>
        this.jobQueue.add({
          name: `sync triggered @ ${UnixTime.now().toString()}`,
          execute: () => this.sync(),
        }),
      this.interval
    )
  }

  async sync() {
    const to = UnixTime.now().add(-1, 'hours').toStartOf('hour')
    const timestamps = getTimestamps(this.minTimestamp, to, 'hourly')

    if (timestamps.length === 0) {
      return
    }

    this.logger.info('Update started', { timestamps: timestamps.length })

    const blocks: bigint[] = await this.blockUpdater.update(timestamps)
    await this.priceUpdater.update(timestamps)
    await this.balanceUpdater.update(blocks)
    const dataPoints = timestamps.map((timestamp, i) => ({
      timestamp,
      blockNumber: blocks[i],
    }))
    await this.reportUpdater.update(dataPoints)

    this.logger.debug('Update completed', { timestamps: timestamps.length })
  }

  stop() {
    if (this.intervalID) {
      clearInterval(this.intervalID)
    }
  }
}
