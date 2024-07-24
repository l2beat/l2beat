import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { AggregatedL2CostRecord, toRecord, toRow } from './entity'
import { selectAggregatedL2Costs } from './select'

export class AggregatedL2CostRepository extends BaseRepository {
  async getAll(): Promise<AggregatedL2CostRecord[]> {
    const rows = await this.getDb()
      .selectFrom('public.aggregated_l2_costs')
      .select(selectAggregatedL2Costs)
      .execute()

    return rows.map(toRecord)
  }

  async addOrUpdateMany(records: AggregatedL2CostRecord[]): Promise<number> {
    const rows = records.map(toRow)

    await this.batch(rows, 5_000, async (trx, batch) => {
      await trx
        .insertInto('public.aggregated_l2_costs')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['timestamp', 'project_id']).doUpdateSet((eb) => ({
            total_gas: eb.ref('excluded.total_gas'),
            total_gas_eth: eb.ref('excluded.total_gas_eth'),
            total_gas_usd: eb.ref('excluded.total_gas_usd'),
            blobs_gas: eb.ref('excluded.blobs_gas'),
            blobs_gas_eth: eb.ref('excluded.blobs_gas_eth'),
            blobs_gas_usd: eb.ref('excluded.blobs_gas_usd'),
            calldata_gas: eb.ref('excluded.calldata_gas'),
            calldata_gas_eth: eb.ref('excluded.calldata_gas_eth'),
            calldata_gas_usd: eb.ref('excluded.calldata_gas_usd'),
            compute_gas: eb.ref('excluded.compute_gas'),
            compute_gas_eth: eb.ref('excluded.compute_gas_eth'),
            compute_gas_usd: eb.ref('excluded.compute_gas_usd'),
            overhead_gas: eb.ref('excluded.overhead_gas'),
            overhead_gas_eth: eb.ref('excluded.overhead_gas_eth'),
            overhead_gas_usd: eb.ref('excluded.overhead_gas_usd'),
          })),
        )
        .execute()
    })

    return records.length
  }

  async deleteAfter(from: UnixTime): Promise<number> {
    const result = await this.getDb()
      .deleteFrom('public.aggregated_l2_costs')
      .where('timestamp', '>', from.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.getDb()
      .deleteFrom('public.aggregated_l2_costs')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getByProjectAndTimeRange(
    projectId: ProjectId,
    timeRange: [UnixTime, UnixTime],
  ): Promise<AggregatedL2CostRecord[]> {
    const [from, to] = timeRange
    const rows = await this.getDb()
      .selectFrom('public.aggregated_l2_costs')
      .select(selectAggregatedL2Costs)
      .where('project_id', '=', projectId.toString())
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<', to.toDate())
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }
}
