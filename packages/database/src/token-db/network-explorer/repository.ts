import { BaseRepository } from '../../BaseRepository'
import { UpsertableNetworkExplorerRecord, upsertableToRow } from './entity'

export class NetworkExplorerRepository extends BaseRepository {
  async insertMany(
    records: UpsertableNetworkExplorerRecord[],
  ): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(upsertableToRow)
    await this.batch(rows, 100, async (batch) => {
      await this.db.insertInto('NetworkExplorer').values(batch).execute()
    })
    return records.length
  }
}
