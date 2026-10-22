import type { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import type { TvsCleanerConfig } from '../../../config/Config'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  WipeRemovalConfiguration,
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
      },
      logger,
    )
  }

  override multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<TvsCleanerConfig>[],
  ) {
    const lastMidnight = UnixTime.toStartOf(to, 'day')
    if (from !== 0 && lastMidnight < from) {
      return Promise.resolve(() => Promise.resolve(to))
    }
    // `from - 1` is the previous safe height, and every midnight up to it is already cleaned
    const cleanedMidnight =
      from !== 0 ? UnixTime.toStartOf(from - 1, 'day') : undefined

    const hourlyRange = {
      from:
        cleanedMidnight !== undefined
          ? this.$.syncOptimizer.getHourlyCutOffWithGracePeriod(cleanedMidnight)
          : undefined,
      to: this.$.syncOptimizer.getHourlyCutOffWithGracePeriod(lastMidnight),
    }
    const sixHourlyRange = {
      from:
        cleanedMidnight !== undefined
          ? this.$.syncOptimizer.getSixHourlyCutOffWithGracePeriod(
              cleanedMidnight,
            )
          : undefined,
      to: this.$.syncOptimizer.getSixHourlyCutOffWithGracePeriod(lastMidnight),
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
        to: lastMidnight,
        ...details,
      })

      return to
    })
  }

  override wipeData(_: WipeRemovalConfiguration[]): Promise<void> {
    return Promise.resolve()
  }
}
