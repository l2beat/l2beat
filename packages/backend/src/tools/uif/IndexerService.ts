import { SavedConfiguration } from '@l2beat/uif'

import { IndexerConfigurationRepository } from './IndexerConfigurationRepository'
import { IndexerStateRepository } from './IndexerStateRepository'

export class IndexerService {
  constructor(
    private readonly indexerStateRepository: IndexerStateRepository,
    private readonly indexerConfigurationRepository: IndexerConfigurationRepository,
  ) {}

  // #region ManagedChildIndexer & ManagedMultiIndexer

  async setSafeHeight(indexerId: string, safeHeight: number) {
    const record = await this.indexerStateRepository.findIndexerState(indexerId)
    if (!record) {
      await this.indexerStateRepository.add({ indexerId, safeHeight })
      return
    }
    await this.indexerStateRepository.setSafeHeight(indexerId, safeHeight)
  }

  async getSafeHeight(indexerId: string): Promise<number | undefined> {
    const record = await this.indexerStateRepository.findIndexerState(indexerId)
    return record?.safeHeight
  }

  // #region ManagedMultiIndexer

  async addSavedConfigurations<T>(
    indexerId: string,
    configurations: SavedConfiguration<T>[],
    encode: (value: T) => string,
  ): Promise<void> {
    const encoded = configurations.map((config) => ({
      ...config,
      properties: encode(config.properties),
    }))

    await this.indexerConfigurationRepository.addManySavedConfigurations(
      encoded.map((e) => ({ ...e, indexerId })),
    )
  }

  async updateSavedConfigurations(
    indexerId: string,
    configurationIds: string[],
    currentHeight: number | null,
  ): Promise<void> {
    await this.indexerConfigurationRepository.updateSavedConfigurations(
      indexerId,
      configurationIds,
      currentHeight,
    )
  }

  async getSavedConfigurations<T>(
    indexerId: string,
    decode: (blob: string) => T,
  ): Promise<SavedConfiguration<T>[]> {
    const configurations =
      await this.indexerConfigurationRepository.getSavedConfigurations(
        indexerId,
      )
    return configurations.map((config) => ({
      ...config,
      properties: decode(config.properties),
    }))
  }

  async deleteSavedConfigurations(
    indexerId: string,
    configurationIds: string[],
  ): Promise<void> {
    await this.indexerConfigurationRepository.deleteSavedConfigurations(
      indexerId,
      configurationIds,
    )
  }

  // #endregion
}
