import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { TvlCleanerRepository } from '../../../peripherals/database/TvlCleanerRepository'
import { Clock } from '../../../tools/Clock'
import { TaskQueue } from '../../../tools/queue/TaskQueue'
export interface TvlRepositoryToClean {
  deleteHourlyUntil: (dateRange: {
    from: UnixTime | undefined
    to: UnixTime
  }) => Promise<number>
  deleteSixHourlyUntil: (dateRange: {
    from: UnixTime | undefined
    to: UnixTime
  }) => Promise<number>
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
    private readonly tvlCleanerRepository: TvlCleanerRepository,
    private readonly repositoriesToClean: TvlRepositoryToClean[],
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

    for (const repository of this.repositoriesToClean) {
      const repositoryName = repository.constructor.name
      const tvlCleanerRecord = await this.tvlCleanerRepository.find(
        repositoryName,
      )

      if (
        tvlCleanerRecord?.hourlyCleanedUntil.gte(hourlyDeletionBoundary) &&
        tvlCleanerRecord.sixHourlyCleanedUntil.gte(sixHourlyDeletionBoundary)
      ) {
        this.logger.info(
          `Nothing to clean for ${repositoryName}, waiting for next hour`,
        )
        continue
      }

      this.logger.info(`Cleaning ${repositoryName}`)

      const hourly = await repository.deleteHourlyUntil({
        from: tvlCleanerRecord?.hourlyCleanedUntil,
        to: hourlyDeletionBoundary,
      })
      const sixHourly = await repository.deleteSixHourlyUntil({
        from: tvlCleanerRecord?.sixHourlyCleanedUntil,
        to: sixHourlyDeletionBoundary,
      })

      await this.tvlCleanerRepository.addOrUpdate({
        repositoryName: repositoryName,
        hourlyCleanedUntil: hourlyDeletionBoundary,
        sixHourlyCleanedUntil: sixHourlyDeletionBoundary,
      })

      this.logger.info(`Finished cleaning ${repositoryName}`, {
        hourly,
        sixHourly,
      })
    }
  }
}
