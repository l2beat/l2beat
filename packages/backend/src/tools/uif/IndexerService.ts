import { UnixTime } from '@l2beat/shared-pure'
import {
  DatabaseMiddleware,
  DatabaseTransaction,
} from '../../peripherals/database/DatabaseMiddleware'
import { IndexerConfigurationRepository } from './IndexerConfigurationRepository'
import {
  IndexerStateRecord,
  IndexerStateRepository,
} from './IndexerStateRepository'
import { SavedConfiguration } from './multi/types'

const CONSIDER_EXCLUDED_AFTER_DAYS = 7

export class IndexerService {
  constructor(
    private readonly indexerStateRepository: IndexerStateRepository,
    private readonly indexerConfigurationRepository: IndexerConfigurationRepository,
  ) {}

  // #region ManagedChildIndexer & ManagedMultiIndexer

  async getSafeHeight(indexerId: string): Promise<number | undefined> {
    const record = await this.indexerStateRepository.findIndexerState(indexerId)
    return record?.safeHeight
  }

  async getIndexerState(
    indexerId: string,
  ): Promise<IndexerStateRecord | undefined> {
    const record = await this.indexerStateRepository.findIndexerState(indexerId)
    return record
  }

  async setSafeHeight(indexerId: string, safeHeight: number) {
    await this.indexerStateRepository.setSafeHeight(indexerId, safeHeight)
  }

  async setInitialState(
    indexerId: string,
    safeHeight: number,
    configHash?: string,
  ) {
    await this.indexerStateRepository.addOrUpdate({
      indexerId,
      safeHeight,
      configHash,
    })
  }

  // #endregion
  // #region ManagedMultiIndexer

  async upsertConfigurations<T>(
    indexerId: string,
    configurations: SavedConfiguration<T>[],
    encode: (value: T) => string,
  ): Promise<void> {
    const encoded = configurations.map((config) => ({
      ...config,
      properties: encode(config.properties),
    }))

    await this.indexerConfigurationRepository.addOrUpdateMany(
      encoded.map((e) => ({ ...e, indexerId })),
    )
  }

  async getSavedConfigurations<T>(
    indexerId: string,
  ): Promise<Omit<SavedConfiguration<T>, 'properties'>[]> {
    const configurations: (Omit<SavedConfiguration<T>, 'properties'> & {
      indexerId?: string
      properties?: string
    })[] =
      await this.indexerConfigurationRepository.getSavedConfigurations(
        indexerId,
      )

    for (const config of configurations) {
      // biome-ignore lint/performance/noDelete: not a performance problem
      delete config.indexerId
      // biome-ignore lint/performance/noDelete: not a performance problem
      delete config.properties
    }

    return configurations
  }

  async updateSavedConfigurations(
    indexerId: string,
    configurationIds: string[],
    currentHeight: number | null,
    dbMiddleware: DatabaseMiddleware,
  ): Promise<void> {
    await dbMiddleware.add(async (trx?: DatabaseTransaction) => {
      await this.indexerConfigurationRepository.updateSavedConfigurations(
        indexerId,
        configurationIds,
        currentHeight,
        trx,
      )
    })
  }

  async persistOnlyUsedConfigurations(
    indexerId: string,
    configurationIds: string[],
  ): Promise<void> {
    await this.indexerConfigurationRepository.deleteConfigurationsExcluding(
      indexerId,
      configurationIds,
    )
  }

  // #endregion

  async getConfigurationsStatus(
    configurations: { configId: string }[],
    targetTimestamp: UnixTime,
  ) {
    const excluded = new Set<string>()

    const lagging: {
      id: string
      latestTimestamp: UnixTime
    }[] = []

    const configurationsState =
      await this.indexerConfigurationRepository.getByIds(
        configurations.map((c) => c.configId),
      )

    for (const config of configurationsState) {
      const syncStatus = config.currentHeight
        ? new UnixTime(config.currentHeight)
        : undefined

      // newly added configuration
      if (syncStatus === undefined) {
        excluded.add(config.id)
        continue
      }

      // synced configuration
      if (syncStatus.equals(targetTimestamp)) {
        continue
      }

      // phased out configuration - but we still want to display data
      if (config.maxHeight && config.maxHeight === config.currentHeight) {
        continue
      }

      // out of sync configuration
      if (
        syncStatus.lt(
          targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days'),
        )
      ) {
        excluded.add(config.id)
        continue
      }

      // lagging configuration
      if (
        syncStatus.gte(
          targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days'),
        )
      ) {
        lagging.push({
          id: config.id,
          latestTimestamp: syncStatus,
        })
        continue
      }
    }

    return {
      excluded,
      lagging,
    }
  }

  async getValuesStatus(targetTimestamp: UnixTime) {
    const excluded = new Set<string>()

    const lagging: {
      id: string
      latestTimestamp: UnixTime
    }[] = []

    const indexers = await this.indexerStateRepository.getAll()

    for (const indexer of indexers) {
      // TODO: filter in sql
      if (!indexer.indexerId.includes('value_indexer::')) {
        continue
      }

      const syncStatus = new UnixTime(indexer.safeHeight)
      const [project, source] = indexer.indexerId.split('::')[1].split('_')
      const valueId = `${project}_${source}`

      // synced configuration
      if (syncStatus.equals(targetTimestamp)) {
        continue
      }

      // out of sync configuration
      if (
        syncStatus.lt(
          targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days'),
        )
      ) {
        excluded.add(valueId)
        continue
      }

      // lagging configuration
      if (
        syncStatus.gte(
          targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days'),
        )
      ) {
        lagging.push({
          id: valueId,
          latestTimestamp: syncStatus,
        })
        continue
      }
    }

    return {
      excluded,
      lagging,
    }
  }
}
