import { Logger } from '@l2beat/backend-tools'
import { ChildIndexer, Indexer, IndexerOptions } from '@l2beat/uif'

import { assetUniqueIndexerId } from './ids'
import { IndexerService } from './IndexerService'

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
    return this.options.indexerService.setSafeHeight(this.indexerId, safeHeight)
  }
}
