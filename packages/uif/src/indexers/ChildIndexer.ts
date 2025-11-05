import { Indexer } from '../Indexer'

export abstract class ChildIndexer extends Indexer {
  override tick(): Promise<number> {
    return Promise.reject(new Error('ChildIndexer cannot tick'))
  }
}
