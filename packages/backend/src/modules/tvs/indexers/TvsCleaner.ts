import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../tools/SyncOptimizer'

interface CleanableRepository {
  deleteHourlyUntil(dateRange: CleanDateRange): Promise<number>
  deleteSixHourlyUntil(dateRange: CleanDateRange): Promise<number>
}

interface CleanDateRange {
  from: UnixTime | undefined
  to: UnixTime
}

type CleanableRepoName = {
  [K in keyof Database]: Database[K] extends CleanableRepository ? K : never
}[keyof Database]

type TvsCleanerConfig = {
  name: CleanableRepoName
}

export interface TvsCleanerDeps
  extends Omit<
    ManagedMultiIndexerOptions<TvsCleanerConfig>,
    'name' | 'configurations'
  > {
  syncOptimizer: SyncOptimizer
  repositories: CleanableRepoName[]
}

export class TvsCleaner extends ManagedMultiIndexer<TvsCleanerConfig> {
  constructor(
    private readonly $: TvsCleanerDeps,
    logger: Logger,
  ) {
    const { repositories, ...rest } = $

    const configurations = repositories.map((name) => ({
      id: repoNameToConfigId(name),
      minHeight: 0,
      maxHeight: null,
      properties: { name },
    }))
    super(
      {
        ...rest,
        name: INDEXER_NAMES.TVS_CLEANER,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
        dataWipingAfterDeleteDisabled: true,
        configurations,
      },
      logger,
    )
  }

  override multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<TvsCleanerConfig>[],
  ) {
    const adjustedFrom = from !== 0 ? (from - 1) * UnixTime.DAY : undefined
    const adjustedTo = UnixTime(to * UnixTime.DAY)
    const hourlyRange = {
      from: adjustedFrom
        ? this.$.syncOptimizer.getHourlyCutOffWithGracePeriod(adjustedFrom)
        : undefined,
      to: this.$.syncOptimizer.getHourlyCutOffWithGracePeriod(adjustedTo),
    }
    const sixHourlyRange = {
      from: adjustedFrom
        ? this.$.syncOptimizer.getSixHourlyCutOffWithGracePeriod(adjustedFrom)
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
        until: adjustedTo,
        ...details,
      })

      return to
    })
  }

  override removeData(_configurations: RemovalConfiguration[]): Promise<void> {
    return Promise.resolve()
  }
}

function repoNameToConfigId(name: CleanableRepoName): string {
  return name.padEnd(12, '_').slice(0, 12)
}
