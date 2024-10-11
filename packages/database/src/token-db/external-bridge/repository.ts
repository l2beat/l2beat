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

  async findById(id: string): Promise<ExternalBridgeRecord | null> {
    const row = await this.db
      .selectFrom('ExternalBridge')
      .select(selectExternalBridge)
      .where('ExternalBridge.id', '=', id)
      .executeTakeFirst()
    return row ?? null
  }

  async insert(
    record: UpsertableExternalBridgeRecord,
  ): Promise<{ id: string }> {
    const row = upsertableToRecord(record)
    const result = await this.db
      .insertInto('ExternalBridge')
      .values(row)
      .returning('id')
      .executeTakeFirstOrThrow()
    return result
  }

  async update(id: string, record: UpsertableExternalBridgeRecord) {
    const row = upsertableToRecord(record)
    await this.db
      .updateTable('ExternalBridge')
      .set(row)
      .where('id', '=', id)
      .execute()
  }

  async upsert(
    record: UpsertableExternalBridgeRecord,
  ): Promise<{ id: string }> {
    const row = upsertableToRecord(record)
    const result = await this.db
      .insertInto('ExternalBridge')
      .values(row)
      .onConflict((cb) => cb.doNothing())
      .returning('id')
      .executeTakeFirst()

    return (
      result ??
      (await this.db
        .selectFrom('ExternalBridge')
        .select('id')
        .where('ExternalBridge.name', '=', record.name)
        .where('ExternalBridge.type', '=', record.type)
        .executeTakeFirstOrThrow())
    )
  }

  async delete(id: string) {
    await this.db.deleteFrom('ExternalBridge').where('id', '=', id).execute()
  }
}
