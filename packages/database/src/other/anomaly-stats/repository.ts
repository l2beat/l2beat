import type { ProjectId, TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type AnomalyStatsRecord, toRecord, toRow } from './entity'
import { selectAnomaly } from './select'

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
    const rows = await this.db
      .selectFrom('AnomalyStats')
      .select(selectAnomaly)
      .execute()

    return rows.map(toRecord)
  }

  async getLatestByProjectIdAndSubtype(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
  ): Promise<AnomalyStatsRecord | undefined> {
    const row = await this.db
      .selectFrom('AnomalyStats')
      .select(selectAnomaly)
      .where('projectId', '=', projectId)
      .where('subtype', '=', subtype)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .executeTakeFirst()

    return row && toRecord(row)
  }
}
