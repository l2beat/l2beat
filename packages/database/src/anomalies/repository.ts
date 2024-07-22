import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { AnomalyRecord, toRecord, toRow } from './entity'
import { selectAnomaly } from './select'

export class AnomaliesRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdateMany(
    records: AnomalyRecord[],
    trx?: Transaction,
  ): Promise<number> {
    for (const record of records) {
      await this.addOrUpdate(record, trx)
    }
    return records.length
  }

  async addOrUpdate(record: AnomalyRecord, trx?: Transaction): Promise<string> {
    const scope = trx ?? this.db
    const row = toRow(record)
    await scope
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

  async deleteAll() {
    await this.db.deleteFrom('public.anomalies').execute()
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
