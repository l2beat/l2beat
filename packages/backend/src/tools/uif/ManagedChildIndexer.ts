import { Logger } from '@l2beat/backend-tools'
import { ChildIndexer, Indexer, IndexerOptions } from '@l2beat/uif'

import { IndexerService } from './IndexerService'
import { assetUniqueIndexerId } from './ids'

export interface ManagedChildIndexerOptions extends IndexerOptions {
  parents: Indexer[]
  name: string
  tag?: string
  minHeight: number
  indexerService: IndexerService
  logger: Logger
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

  async initialize() {
    const safeHeight = await this.options.indexerService.getSafeHeight(
      this.indexerId,
    )
    return safeHeight ?? this.options.minHeight - 1
  }

  async setSafeHeight(safeHeight: number) {
    return await this.options.indexerService.setSafeHeight(
      this.indexerId,
      safeHeight,
    )
  }
}
