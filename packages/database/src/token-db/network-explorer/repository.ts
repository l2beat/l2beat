import { BaseRepository } from '../../BaseRepository'
import { NetworkExplorerRecord, toRow } from './entity'

export class NetworkExplorerRepository extends BaseRepository {
  async insertMany(records: NetworkExplorerRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('public.NetworkExplorer').values(batch).execute()
    })
    return records.length
  }
}
