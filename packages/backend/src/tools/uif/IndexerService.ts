import { IndexerConfigurationRepository } from './IndexerConfigurationRepository'
import { IndexerStateRepository } from './IndexerStateRepository'
import { SavedConfiguration } from './multi/types'

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

    await this.indexerConfigurationRepository.addOrUpdateManyConfigurations(
      encoded.map((e) => ({ ...e, indexerId })),
    )
  }

  async getSavedConfigurations<T>(
    indexerId: string,
    decode: (blob: string) => T,
  ): Promise<SavedConfiguration<T>[]> {
    const configurations: (SavedConfiguration<string> & {
      indexerId?: string
    })[] = await this.indexerConfigurationRepository.getSavedConfigurations(
      indexerId,
    )

    for (const config of configurations) {
      delete config.indexerId
    }

    return configurations.map((config) => ({
      ...config,
      properties: decode(config.properties),
    }))
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
}
