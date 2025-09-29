import { assert, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { SyncMetadata } from '../kysely/generated/types'

export type SyncMetadataFeature =
  | 'activity'
  | 'l2costs'
  | 'liveness'
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
    syncedUntil: record.syncedUntil
      ? UnixTime.toDate(record.syncedUntil)
      : null,
    blockSyncedUntil: record.blockSyncedUntil ? record.blockSyncedUntil : null,
  }
}

export class SyncMetadataRepository extends BaseRepository {
  async upsertMany(records: Insertable<SyncMetadataRecord>[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
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

  async getByFeatureAndId(
    feature: SyncMetadataRecord['feature'],
    id: string,
  ): Promise<SyncMetadataRecord | undefined> {
    const row = await this.db
      .selectFrom('SyncMetadata')
      .selectAll()
      .where('feature', '=', feature)
      .where('id', '=', id)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getByFeatureAndIds(
    feature: SyncMetadataRecord['feature'],
    ids: string[],
  ): Promise<SyncMetadataRecord[]> {
    const rows = await this.db
      .selectFrom('SyncMetadata')
      .selectAll()
      .where('feature', '=', feature)
      .where('id', 'in', ids)
      .execute()
    return rows.map(toRecord)
  }

  async getMaxTargetForFeature(
    feature: SyncMetadataRecord['feature'],
  ): Promise<UnixTime> {
    const row = await this.db
      .selectFrom('SyncMetadata')
      .select(this.db.fn.max('target').as('maxTarget'))
      .where('feature', '=', feature)
      .executeTakeFirst()
    assert(row?.maxTarget, 'Max target for feature not found')
    return UnixTime.fromDate(row.maxTarget)
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
