import { BaseRepository } from '../../BaseRepository'
import { NetworkRpcRecord, toRow } from './entity'

export class NetworkRpcRepository extends BaseRepository {
  async insertMany(records: NetworkRpcRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('public.NetworkRpc').values(batch).execute()
    })
    return records.length
  }
}
