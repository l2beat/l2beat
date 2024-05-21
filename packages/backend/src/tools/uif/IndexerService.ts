import { Knex } from 'knex'
import { IndexerConfigurationRepository } from './IndexerConfigurationRepository'
import { IndexerStateRepository } from './IndexerStateRepository'
import { KnexTx } from './KnexMiddleware'
import { SavedConfiguration } from './multi/types'

export class IndexerService {
  constructor(
    private readonly indexerStateRepository: IndexerStateRepository,
    private readonly indexerConfigurationRepository: IndexerConfigurationRepository,
  ) {}

  // #region ManagedChildIndexer & ManagedMultiIndexer

  async setSafeHeight(indexerId: string, safeHeight: number) {
    await this.indexerStateRepository.addOrUpdate({ indexerId, safeHeight })
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

    await this.indexerConfigurationRepository.addOrUpdateMany(
      encoded.map((e) => ({ ...e, indexerId })),
    )
  }

  async getSavedConfigurations<T>(
    indexerId: string,
    decode: (blob: string) => T,
  ): Promise<SavedConfiguration<T>[]> {
    const configurations: (SavedConfiguration<string> & {
      indexerId?: string
    })[] =
      await this.indexerConfigurationRepository.getSavedConfigurations(
        indexerId,
      )

    for (const config of configurations) {
      // biome-ignore lint/performance/noDelete: not a performance problem
      delete config.indexerId
    }

    return configurations.map((config) => ({
      ...config,
      properties: decode(config.properties),
    }))
  }

  updateSavedConfigurations(
    indexerId: string,
    configurationIds: string[],
    currentHeight: number | null,
    trx: KnexTx,
  ): void {
    trx.push(async (trx: Knex.Transaction) => {
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
}
