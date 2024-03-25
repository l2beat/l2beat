import { Indexer } from '../Indexer'

export abstract class ChildIndexer extends Indexer {
  override async tick(): Promise<number> {
    return Promise.reject(new Error('ChildIndexer cannot tick'))
  }
}
