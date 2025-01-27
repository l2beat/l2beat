import type { Logger } from '@l2beat/backend-tools'
import type { UnixTime } from '@l2beat/shared-pure'

import type { Database } from '@l2beat/database'
import type { Clock } from '../../../tools/Clock'
import { TaskQueue } from '../../../tools/queue/TaskQueue'
import type { SyncOptimizer } from './SyncOptimizer'

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
    private readonly syncOptimizer: SyncOptimizer,
    private readonly db: Database,
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
      this.syncOptimizer.hourlyCutOffWithGracePeriod
    const sixHourlyDeletionBoundary =
      this.syncOptimizer.sixHourlyCutOffWithGracePeriod

    for (const repository of this.repositoriesToClean) {
      const repositoryName = repository.constructor.name
      const tvlCleanerRecord =
        await this.db.tvlCleaner.findByRepositoryName(repositoryName)

      if (
        tvlCleanerRecord?.hourlyCleanedUntil?.gte(hourlyDeletionBoundary) &&
        tvlCleanerRecord.sixHourlyCleanedUntil?.gte(sixHourlyDeletionBoundary)
      ) {
        this.logger.info(
          `Nothing to clean for ${repositoryName}, waiting for next hour`,
        )
        continue
      }

      this.logger.info(`Cleaning ${repositoryName}`)

      const hourly = await repository.deleteHourlyUntil({
        from: tvlCleanerRecord?.hourlyCleanedUntil ?? undefined,
        to: hourlyDeletionBoundary,
      })
      const sixHourly = await repository.deleteSixHourlyUntil({
        from: tvlCleanerRecord?.sixHourlyCleanedUntil ?? undefined,
        to: sixHourlyDeletionBoundary,
      })

      await this.db.tvlCleaner.upsert({
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
