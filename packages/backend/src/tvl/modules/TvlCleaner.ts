import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'

interface Repository {
  deleteHourlyUntil: (timestamp: UnixTime) => Promise<number>
  deleteSixHourlyUntil: (timestamp: UnixTime) => Promise<number>
}

/**
 * WARNING: Not all updaters support cleaning, so their repositories should not be injected there.
 * Current list of unsupported updaters: PriceUpdater, CirculatingSupplyUpdater
 */
export class TvlCleaner {
  private readonly taskQueue: TaskQueue<void>

  constructor(
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly repositories: Repository[],
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(
      () => this.clean(),
      this.logger.for('taskQueue'),
      {
        metricsId: TvlCleaner.name,
      },
    )
  }

  start() {
    this.taskQueue.addToFront()
    this.logger.info('Started')
    return this.clock.onNewHour(() => {
      this.taskQueue.addToFront()
    })
  }

  async clean() {
    const hourlyDeletionBoundary =
      this.clock._TVL_ONLY_getHourlyDeletionBoundary()
    const sixHourlyDeletionBoundary =
      this.clock._TVL_ONLY_getSixHourlyDeletionBoundary()

    for (const table of this.repositories) {
      this.logger.info(`Cleaning ${table.constructor.name}`)
      const hourly = await table.deleteHourlyUntil(hourlyDeletionBoundary)
      this.logger.info(`Cleaned hourly ${table.constructor.name}`, { hourly })
      const sixHourly = await table.deleteSixHourlyUntil(
        sixHourlyDeletionBoundary,
      )
      this.logger.info(`Cleaned sixHourly ${table.constructor.name}`, {
        sixHourly,
      })
    }
  }
}
