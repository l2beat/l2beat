import { UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
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
  /** Of the last block the counts include, for the live Ethereum activity */
  latestBlockTimestamp: UnixTime | null
}

export function toRecord(row: Selectable<SyncMetadata>): SyncMetadataRecord {
  return {
    ...row,
    feature: row.feature as SyncMetadataFeature,
    target: UnixTime.fromDate(row.target),
    syncedUntil: row.syncedUntil ? UnixTime.fromDate(row.syncedUntil) : null,
    blockTarget: row.blockTarget,
    blockSyncedUntil: row.blockSyncedUntil,
    latestBlockTimestamp: row.latestBlockTimestamp
      ? UnixTime.fromDate(row.latestBlockTimestamp)
      : null,
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
    latestBlockTimestamp: record.latestBlockTimestamp
      ? UnixTime.toDate(record.latestBlockTimestamp)
      : null,
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
    latestBlockTimestamp?: UnixTime,
  ): Promise<void> {
    if (ids.length === 0) {
      return
    }
    await this.db
      .updateTable('SyncMetadata')
      .set({
        syncedUntil: UnixTime.toDate(syncedUntil),
        blockSyncedUntil,
        latestBlockTimestamp:
          latestBlockTimestamp !== undefined
            ? UnixTime.toDate(latestBlockTimestamp)
            : undefined,
      })
      .where('feature', '=', feature)
      .where('id', 'in', ids)
      .execute()
  }

  /** Readers then fall back to the counts of whole hours and days */
  async clearLatestBlockTimestamp(
    feature: SyncMetadataRecord['feature'],
    id: string,
  ): Promise<void> {
    await this.db
      .updateTable('SyncMetadata')
      .set({ latestBlockTimestamp: null })
      .where('feature', '=', feature)
      .where('id', '=', id)
      .execute()
  }

  /**
   * Moves `target` to where the work ended and caps `syncedUntil` there.
   * Updates only existing rows that differ, so repeated calls write nothing.
   */
  async markEnded(
    feature: SyncMetadataRecord['feature'],
    records: { id: string; end: UnixTime }[],
  ): Promise<number> {
    if (records.length === 0) {
      return 0
    }

    const v = sql<{ id: string; end: Date }>`unnest(
      ${records.map((r) => r.id)}::varchar[],
      ${records.map((r) => UnixTime.toDate(r.end))}::timestamp[]
    )`.as<'v'>(sql`v("id", "end")`)

    const result = await this.db
      .updateTable('SyncMetadata')
      .from(v)
      .set((eb) => ({
        target: eb.ref('v.end'),
        // Not least(): it skips nulls, and a null syncedUntil has to stay null
        syncedUntil: eb
          .case()
          .when('SyncMetadata.syncedUntil', '>', eb.ref('v.end'))
          .then(eb.ref('v.end'))
          .else(eb.ref('SyncMetadata.syncedUntil'))
          .end(),
      }))
      .where('SyncMetadata.feature', '=', feature)
      .whereRef('SyncMetadata.id', '=', 'v.id')
      .where((eb) =>
        eb.or([
          eb('SyncMetadata.target', '<>', eb.ref('v.end')),
          eb('SyncMetadata.syncedUntil', '>', eb.ref('v.end')),
        ]),
      )
      .executeTakeFirst()
    return Number(result.numUpdatedRows)
  }

  async getByFeature(feature: SyncMetadataRecord['feature']) {
    const rows = await this.db
      .selectFrom('SyncMetadata')
      .selectAll()
      .where('feature', '=', feature)
      .execute()
    return rows.map(toRecord)
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
    if (ids.length === 0) {
      return []
    }
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
  ): Promise<UnixTime | undefined> {
    const row = await this.db
      .selectFrom('SyncMetadata')
      .select(this.db.fn.max('target').as('maxTarget'))
      .where('feature', '=', feature)
      .executeTakeFirst()
    return row?.maxTarget ? UnixTime.fromDate(row.maxTarget) : undefined
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
