import { SavedConfiguration } from '@l2beat/uif'

import { IndexerConfigurationRepository } from './IndexerConfigurationRepository'
import { IndexerStateRepository } from './IndexerStateRepository'

export class IndexerService {
  constructor(
    private readonly indexerStateRepository: IndexerStateRepository,
    private readonly indexerConfigurationRepository: IndexerConfigurationRepository,
  ) {}

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

  async getSavedConfigurations<T, U>(
    indexerId: string,
    decode: (json: U) => T,
  ): Promise<SavedConfiguration<T>[]> {
    const configurations =
      await this.indexerConfigurationRepository.getSavedConfigurations<U>(
        indexerId,
      )
    return configurations.map((config) => ({
      ...config,
      properties: decode(config.properties),
    }))
  }

  async addSavedConfigurations<T, U>(
    indexerId: string,
    configurations: SavedConfiguration<T>[],
    encode: (value: T) => U,
  ): Promise<void> {
    const encoded = configurations.map((config) => ({
      ...config,
      properties: encode(config.properties),
    }))
    return this.indexerConfigurationRepository.addManySavedConfigurations(
      indexerId,
      encoded,
    )
  }

  async removeSavedConfigurations(
    indexerId: string,
    configurationIds: string[],
  ): Promise<void> {
    return this.indexerConfigurationRepository.removeSavedConfigurations(
      indexerId,
      configurationIds,
    )
  }

  async updateSavedConfigurations(
    indexerId: string,
    configurationIds: string[],
    currentHeight: number | null,
  ): Promise<void> {
    return this.indexerConfigurationRepository.updateSavedConfigurations(
      indexerId,
      configurationIds,
      currentHeight,
    )
  }
}
