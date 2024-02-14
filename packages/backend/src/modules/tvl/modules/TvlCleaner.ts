import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { TvlCleanerRepository } from '../../../peripherals/database/TvlCleanerRepository'
import { Clock } from '../../../tools/Clock'
import { TaskQueue } from '../../../tools/queue/TaskQueue'
export interface TvlRepositoryToClean {
  deleteHourlyUntil: (
    to: UnixTime,
    from: UnixTime | undefined,
  ) => Promise<number>
  deleteSixHourlyUntil: (
    to: UnixTime,
    from: UnixTime | undefined,
  ) => Promise<number>
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

      if (tvlCleanerRecord?.cleanedUntil.equals(hourlyDeletionBoundary)) {
        this.logger.info(
          `Nothing to clean for ${repositoryName}, waiting for next hour`,
        )
        continue
      }

      this.logger.info(`Cleaning ${repositoryName}`)

      const hourly = await repository.deleteHourlyUntil(
        hourlyDeletionBoundary,
        tvlCleanerRecord?.cleanedUntil,
      )
      const sixHourly = await repository.deleteSixHourlyUntil(
        sixHourlyDeletionBoundary,
        tvlCleanerRecord?.cleanedUntil,
      )

      await this.tvlCleanerRepository.addOrUpdate({
        repositoryName: repositoryName,
        cleanedUntil: hourlyDeletionBoundary,
      })

      this.logger.info(`Finished cleaning ${repositoryName}`, {
        hourly,
        sixHourly,
      })
    }
  }
}
