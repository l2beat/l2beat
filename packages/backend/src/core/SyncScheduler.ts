import { getTimestamps, Logger, TaskQueue, UnixTime } from '@l2beat/common'

import { BlockNumberUpdater } from './BlockNumberUpdater'
import { PriceUpdater } from './PriceUpdater'

export class SyncScheduler {
  private taskQueue: TaskQueue<void>
  private intervalID: NodeJS.Timer | undefined

  constructor(
    private blockUpdater: BlockNumberUpdater,
    private priceUpdater: PriceUpdater,
    private minTimestamp: UnixTime,
    private logger: Logger,
    private interval: number = 10 * 60 * 1000,
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(this.sync.bind(this), this.logger)
  }

  start() {
    this.taskQueue.addIfEmpty()
    this.intervalID = setInterval(
      () => this.taskQueue.addIfEmpty(),
      this.interval,
    )
  }

  async sync() {
    const to = UnixTime.now().add(-1, 'hours').toStartOf('hour')
    const timestamps = getTimestamps(this.minTimestamp, to, 'hourly')

    if (timestamps.length === 0) {
      return
    }

    this.logger.info('Update started', { timestamps: timestamps.length })

    await this.blockUpdater.update(timestamps)
    await this.priceUpdater.update(timestamps)

    this.logger.info('Update completed', { timestamps: timestamps.length })
  }

  stop() {
    if (this.intervalID) {
      clearInterval(this.intervalID)
    }
  }
}
