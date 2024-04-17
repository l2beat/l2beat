import { Logger } from '@l2beat/backend-tools'
import { ChildIndexer, Indexer, IndexerOptions } from '@l2beat/uif'

import { assetUniqueIndexerId } from './ids'
import { IndexerService } from './IndexerService'

export interface ManagedChildIndexerOptions extends IndexerOptions {
  parents: Indexer[]
  id: string
  minHeight: number
  indexerService: IndexerService
  logger: Logger
}

export abstract class ManagedChildIndexer extends ChildIndexer {
  constructor(public readonly options: ManagedChildIndexerOptions) {
    super(options.logger, options.parents, options)
    assetUniqueIndexerId(options.id)
  }

  async initialize() {
    const safeHeight = await this.options.indexerService.getSafeHeight(
      this.options.id,
    )
    return safeHeight ?? this.options.minHeight - 1
  }

  async setSafeHeight(safeHeight: number) {
    return this.options.indexerService.setSafeHeight(
      this.options.id,
      safeHeight,
    )
  }
}
