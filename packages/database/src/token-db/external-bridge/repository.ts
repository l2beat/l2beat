import { BaseRepository } from '../../BaseRepository'
import { ExternalBridgeRecord, toRow } from './entity'
import { selectExternalBridge } from './select'

export class ExternalBridgeRepository extends BaseRepository {
  async getAll(): Promise<ExternalBridgeRecord[]> {
    const rows = await this.db
      .selectFrom('ExternalBridge')
      .select(selectExternalBridge)
      .execute()
    return rows
  }

  async upsert(record: ExternalBridgeRecord): Promise<void> {
    const row = toRow(record)
    await this.db
      .insertInto('ExternalBridge')
      .values(row)
      .onConflict((cb) => cb.doNothing())
      .execute()
  }
}
