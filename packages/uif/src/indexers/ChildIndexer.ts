import { Indexer } from '../Indexer'

export abstract class ChildIndexer extends Indexer {
  override async tick(): Promise<number> {
    return await Promise.reject(new Error('ChildIndexer cannot tick'))
  }

  override scheduleTick(): void {
    throw new Error('ChildIndexer cannot schedule tick')
  }
}
