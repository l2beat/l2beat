import { ProjectId } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { AggregatedLivenessRecord, toRecord, toRow } from './entity'
import { selectAggregatedLiveness } from './select'

export class AggregatedLivenessRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdateMany(
    records: AggregatedLivenessRecord[],
    trx?: Transaction,
  ): Promise<number> {
    for (const record of records) {
      await this.addOrUpdate(record, trx)
    }
    return records.length
  }

  async addOrUpdate(
    record: AggregatedLivenessRecord,
    trx?: Transaction,
  ): Promise<string> {
    const scope = trx ?? this.db
    const row = toRow(record)
    await scope
      .insertInto('public.aggregated_liveness')
      .values(row)
      .onConflict((cb) =>
        cb.columns(['project_id', 'subtype', 'range']).doUpdateSet((eb) => ({
          min: eb.ref('excluded.min'),
          avg: eb.ref('excluded.avg'),
          max: eb.ref('excluded.max'),
          updated_at: eb.ref('excluded.updated_at'),
        })),
      )
      .execute()

    return `[${record.projectId}, ${record.subtype}, ${record.range}]: ${record.updatedAt}`
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.aggregated_liveness')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<AggregatedLivenessRecord[]> {
    const rows = await this.db
      .selectFrom('public.aggregated_liveness')
      .select(selectAggregatedLiveness)
      .execute()

    return rows.map(toRecord)
  }

  async getByProject(
    projectId: ProjectId,
  ): Promise<AggregatedLivenessRecord[]> {
    const rows = await this.db
      .selectFrom('public.aggregated_liveness')
      .select(selectAggregatedLiveness)
      .where('project_id', '=', projectId)
      .execute()

    return rows.map(toRecord)
  }
}
