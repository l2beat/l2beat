import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable } from 'kysely'
import { BaseRepository } from '../../BaseRepository'
import { type SyncMetadataRecord, toRecord, toRow } from './entity'

export class SyncMetadataRepository extends BaseRepository {
  async upsert(record: Insertable<SyncMetadataRecord>): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: Insertable<SyncMetadataRecord>[]): Promise<number> {
    if (records.length === 0) return 0

    //TODO: temporary fix to unblock backend
    const uniqueRecords: Insertable<SyncMetadataRecord>[] = []
    for (const record of records) {
      if (
        uniqueRecords.some(
          (r) => r.feature === record.feature && r.id === record.id,
        )
      ) {
        continue
      }

      uniqueRecords.push(record)
    }

    const rows = uniqueRecords.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('SyncMetadata')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['feature', 'id']).doUpdateSet((eb) => ({
            target: eb.ref('excluded.target'),
            // Keep the existing value if the excluded value is null
            syncedUntil: eb.fn.coalesce(
              eb.ref('excluded.syncedUntil'),
              eb.ref('SyncMetadata.syncedUntil'),
            ),
            blockTarget: eb.ref('excluded.blockTarget'),
            // Keep the existing value if the excluded value is null
            blockSyncedUntil: eb.fn.coalesce(
              eb.ref('excluded.blockSyncedUntil'),
              eb.ref('SyncMetadata.blockSyncedUntil'),
            ),
          })),
        )
        .execute()
    })
    return records.length
  }

  async updateSyncedUntil(
    feature: SyncMetadataRecord['feature'],
    ids: string[],
    syncedUntil: UnixTime,
    blockSyncedUntil?: number,
  ): Promise<void> {
    await this.db
      .updateTable('SyncMetadata')
      .set({
        syncedUntil: UnixTime.toDate(syncedUntil),
        blockSyncedUntil,
      })
      .where('feature', '=', feature)
      .where('id', 'in', ids)
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
