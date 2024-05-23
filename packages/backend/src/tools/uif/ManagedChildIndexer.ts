import { Logger } from '@l2beat/backend-tools'
import {
  ChildIndexer,
  Indexer,
  IndexerOptions,
  RetryStrategy,
} from '@l2beat/uif'

import { IndexerService } from './IndexerService'
import { assetUniqueIndexerId } from './ids'

export interface ManagedChildIndexerOptions extends IndexerOptions {
  parents: Indexer[]
  name: string
  tag?: string
  minHeight: number
  indexerService: IndexerService
  logger: Logger
  updateRetryStrategy?: RetryStrategy
  configHash?: string
}

export abstract class ManagedChildIndexer extends ChildIndexer {
  private readonly indexerId: string

  constructor(public readonly options: ManagedChildIndexerOptions) {
    super(options.logger, options.parents, options)
    this.indexerId = options.name
    if (options.tag) {
      this.indexerId += `::${options.tag}`
    }
    assetUniqueIndexerId(this.indexerId)
  }

  async initialize(): Promise<{ safeHeight: number; configHash?: string }> {
    const indexerState = await this.options.indexerService.getIndexerState(
      this.indexerId,
    )

    if (
      this.options.configHash &&
      this.options.configHash !== indexerState?.configHash
    ) {
      return {
        safeHeight: this.options.minHeight - 1,
        configHash: this.options.configHash,
      }
    }

    return {
      safeHeight: indexerState?.safeHeight ?? this.options.minHeight - 1,
      configHash: this.options.configHash,
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

  async setSafeHeight(safeHeight: number) {
    return await this.options.indexerService.setSafeHeight(
      this.indexerId,
      safeHeight,
    )
  }
}
