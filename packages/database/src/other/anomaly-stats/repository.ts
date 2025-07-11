import type { ProjectId, TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type AnomalyStatsRecord, toRecord, toRow } from './entity'

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
