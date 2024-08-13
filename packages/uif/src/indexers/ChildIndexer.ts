import { assert, Logger } from '@l2beat/backend-tools'
import { Indexer, IndexerOptions } from '../Indexer'

export abstract class ChildIndexer extends Indexer {
  constructor(logger: Logger, parents: Indexer[], options?: IndexerOptions) {
    assert(parents.length > 0, 'ChildIndexer should have parents')
    super(logger, parents, options)
  }

  override async tick(): Promise<number> {
    return await Promise.reject(new Error('ChildIndexer cannot tick'))
  }

  override scheduleTick(): void {
    throw new Error('ChildIndexer cannot schedule tick')
  }
}
