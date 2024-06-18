import { UnixTime } from '@l2beat/shared-pure'
import { PostgresDatabase } from '../kysely'
import { L2CostPrice, toRecord, toRow } from './entity'
import { selectL2CostPrice } from './select'

export class L2CostPriceRepository {
  constructor(private readonly db: PostgresDatabase) {}
  async getAll() {
    const rows = await this.db
      .selectFrom('l2_costs_prices')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getByTimestampRange(from: UnixTime, to: UnixTime) {
    const rows = await this.db
      .selectFrom('l2_costs_prices')
      .select(selectL2CostPrice)
      .where((eb) =>
        eb.and([
          eb('timestamp', '>=', from.toDate()),
          eb('timestamp', '<=', to.toDate()),
        ]),
      )
      .execute()

    return rows.map(toRecord)
  }

  async addMany(records: L2CostPrice[]) {
    const rows = records.map(toRow)

    await this.db.insertInto('l2_costs_prices').values(rows).execute()

    return rows.length
  }

  deleteAfter(from: UnixTime) {
    return this.db
      .deleteFrom('l2_costs_prices')
      .where('timestamp', '>', from.toDate())
      .execute()
  }

  deleteAll() {
    return this.db.deleteFrom('l2_costs_prices').execute()
  }
}
