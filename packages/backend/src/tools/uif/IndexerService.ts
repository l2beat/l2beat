import { assert } from '@l2beat/backend-tools'
import {
  AmountConfigEntry,
  CirculatingSupplyEntry,
  EscrowEntry,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
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

  async getValuesStatus(sources: string[], targetTimestamp: UnixTime) {
    const excluded = new Set<string>()
    const lagging = []

    const indexersState =
      await this.indexerStateRepository.getByIndexerIdLike('value_indexer::%')

    const processed = new Set<string>()
    for (const indexer of indexersState) {
      const [project, source] = indexer.indexerId.split('::')[1].split('_')
      const valueId = `${project}_${source}`
      processed.add(valueId)

      const syncStatus = new UnixTime(indexer.safeHeight)
      if (syncStatus.equals(targetTimestamp)) {
        continue
      }

      // decide whether it is excluded or lagging
      if (syncStatus.lt(getExclusionBoundary(targetTimestamp))) {
        excluded.add(valueId)
      } else {
        lagging.push({
          id: valueId,
          latestTimestamp: syncStatus,
        })
      }
    }

    if (processed.size !== sources.length) {
      const unprocessed = sources.filter((s) => !processed.has(s))
      unprocessed.forEach((u) => excluded.add(u))
    }

    return {
      excluded,
      lagging: groupBy(
        lagging.map((l) => ({
          ...l,
          project: l.id.split('_')[0],
        })),
        'project',
      ),
    }
  }

  async getAmountsStatus(
    configurations: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const chainIndexersConfigurations = configurations.filter(
      (c): c is (EscrowEntry | TotalSupplyEntry) & { configId: string } =>
        c.type !== 'circulatingSupply',
    )

    const { lagging, excluded } = await this.getConfigurationsStatus(
      chainIndexersConfigurations,
      targetTimestamp,
    )

    const circulatingSupplyConfigs = configurations.filter(
      (c): c is CirculatingSupplyEntry & { configId: string } =>
        c.type === 'circulatingSupply',
    )

    const indexersState = await this.indexerStateRepository.getByIndexerIds(
      circulatingSupplyConfigs.map(
        (c) => `circulating_supply_indexer::${c.coingeckoId}`,
      ),
    )

    const processed = new Set<string>()
    for (const indexer of indexersState) {
      const circulatingSupplyConfig = circulatingSupplyConfigs.find(
        (cc) => cc.coingeckoId.toString() === indexer.indexerId.split('::')[1],
      )
      assert(
        circulatingSupplyConfig,
        `Config should be defined for ${indexer.indexerId}`,
      )
      processed.add(circulatingSupplyConfig.configId)

      const syncStatus = new UnixTime(indexer.safeHeight)
      if (syncStatus.equals(targetTimestamp)) {
        continue
      }

      // decide whether it is excluded or lagging
      if (syncStatus.lt(getExclusionBoundary(targetTimestamp))) {
        excluded.add(circulatingSupplyConfig.configId)
      } else {
        lagging.push({
          id: circulatingSupplyConfig.configId,
          latestTimestamp: syncStatus,
        })
      }
    }

    if (processed.size !== circulatingSupplyConfigs.length) {
      const unprocessed = circulatingSupplyConfigs.filter(
        (c) => !processed.has(c.configId),
      )
      unprocessed.forEach((u) => excluded.add(u.configId))
    }

    return {
      excluded,
      lagging,
    }
  }

  async getConfigurationsStatus(
    configurations: { configId: string }[],
    targetTimestamp: UnixTime,
  ) {
    const excluded = new Set<string>()
    const lagging = []

    const configurationsState =
      await this.indexerConfigurationRepository.getByIds(
        configurations.map((c) => c.configId),
      )

    const processed = new Set<string>()
    for (const config of configurationsState) {
      processed.add(config.id)
      const syncStatus = config.currentHeight
        ? new UnixTime(config.currentHeight)
        : undefined
      // newly added configuration
      if (syncStatus === undefined) {
        excluded.add(config.id)
        continue
      }
      // fully synced configuration
      if (syncStatus.equals(targetTimestamp)) {
        continue
      }

      // phased out configuration - but we still want to display its data
      if (config.maxHeight && config.maxHeight === config.currentHeight) {
        continue
      }

      // decide whether it is excluded or lagging
      if (syncStatus.lt(getExclusionBoundary(targetTimestamp))) {
        excluded.add(config.id)
      } else {
        lagging.push({
          id: config.id,
          latestTimestamp: syncStatus,
        })
      }
    }

    if (processed.size !== configurations.length) {
      const unprocessed = configurations.filter(
        (c) => !processed.has(c.configId),
      )
      unprocessed.forEach((u) => excluded.add(u.configId))
    }

    return {
      excluded,
      lagging,
    }
  }
}

function getExclusionBoundary(targetTimestamp: UnixTime): UnixTime {
  return targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days')
}
