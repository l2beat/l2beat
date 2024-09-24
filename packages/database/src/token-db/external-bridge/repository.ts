import { BaseRepository } from '../../BaseRepository'
import {
  ExternalBridgeRecord,
  UpsertableExternalBridgeRecord,
  upsertableToRecord,
} from './entity'
import { selectExternalBridge } from './select'

export class ExternalBridgeRepository extends BaseRepository {
  async getAll(): Promise<ExternalBridgeRecord[]> {
    const rows = await this.db
      .selectFrom('ExternalBridge')
      .select(selectExternalBridge)
      .execute()
    return rows
  }

  async upsert(
    record: UpsertableExternalBridgeRecord,
  ): Promise<{ id: string }> {
    const row = upsertableToRecord(record)
    return await this.db
      .insertInto('ExternalBridge')
      .values(row)
      .onConflict((cb) => cb.doNothing())
      .returning('id')
      .executeTakeFirstOrThrow()
  }
}
