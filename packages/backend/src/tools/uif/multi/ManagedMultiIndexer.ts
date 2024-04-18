import { Logger } from '@l2beat/backend-tools'
import { Indexer, IndexerOptions } from '@l2beat/uif'

import { assetUniqueConfigId, assetUniqueIndexerId } from '../ids'
import { IndexerService } from '../IndexerService'
import { MultiIndexer } from './MultiIndexer'
import { Configuration, SavedConfiguration } from './types'

export interface ManagedMultiIndexerOptions<T> extends IndexerOptions {
  parents: Indexer[]
  id: string
  indexerService: IndexerService
  configurations: Configuration<T>[]
  encode: (value: T) => string
  decode: (blob: string) => T
  logger: Logger
}

export abstract class ManagedMultiIndexer<T> extends MultiIndexer<T> {
  constructor(public readonly options: ManagedMultiIndexerOptions<T>) {
    super(options.logger, options.parents, options.configurations, options)

    assetUniqueIndexerId(options.id)
    for (const configuration of options.configurations) {
      assetUniqueConfigId(configuration.id)
    }
  }

  async getSafeHeight() {
    return this.options.indexerService.getSafeHeight(this.options.id)
  }

  async setSafeHeight(safeHeight: number) {
    return this.options.indexerService.setSafeHeight(
      this.options.id,
      safeHeight,
    )
  }

  override async multiInitialize(): Promise<SavedConfiguration<T>[]> {
    return await this.options.indexerService.getSavedConfigurations(
      this.options.id,
      this.options.decode,
    )
  }

  override async setSavedConfigurations(
    configurations: SavedConfiguration<T>[],
  ): Promise<void> {
    await this.options.indexerService.upsertConfigurations(
      this.options.id,
      configurations,
      this.options.encode,
    )
    await this.options.indexerService.persistOnlyUsedConfigurations(
      this.options.id,
      configurations.map((c) => c.id),
    )
  }

  override async updateCurrentHeight(
    configurationIds: string[],
    currentHeight: number,
  ): Promise<void> {
    await this.options.indexerService.updateSavedConfigurations(
      this.options.id,
      configurationIds,
      currentHeight,
    )
  }
}
