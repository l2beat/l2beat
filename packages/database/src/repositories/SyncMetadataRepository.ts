import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../BaseRepository'
import type { Insertable, Selectable } from 'kysely'
import type { SyncMetadata } from '../kysely/generated/types'

export type SyncMetadataFeature =
  | 'activity'
  | 'l2costs'
  | 'liveness'
  | 'anomalies'
  | 'dataAvailability'
  | 'tvs'

export interface SyncMetadataRecord {
  feature: SyncMetadataFeature
  id: string
  target: UnixTime
  syncedUntil: UnixTime | null
  blockTarget: number | null
  blockSyncedUntil: UnixTime | null
}

export function toRecord(row: Selectable<SyncMetadata>): SyncMetadataRecord {
  return {
    ...row,
    feature: row.feature as SyncMetadataFeature,
    target: UnixTime.fromDate(row.target),
    syncedUntil: row.syncedUntil ? UnixTime.fromDate(row.syncedUntil) : null,
    blockTarget: row.blockTarget,
    blockSyncedUntil: row.blockSyncedUntil,
  }
}

export function toRow(
  record: Insertable<SyncMetadataRecord>,
): Insertable<SyncMetadata> {
  return {
    ...toRowWithoutTarget(record),
    target: UnixTime.toDate(record.target),
    blockSyncedUntil: record.blockSyncedUntil,
  }
}

export function toRowWithoutTarget(
  record: Omit<Insertable<SyncMetadataRecord>, 'target' | 'blockTarget'>,
): Omit<Insertable<SyncMetadata>, 'target' | 'blockTarget'> {
  return {
    ...record,
    syncedUntil:
      record.syncedUntil !== null
        ? record.syncedUntil
          ? UnixTime.toDate(record.syncedUntil)
          : undefined
        : null,
    blockSyncedUntil: record.blockSyncedUntil,
  }
}

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
            syncedUntil: eb.ref('excluded.syncedUntil'),
            blockTarget: eb.ref('excluded.blockTarget'),
            blockSyncedUntil: eb.ref('excluded.blockSyncedUntil'),
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
