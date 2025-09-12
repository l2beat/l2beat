import { type TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { RealTimeAnomaly } from '../kysely/generated/types'

export type RealTimeAnomalyStatus = 'ongoing' | 'recovered'

export interface RealTimeAnomalyRecord<
  T extends RealTimeAnomalyStatus = RealTimeAnomalyStatus,
> {
  start: UnixTime
  projectId: string
  subtype: TrackedTxsConfigSubtype
  status: T
  isApproved: boolean
  end?: UnixTime
}

export function toRow<T extends RealTimeAnomalyStatus = RealTimeAnomalyStatus>(
  record: RealTimeAnomalyRecord<T>,
): Insertable<RealTimeAnomaly> {
  return {
    ...record,
    start: UnixTime.toDate(record.start),
    end: record.end ? UnixTime.toDate(record.end) : undefined,
  }
}

export function toRecord<T extends RealTimeAnomalyStatus>(
  row: Selectable<RealTimeAnomaly>,
): RealTimeAnomalyRecord<T> {
  return {
    ...row,
    start: UnixTime.fromDate(row.start),
    end: row.end ? UnixTime.fromDate(row.end) : undefined,
    subtype: row.subtype as TrackedTxsConfigSubtype,
    status: row.status as T,
  }
}

export class RealTimeAnomaliesRepository extends BaseRepository {
  async upsert(record: RealTimeAnomalyRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: RealTimeAnomalyRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('RealTimeAnomaly')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['start', 'projectId', 'subtype']).doUpdateSet((eb) => ({
            status: eb.ref('excluded.status'),
            isApproved: eb.ref('excluded.isApproved'),
            end: eb.ref('excluded.end'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async getAll(): Promise<RealTimeAnomalyRecord[]> {
    const rows = await this.db
      .selectFrom('RealTimeAnomaly')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getOngoingAnomalies(
    projectIds?: string[],
  ): Promise<RealTimeAnomalyRecord[]> {
    let query = this.db
      .selectFrom('RealTimeAnomaly')
      .selectAll()
      .where('status', '=', 'ongoing')

    if (projectIds) {
      if (projectIds.length === 0) {
        return []
      }
      query = query.where('projectId', 'in', projectIds)
    }

    const rows = await query.execute()

    return rows.map(toRecord)
  }

  async getApprovedAnomaliesByProjectIds(
    projectIds: string[],
  ): Promise<RealTimeAnomalyRecord[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .selectFrom('RealTimeAnomaly')
      .selectAll()
      .where('isApproved', '=', true)
      .where('projectId', 'in', projectIds)
      .execute()

    return rows.map(toRecord)
  }

  async getApprovedOngoingAnomalies(): Promise<RealTimeAnomalyRecord[]> {
    const rows = await this.db
      .selectFrom('RealTimeAnomaly')
      .selectAll()
      .where('isApproved', '=', true)
      .where('status', '=', 'ongoing')
      .execute()

    return rows.map(toRecord)
  }

  async getProjectIds(): Promise<string[]> {
    const rows = await this.db
      .selectFrom('RealTimeAnomaly')
      .select(['projectId'])
      .groupBy('projectId')
      .execute()

    return rows.map((row) => row.projectId)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('RealTimeAnomaly')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByProjectId(projectIds: string[]): Promise<number> {
    const result = await this.db
      .deleteFrom('RealTimeAnomaly')
      .where('projectId', 'in', projectIds)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
