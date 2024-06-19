import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase, Transaction } from '../kysely'
import { AggregatedL2Cost, toRecord, toRow } from './entity'
import { selectAggregatedL2Costs } from './select'

export class AggregatedL2CostRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async getAll(): Promise<AggregatedL2Cost[]> {
    const rows = await this.db
      .selectFrom('aggregated_l2_costs')
      .select(selectAggregatedL2Costs)
      .execute()

    return rows.map(toRecord)
  }

  async addMany(
    records: AggregatedL2Cost[],
    trx?: Transaction,
  ): Promise<number> {
    const scope = trx ?? this.db
    const rows = records.map(toRow)

    await scope
      .insertInto('aggregated_l2_costs')
      .values(rows)
      .onConflict((cb) =>
        cb.columns(['timestamp', 'project_id']).doUpdateSet({
          total_gas: (eb) => eb.ref('excluded.total_gas'),
          total_gas_eth: (eb) => eb.ref('excluded.total_gas_eth'),
          total_gas_usd: (eb) => eb.ref('excluded.total_gas_usd'),
          blobs_gas: (eb) => eb.ref('excluded.blobs_gas'),
          blobs_gas_eth: (eb) => eb.ref('excluded.blobs_gas_eth'),
          blobs_gas_usd: (eb) => eb.ref('excluded.blobs_gas_usd'),
          calldata_gas: (eb) => eb.ref('excluded.calldata_gas'),
          calldata_gas_eth: (eb) => eb.ref('excluded.calldata_gas_eth'),
          calldata_gas_usd: (eb) => eb.ref('excluded.calldata_gas_usd'),
          compute_gas: (eb) => eb.ref('excluded.compute_gas'),
          compute_gas_eth: (eb) => eb.ref('excluded.compute_gas_eth'),
          compute_gas_usd: (eb) => eb.ref('excluded.compute_gas_usd'),
          overhead_gas: (eb) => eb.ref('excluded.overhead_gas'),
          overhead_gas_eth: (eb) => eb.ref('excluded.overhead_gas_eth'),
          overhead_gas_usd: (eb) => eb.ref('excluded.overhead_gas_usd'),
        }),
      )
      .execute()

    return rows.length
  }

  async deleteAfter(from: UnixTime): Promise<void> {
    await this.db
      .deleteFrom('aggregated_l2_costs')
      .where('timestamp', '>', from.toDate())
      .execute()
  }

  async deleteAll(): Promise<void> {
    await this.db.deleteFrom('aggregated_l2_costs').execute()
  }

  async getByProjectAndTimeRange(
    projectId: ProjectId,
    timeRange: [UnixTime, UnixTime],
  ): Promise<AggregatedL2Cost[]> {
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('aggregated_l2_costs')
      .select(selectAggregatedL2Costs)
      .where((eb) =>
        eb.and([
          eb('project_id', '=', projectId.toString()),
          eb('timestamp', '>=', from.toDate()),
          eb('timestamp', '<', to.toDate()),
        ]),
      )
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }
}
