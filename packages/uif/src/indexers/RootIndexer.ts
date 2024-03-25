import { Logger } from '@l2beat/backend-tools'

import { Indexer, IndexerOptions } from '../Indexer'

export abstract class RootIndexer extends Indexer {
  constructor(logger: Logger, opts?: IndexerOptions) {
    super(logger, [], opts)
  }

  override async update(): Promise<number> {
    return Promise.reject(new Error('RootIndexer cannot update'))
  }

  override async invalidate(): Promise<number> {
    return Promise.reject(new Error('RootIndexer cannot invalidate'))
  }

  override async setSafeHeight(): Promise<void> {
    return Promise.resolve()
  }
}
