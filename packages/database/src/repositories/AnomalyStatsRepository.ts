import {
  type ProjectId,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AnomalyStats } from '../kysely/generated/types'

export interface AnomalyStatsRecord {
  timestamp: UnixTime
  projectId: string
  subtype: TrackedTxsConfigSubtype
  mean: number
  stdDev: number
}

export function toRow(record: AnomalyStatsRecord): Insertable<AnomalyStats> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export function toRecord(row: Selectable<AnomalyStats>): AnomalyStatsRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    subtype: row.subtype as TrackedTxsConfigSubtype,
  }
}

export class AnomalyStatsRepository extends BaseRepository {
  async upsertMany(records: AnomalyStatsRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)

    await this.db
      .insertInto('AnomalyStats')
      .values(rows)
      .onConflict((cb) =>
        cb.columns(['timestamp', 'projectId', 'subtype']).doUpdateSet((eb) => ({
          mean: eb.ref('excluded.mean'),
          stdDev: eb.ref('excluded.stdDev'),
        })),
      )
      .execute()

    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('AnomalyStats').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<AnomalyStatsRecord[]> {
    const rows = await this.db.selectFrom('AnomalyStats').selectAll().execute()

    return rows.map(toRecord)
  }

  async getLatestByProjectIdAndSubtype(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
  ): Promise<AnomalyStatsRecord | undefined> {
    const row = await this.db
      .selectFrom('AnomalyStats')
      .selectAll()
      .where('projectId', '=', projectId)
      .where('subtype', '=', subtype)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .executeTakeFirst()

    return row && toRecord(row)
  }

  async getLatestStats(): Promise<AnomalyStatsRecord[]> {
    const subQuery = this.db
      .selectFrom('AnomalyStats')
      .select([
        'projectId',
        'subtype',
        this.db.fn.max('timestamp').as('maxTimestamp'),
      ])
      .groupBy(['projectId', 'subtype'])

    const rows = await this.db
      .selectFrom('AnomalyStats as ans')
      .innerJoin(subQuery.as('latest'), (join) =>
        join
          .onRef('ans.projectId', '=', 'latest.projectId')
          .onRef('ans.subtype', '=', 'latest.subtype')
          .onRef('ans.timestamp', '=', 'latest.maxTimestamp'),
      )
      .selectAll('ans')
      .execute()

    return rows.map(toRecord)
  }
}
