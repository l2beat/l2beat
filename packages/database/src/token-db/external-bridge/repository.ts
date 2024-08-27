import { BaseRepository } from '../../BaseRepository'
import { ExternalBridgeRecord, toRow } from './entity'

export class ExternalBridgeRepository extends BaseRepository {
  async upsert(record: ExternalBridgeRecord): Promise<void> {
    const row = toRow(record)
    await this.db
      .insertInto('ExternalBridge')
      .values(row)
      .onConflict((cb) => cb.doNothing())
      .execute()
  }
}
