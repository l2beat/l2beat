import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { AnomalyRecord, toRecord, toRow } from './entity'
import { selectAnomaly } from './select'

export class AnomaliesRepository extends BaseRepository {
  async upsert(record: AnomalyRecord): Promise<void> {
    await this.upsertMany([record])
  }

  async upsertMany(records: AnomalyRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('public.anomalies')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns(['timestamp', 'project_id', 'subtype'])
            .doUpdateSet((eb) => ({
              duration: eb.ref('excluded.duration'),
            })),
        )
        .execute()
    })
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.anomalies')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<AnomalyRecord[]> {
    const rows = await this.db
      .selectFrom('public.anomalies')
      .select(selectAnomaly)
      .execute()

    return rows.map(toRecord)
  }

  async getByProjectIdFrom(
    projectId: ProjectId,
    from: UnixTime,
  ): Promise<AnomalyRecord[]> {
    const rows = await this.db
      .selectFrom('public.anomalies')
      .select(selectAnomaly)
      .where('project_id', '=', projectId)
      .where('timestamp', '>=', from.toDate())
      .execute()
    return rows.map(toRecord)
  }

  async getByProjectIdsFrom(
    projectIds: ProjectId[],
    from: UnixTime,
  ): Promise<AnomalyRecord[]> {
    const rows = await this.db
      .selectFrom('public.anomalies')
      .select(selectAnomaly)
      .where('project_id', 'in', projectIds)
      .where('timestamp', '>=', from.toDate())
      .execute()
    return rows.map(toRecord)
  }
}
