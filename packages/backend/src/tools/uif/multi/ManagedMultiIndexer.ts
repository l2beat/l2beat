import { assert, Logger } from '@l2beat/backend-tools'
import {
  Configuration,
  Indexer,
  IndexerOptions,
  MultiIndexer,
  SavedConfiguration,
} from '@l2beat/uif'

import { assetUniqueConfigId, assetUniqueIndexerId } from '../ids'
import { IndexerService } from '../IndexerService'

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

  private savedOnce = false
  override async saveConfigurations(
    configurations: SavedConfiguration<T>[],
  ): Promise<void> {
    if (!this.savedOnce) {
      await this.options.indexerService.upsertConfigurations(
        this.options.id,
        configurations,
        this.options.encode,
      )
      await this.options.indexerService.persistOnlyUsedConfigurations(
        this.options.id,
        configurations.map((c) => c.id),
      )
      this.savedOnce = true
    } else {
      const newHeight = configurations[0].currentHeight
      assert(configurations.every((c) => c.currentHeight === newHeight))

      await this.options.indexerService.updateSavedConfigurations(
        this.options.id,
        configurations.map((c) => c.id),
        newHeight,
      )
    }
  }
}
