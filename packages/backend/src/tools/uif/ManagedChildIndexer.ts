import { assert, Logger } from '@l2beat/backend-tools'
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

    // Subtract 1 from minHeight to make minHeight inclusive
    // later in the UIF pipeline 1 will be added to from
    // see executeUpdate() in Indexer.ts
    const minHeight = this.options.minHeight - 1

    if (indexerState === undefined) {
      return {
        safeHeight: minHeight,
        configHash: this.options.configHash,
      }
    }

    if (
      this.options.configHash &&
      this.options.configHash !== indexerState.configHash
    ) {
      return {
        safeHeight: minHeight,
        configHash: this.options.configHash,
      }
    }

    assert(
      indexerState.configHash === this.options.configHash,
      'Programmer error: configHash mismatch',
    )

    return {
      safeHeight: indexerState.safeHeight,
      configHash: indexerState.configHash,
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
