import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { Indexer, IndexerOptions, RetryStrategy } from '@l2beat/uif'
import { IndexerService } from '../IndexerService'
import { assetUniqueConfigId, assetUniqueIndexerId } from '../ids'
import { MultiIndexer } from './MultiIndexer'
import { getNewConfigurationsState } from './getNewConfigurationsState'
import {
  Configuration,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

export interface ManagedMultiIndexerOptions<T> extends IndexerOptions {
  parents: Indexer[]
  name: string
  tag?: string
  indexerService: IndexerService
  configurations: Configuration<T>[]
  serializeConfiguration: (value: T) => string
  logger: Logger
  updateRetryStrategy?: RetryStrategy
  db: Database
}

export abstract class ManagedMultiIndexer<T> extends MultiIndexer<T> {
  private readonly indexerId

  constructor(public readonly options: ManagedMultiIndexerOptions<T>) {
    super(
      options.logger,
      options.parents,
      options.db,
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

  override async multiInitialize(
    configurations: Configuration<T>[],
  ): Promise<SavedConfiguration<T>[]> {
    const previous = await this.options.indexerService.getSavedConfigurations(
      this.indexerId,
    )

    const state = getNewConfigurationsState(
      configurations,
      this.options.serializeConfiguration,
      previous,
    )

    await this.updateConfigurationsState(state.diff)

    return state.configurations
  }

  abstract removeData(configurations: RemovalConfiguration[]): Promise<void>

  async updateConfigurationsState(state: {
    toAdd: Configuration<T>[]
    toUpdate: SavedConfiguration<T>[]
    toDelete: string[]
    toTrim: RemovalConfiguration[]
  }): Promise<void> {
    if (state.toAdd.length > 0) {
      await this.options.indexerService.insertConfigurations(
        this.indexerId,
        state.toAdd,
        this.options.serializeConfiguration,
      )
    }

    if (state.toUpdate.length > 0) {
      await this.options.indexerService.upsertConfigurations(
        this.indexerId,
        state.toUpdate,
        this.options.serializeConfiguration,
      )
    }

    if (state.toDelete.length > 0) {
      await this.options.indexerService.deleteConfigurations(
        this.indexerId,
        state.toDelete,
      )
    }

    if (state.toTrim.length > 0) {
      await this.removeData(state.toTrim)
    }
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

  override async updateConfigurationsCurrentHeight(
    currentHeight: number,
  ): Promise<void> {
    await this.options.indexerService.updateConfigurationsCurrentHeight(
      this.indexerId,
      currentHeight,
    )
  }

  async setSafeHeight(safeHeight: number) {
    return await this.options.indexerService.setSafeHeight(
      this.indexerId,
      safeHeight,
    )
  }
}
