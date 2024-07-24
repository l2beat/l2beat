import { BaseRepository } from '../../BaseRepository'
import { NetworkExplorerRecord, toRow } from './entity'

export class NetworkExplorerRepository extends BaseRepository {
  insertMany(explorers: NetworkExplorerRecord[]) {
    const rows = explorers.map(toRow)

    return this.getDb()
      .insertInto('public.NetworkExplorer')
      .values(rows)
      .execute()
  }
}
