import type { Database, IndexerStateRecord } from '@l2beat/database'
import type { Configuration, SavedConfiguration } from './multi/types'

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
}
