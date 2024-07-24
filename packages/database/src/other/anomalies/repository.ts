import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { AnomalyRecord, toRecord, toRow } from './entity'
import { selectAnomaly } from './select'

export class AnomaliesRepository extends BaseRepository {
  async addOrUpdateMany(records: AnomalyRecord[]): Promise<number> {
    for (const record of records) {
      await this.addOrUpdate(record)
    }
    return records.length
  }

  async addOrUpdate(record: AnomalyRecord): Promise<string> {
    const row = toRow(record)
    await this.db
      .insertInto('public.anomalies')
      .values(row)
      .onConflict((cb) =>
        cb
          .columns(['timestamp', 'project_id', 'subtype'])
          .doUpdateSet((eb) => ({
            duration: eb.ref('excluded.duration'),
          })),
      )
      .execute()

    return `[${record.timestamp}, ${record.projectId}, ${record.subtype}]: ${record.duration}`
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

  async getByProjectFrom(
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
}
