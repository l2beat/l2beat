import { assert } from '@l2beat/backend-tools'
import { Database, IndexerStateRecord } from '@l2beat/database'
import {
  AmountConfigEntry,
  CirculatingSupplyEntry,
  EscrowEntry,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { Configuration, SavedConfiguration } from './multi/types'

export const CONSIDER_EXCLUDED_AFTER_DAYS = 7

export class IndexerService {
  constructor(private readonly db: Database) {}

  // #region ManagedChildIndexer & ManagedMultiIndexer

  async getSafeHeight(indexerId: string): Promise<number | undefined> {
    const record = await this.db.indexerState.findByIndexerId(indexerId)
    return record?.safeHeight
  }

  async getIndexerState(
    indexerId: string,
  ): Promise<IndexerStateRecord | undefined> {
    const record = await this.db.indexerState.findByIndexerId(indexerId)
    return record
  }

  async setSafeHeight(indexerId: string, safeHeight: number) {
    await this.db.indexerState.updateSafeHeight(indexerId, safeHeight)
  }

  async setInitialState(
    indexerId: string,
    safeHeight: number,
    configHash?: string,
  ) {
    await this.db.indexerState.upsert({
      indexerId,
      safeHeight,
      configHash,
    })
  }

  // #endregion
  // #region ManagedMultiIndexer

  async insertConfigurations<T>(
    indexerId: string,
    configurations: Configuration<T>[],
    encode: (value: T) => string,
  ): Promise<void> {
    const encoded = configurations.map((config) => ({
      ...config,
      properties: encode(config.properties),
    }))
    await this.db.indexerConfiguration.insertMany(
      encoded.map((e) => ({ ...e, indexerId, currentHeight: null })),
    )
  }

  async upsertConfigurations<T>(
    indexerId: string,
    configurations: SavedConfiguration<T>[],
    encode: (value: T) => string,
  ): Promise<void> {
    const encoded = configurations.map((config) => ({
      ...config,
      properties: encode(config.properties),
    }))

    await this.db.indexerConfiguration.upsertMany(
      encoded.map((e) => ({ ...e, indexerId })),
    )
  }

  async getSavedConfigurations(
    indexerId: string,
  ): Promise<SavedConfiguration<string>[]> {
    return await this.db.indexerConfiguration.getConfigurationsWithoutIndexerId(
      indexerId,
    )
  }

  async updateConfigurationsCurrentHeight(
    indexerId: string,
    currentHeight: number | null,
  ): Promise<void> {
    await this.db.indexerConfiguration.updateCurrentHeights(
      indexerId,
      currentHeight,
    )
  }

  async deleteConfigurations(
    indexerId: string,
    configurationIds: string[],
  ): Promise<void> {
    await this.db.indexerConfiguration.deleteConfigurations(
      indexerId,
      configurationIds,
    )
  }

  // #endregion

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

    const indexersState = await this.db.indexerState.getByIndexerIds(
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
      if (syncStatus.gte(targetTimestamp)) {
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
      await this.db.indexerConfiguration.getByConfigurationIds(
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
      if (syncStatus.gte(targetTimestamp)) {
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
