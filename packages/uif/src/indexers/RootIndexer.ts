import type { Logger } from '@l2beat/backend-tools'

import { Indexer, type IndexerOptions } from '../Indexer'

export abstract class RootIndexer extends Indexer {
  constructor(logger: Logger, opts?: IndexerOptions) {
    super(logger, [], opts)
  }

  override async update(): Promise<number> {
    return await Promise.reject(new Error('RootIndexer cannot update'))
  }

  override async invalidate(): Promise<number> {
    return await Promise.reject(new Error('RootIndexer cannot invalidate'))
  }

  override async setInitialState(): Promise<void> {
  }

  override async setSafeHeight(): Promise<void> {
    return await Promise.resolve()
  }
}
