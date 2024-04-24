import { Logger } from '@l2beat/backend-tools'
import { Indexer, IndexerOptions } from '@l2beat/uif'

import { assetUniqueConfigId, assetUniqueIndexerId } from '../ids'
import { IndexerService } from '../IndexerService'
import { MultiIndexer } from './MultiIndexer'
import { Configuration, SavedConfiguration } from './types'

export interface ManagedMultiIndexerOptions<T> extends IndexerOptions {
  parents: Indexer[]
  name: string
  tag?: string
  indexerService: IndexerService
  configurations: Configuration<T>[]
  encode: (value: T) => string
  decode: (blob: string) => T
  logger: Logger
}

export abstract class ManagedMultiIndexer<T> extends MultiIndexer<T> {
  private readonly indexerId

  constructor(public readonly options: ManagedMultiIndexerOptions<T>) {
    super(options.logger, options.parents, options.configurations, options)

    this.indexerId = options.name
    if (options.tag) {
      this.indexerId += `::${options.tag}`
    }
    assetUniqueIndexerId(this.indexerId)

    for (const configuration of options.configurations) {
      assetUniqueConfigId(configuration.id)
    }
  }

  async getSafeHeight() {
    return this.options.indexerService.getSafeHeight(this.indexerId)
  }

  async setSafeHeight(safeHeight: number) {
    return this.options.indexerService.setSafeHeight(this.indexerId, safeHeight)
  }

  override async multiInitialize(): Promise<SavedConfiguration<T>[]> {
    return await this.options.indexerService.getSavedConfigurations(
      this.indexerId,
      this.options.decode,
    )
  }

  override async setSavedConfigurations(
    configurations: SavedConfiguration<T>[],
  ): Promise<void> {
    await this.options.indexerService.upsertConfigurations(
      this.indexerId,
      configurations,
      this.options.encode,
    )
    await this.options.indexerService.persistOnlyUsedConfigurations(
      this.indexerId,
      configurations.map((c) => c.id),
    )
  }

  override async updateCurrentHeight(
    configurationIds: string[],
    currentHeight: number,
  ): Promise<void> {
    await this.options.indexerService.updateSavedConfigurations(
      this.indexerId,
      configurationIds,
      currentHeight,
    )
  }
}
