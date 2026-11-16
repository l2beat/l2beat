import { UnixTime } from '@l2beat/shared-pure'
import { type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { SyncMetadata } from '../kysely/generated/types'

export type SyncMetadataFeature =
  | 'activity'
  | 'l2costs'
  | 'liveness'
  | 'dataAvailability'
  | 'tvs'
  | 'privacy'

export interface SyncMetadataRecord {
  feature: SyncMetadataFeature
  id: string
  target: UnixTime
  syncedUntil: UnixTime | null
  blockTarget: number | null
  blockSyncedUntil: number | null
}

export interface SyncTarget {
  id: string
  target: UnixTime
  blockTarget?: number
}

function toRecord(row: Selectable<SyncMetadata>): SyncMetadataRecord {
  return {
    ...row,
    feature: row.feature as SyncMetadataFeature,
    target: UnixTime.fromDate(row.target),
    syncedUntil: row.syncedUntil ? UnixTime.fromDate(row.syncedUntil) : null,
  }
}

export class SyncMetadataRepository extends BaseRepository {
  /** Inserts new ids unsynced; existing ids keep their progress. */
  async setTargets(
    feature: SyncMetadataFeature,
    targets: SyncTarget[],
  ): Promise<void> {
    const rows = targets.map((t) => ({
      feature,
      id: t.id,
      target: UnixTime.toDate(t.target),
      blockTarget: t.blockTarget ?? null,
    }))
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('SyncMetadata')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['feature', 'id']).doUpdateSet((eb) => ({
            target: eb.ref('excluded.target'),
            blockTarget: eb.ref('excluded.blockTarget'),
          })),
        )
        .execute()
    })
  }

  async updateSyncedUntil(
    feature: SyncMetadataFeature,
    ids: string[],
    syncedUntil: UnixTime,
    blockSyncedUntil?: number,
  ): Promise<void> {
    if (ids.length === 0) {
      return
    }
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

  /**
   * Moves `target` to where the work ended and caps `syncedUntil` there.
   * Updates only existing rows that differ, so repeated calls write nothing.
   */
  async markEnded(
    feature: SyncMetadataFeature,
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

  async getByFeature(feature: SyncMetadataFeature) {
    const rows = await this.db
      .selectFrom('SyncMetadata')
      .selectAll()
      .where('feature', '=', feature)
      .execute()
    return rows.map(toRecord)
  }

  async getByFeatureAndId(
    feature: SyncMetadataFeature,
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
    feature: SyncMetadataFeature,
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
    feature: SyncMetadataFeature,
  ): Promise<UnixTime | undefined> {
    const row = await this.db
      .selectFrom('SyncMetadata')
      .select(this.db.fn.max('target').as('maxTarget'))
      .where('feature', '=', feature)
      .executeTakeFirst()
    return row?.maxTarget ? UnixTime.fromDate(row.maxTarget) : undefined
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('SyncMetadata').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
