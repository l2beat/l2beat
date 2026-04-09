import type { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import type { TvsCleanerConfig } from '../../../config/Config'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../tools/SyncOptimizer'

export interface TvsCleanerDeps
  extends Omit<ManagedMultiIndexerOptions<TvsCleanerConfig>, 'name'> {
  syncOptimizer: SyncOptimizer
}

export class TvsCleaner extends ManagedMultiIndexer<TvsCleanerConfig> {
  constructor(
    private readonly $: TvsCleanerDeps,
    logger: Logger,
  ) {
    const { syncOptimizer: _syncOptimizer, ...managedOptions } = $
    super(
      {
        ...managedOptions,
        name: INDEXER_NAMES.TVS_CLEANER,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
        dataWipingAfterDeleteDisabled: true,
      },
      logger,
    )
  }

  override multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<TvsCleanerConfig>[],
  ) {
    // If not a midnight, skip the update
    // On first run, run even not at midnight and round `to` to the previous midnight
    if (from !== 0 && to !== UnixTime.toStartOf(to, 'day')) {
      return Promise.resolve(() => Promise.resolve(to))
    }
    const adjustedTo = UnixTime.toStartOf(to, 'day')

    const hourlyRange = {
      from:
        from !== 0
          ? this.$.syncOptimizer.getHourlyCutOffWithGracePeriod(from)
          : undefined,
      to: this.$.syncOptimizer.getHourlyCutOffWithGracePeriod(adjustedTo),
    }
    const sixHourlyRange = {
      from:
        from !== 0
          ? this.$.syncOptimizer.getSixHourlyCutOffWithGracePeriod(from)
          : undefined,
      to: this.$.syncOptimizer.getSixHourlyCutOffWithGracePeriod(adjustedTo),
    }

    return Promise.resolve(async () => {
      const details: Record<string, number> = {}

      for (const configuration of configurations) {
        const repository = this.$.db[configuration.properties.name]

        const hourlyDeleted = await repository.deleteHourlyUntil(hourlyRange)
        const sixHourlyDeleted =
          await repository.deleteSixHourlyUntil(sixHourlyRange)

        details[`${configuration.properties.name}Hourly`] = hourlyDeleted
        details[`${configuration.properties.name}SixHourly`] = sixHourlyDeleted
      }

      this.logger.info('Cleaned TVS records', {
        from,
        to: adjustedTo,
        ...details,
      })

      return to
    })
  }

  override removeData(_configurations: RemovalConfiguration[]): Promise<void> {
    return Promise.resolve()
  }
}
