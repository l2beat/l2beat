import { UnixTime } from '@l2beat/shared-pure'
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

  async updateTarget(
    record: Pick<SyncMetadataRecord, 'feature' | 'id' | 'target'>,
  ): Promise<void> {
    await this.db
      .updateTable('SyncMetadata')
      .set({ target: UnixTime.toDate(record.target) })
      .where('feature', '=', record.feature)
      .where('id', '=', record.id)
      .execute()
  }

  async updateSyncedUntil(
    record: Pick<SyncMetadataRecord, 'feature' | 'id' | 'syncedUntil'>,
  ): Promise<void> {
    await this.db
      .updateTable('SyncMetadata')
      .set({
        syncedUntil: record.syncedUntil
          ? UnixTime.toDate(record.syncedUntil)
          : null,
      })
      .where('feature', '=', record.feature)
      .where('id', '=', record.id)
      .execute()
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
