import {
  type ProjectId,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { Anomaly } from '../kysely/generated/types'

export interface AnomalyRecord {
  timestamp: UnixTime
  projectId: string
  subtype: TrackedTxsConfigSubtype
  duration: number
}

export function toRow(record: AnomalyRecord): Insertable<Anomaly> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export function toRecord(row: Selectable<Anomaly>): AnomalyRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    subtype: row.subtype as TrackedTxsConfigSubtype,
  }
}

export class AnomaliesRepository extends BaseRepository {
  async upsert(record: AnomalyRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: AnomalyRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('Anomaly')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns(['timestamp', 'projectId', 'subtype'])
            .doUpdateSet((eb) => ({
              duration: eb.ref('excluded.duration'),
            })),
        )
        .execute()
    })
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Anomaly').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<AnomalyRecord[]> {
    const rows = await this.db.selectFrom('Anomaly').selectAll().execute()

    return rows.map(toRecord)
  }

  async getByProjectIdFrom(
    projectId: ProjectId,
    from: UnixTime,
  ): Promise<AnomalyRecord[]> {
    const rows = await this.db
      .selectFrom('Anomaly')
      .selectAll()
      .where('projectId', '=', projectId)
      .where('timestamp', '>=', UnixTime.toDate(from))
      .execute()
    return rows.map(toRecord)
  }

  async getByProjectIdsFrom(
    projectIds: ProjectId[],
    from: UnixTime,
  ): Promise<AnomalyRecord[]> {
    const rows = await this.db
      .selectFrom('Anomaly')
      .selectAll()
      .where('projectId', 'in', projectIds)
      .where('timestamp', '>=', UnixTime.toDate(from))
      .execute()
    return rows.map(toRecord)
  }
}
