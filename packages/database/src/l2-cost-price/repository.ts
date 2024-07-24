import { UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase } from '../kysely'
import { batchExecute } from '../utils/batchExecute'
import { L2CostPriceRecord, toRecord, toRow } from './entity'
import { selectL2CostPrice } from './select'

export class L2CostPriceRepository {
  constructor(private readonly db: PostgresDatabase) {}
  async getAll() {
    const rows = await this.db
      .selectFrom('public.l2_costs_prices')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getByTimestampRange(from: UnixTime, to: UnixTime) {
    const rows = await this.db
      .selectFrom('public.l2_costs_prices')
      .select(selectL2CostPrice)
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<=', to.toDate())
      .execute()

    return rows.map(toRecord)
  }

  async addMany(records: L2CostPriceRecord[]) {
    const rows = records.map(toRow)

    await batchExecute(this.db, rows, 10_000, async (trx, batch) => {
      await trx.insertInto('public.l2_costs_prices').values(batch).execute()
    })

    return rows.length
  }

  async deleteAfter(from: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('public.l2_costs_prices')
      .where('timestamp', '>', from.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.l2_costs_prices')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
