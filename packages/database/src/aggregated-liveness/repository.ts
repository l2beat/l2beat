import { PostgresDatabase, Transaction } from '../kysely'
import { AggregatedLiveness, toRecord, toRow } from './entity'
import { selectAggregatedLiveness } from './select'

export class AggregatedLivenessRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdateMany(
    records: AggregatedLiveness[],
    trx?: Transaction,
  ): Promise<number> {
    for (const record of records) {
      await this.addOrUpdate(record, trx)
    }
    return records.length
  }

  async addOrUpdate(
    record: AggregatedLiveness,
    trx?: Transaction,
  ): Promise<string> {
    const scope = trx ?? this.db
    const row = toRow(record)
    await scope
      .insertInto('public.aggregated_liveness')
      .values(row)
      .onConflict((cb) =>
        cb.columns(['project_id', 'subtype', 'range']).doUpdateSet({
          min: (eb) => eb.ref('excluded.min'),
          avg: (eb) => eb.ref('excluded.avg'),
          max: (eb) => eb.ref('excluded.max'),
          timestamp: (eb) => eb.ref('excluded.timestamp'),
        }),
      )
      .execute()

    return `[${record.projectId}, ${record.subtype}, ${record.range}]: ${record.timestamp}`
  }

  async deleteAll() {
    await this.db.deleteFrom('public.aggregated_liveness').execute()
  }

  async getAll(): Promise<AggregatedLiveness[]> {
    const rows = await this.db
      .selectFrom('public.aggregated_liveness')
      .select(selectAggregatedLiveness)
      .execute()

    return rows.map(toRecord)
  }
}
