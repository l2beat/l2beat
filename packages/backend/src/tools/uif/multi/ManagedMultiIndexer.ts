import { Logger } from '@l2beat/backend-tools'
import { Indexer, IndexerOptions, RetryStrategy } from '@l2beat/uif'
import { DatabaseMiddleware } from '../../../peripherals/database/DatabaseMiddleware'
import { IndexerService } from '../IndexerService'
import { assetUniqueConfigId, assetUniqueIndexerId } from '../ids'
import { MultiIndexer } from './MultiIndexer'
import { Configuration, SavedConfiguration } from './types'

export interface ManagedMultiIndexerOptions<T> extends IndexerOptions {
  parents: Indexer[]
  name: string
  tag?: string
  indexerService: IndexerService
  configurations: Configuration<T>[]
  serializeConfiguration: (value: T) => string
  deserializeConfiguration: (blob: string) => T
  logger: Logger
  updateRetryStrategy?: RetryStrategy
  createDatabaseMiddleware: () => Promise<DatabaseMiddleware>
}

export abstract class ManagedMultiIndexer<T> extends MultiIndexer<T> {
  private readonly indexerId

  constructor(public readonly options: ManagedMultiIndexerOptions<T>) {
    super(
      options.logger,
      options.parents,
      options.createDatabaseMiddleware,
      options.configurations,
      options,
    )

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
    return await this.options.indexerService.getSafeHeight(this.indexerId)
  }

  async setSafeHeight(safeHeight: number) {
    return await this.options.indexerService.setSafeHeight(
      this.indexerId,
      safeHeight,
    )
  }

  override setInitialState(
    safeHeight: number,
    configHash?: string | undefined,
  ): Promise<void> {
    return this.options.indexerService.setInitialState(
      this.indexerId,
      safeHeight,
      configHash,
    )
  }

  override async multiInitialize(): Promise<SavedConfiguration<T>[]> {
    return await this.options.indexerService.getSavedConfigurations(
      this.indexerId,
      this.options.deserializeConfiguration,
    )
  }

  override async setSavedConfigurations(
    configurations: SavedConfiguration<T>[],
  ): Promise<void> {
    await this.options.indexerService.upsertConfigurations(
      this.indexerId,
      configurations,
      this.options.serializeConfiguration,
    )
    await this.options.indexerService.persistOnlyUsedConfigurations(
      this.indexerId,
      configurations.map((c) => c.id),
    )
  }

  override async updateCurrentHeight(
    configurationIds: string[],
    currentHeight: number,
    dbMiddleware: DatabaseMiddleware,
  ): Promise<void> {
    await this.options.indexerService.updateSavedConfigurations(
      this.indexerId,
      configurationIds,
      currentHeight,
      dbMiddleware,
    )
  }
}
