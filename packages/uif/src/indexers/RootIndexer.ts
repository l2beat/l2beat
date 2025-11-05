import type { Logger } from '@l2beat/backend-tools'

import { Indexer, type IndexerOptions } from '../Indexer'

export abstract class RootIndexer extends Indexer {
  constructor(logger: Logger, opts?: IndexerOptions) {
    super(logger, [], opts)
  }

  override update(): Promise<number> {
    return Promise.reject(new Error('RootIndexer cannot update'))
  }

  override invalidate(): Promise<number> {
    return Promise.reject(new Error('RootIndexer cannot invalidate'))
  }

  override setInitialState(): Promise<void> {
    return Promise.resolve()
  }

  override setInitialState(): Promise<void> {
    return Promise.resolve()
  }
}
