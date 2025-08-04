import { BaseRepository } from '../../BaseRepository'
import { type SyncMetadataRecord, toRecord, toRow } from './entity'

export class SyncMetadataRepository extends BaseRepository {
  async upsert(record: SyncMetadataRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: SyncMetadataRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('SyncMetadata')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['feature', 'id']).doUpdateSet((eb) => ({
            target: eb.ref('excluded.target'),
            syncedUntil: eb.ref('excluded.syncedUntil'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async getAll(): Promise<SyncMetadataRecord[]> {
    const rows = await this.db.selectFrom('SyncMetadata').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('SyncMetadata').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
