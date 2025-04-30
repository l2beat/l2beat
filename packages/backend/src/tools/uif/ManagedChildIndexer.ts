import type { Logger } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'
import {
  ChildIndexer,
  type Indexer,
  type IndexerOptions,
  type RetryStrategy,
} from '@l2beat/uif'
import type { IndexerService } from './IndexerService'
import { assertUniqueIndexerId } from './ids'
import { createIndexerId } from './indexerIdentity'
import type { IndexerTags } from './types'

export interface ManagedChildIndexerOptions extends IndexerOptions {
  parents: Indexer[]
  name: string
  tags?: IndexerTags
  minHeight: number
  indexerService: IndexerService
  logger: Logger
  updateRetryStrategy?: RetryStrategy
  configHash?: string
}

export abstract class ManagedChildIndexer extends ChildIndexer {
  private readonly indexerId: string

  constructor(public readonly options: ManagedChildIndexerOptions) {
    const logger = options.logger.tag(options.tags ?? {})
    super(logger, options.parents, options)
    this.indexerId = createIndexerId(options.name, options.tags?.tag)
    assertUniqueIndexerId(this.indexerId)
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
      this.logger.info('Config hash change detected. Invalidating...', {
        previousHeight: indexerState.safeHeight,
        targetHeight: minHeight,
      })

      return {
        safeHeight: minHeight,
        configHash: this.options.configHash,
      }
    }

    assert(
      indexerState.configHash === this.options.configHash,
      `Programmer error: configHash mismatch ${indexerState.configHash} !== ${this.options.configHash}`,
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
