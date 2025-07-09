import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type L2CostPriceRecord, toRecord, toRow } from './entity'

export class L2CostPriceRepository extends BaseRepository {
  async getAll(): Promise<L2CostPriceRecord[]> {
    const rows = await this.db.selectFrom('L2CostPrice').selectAll().execute()
    return rows.map(toRecord)
  }

  async getByTimestampRange(
    from: UnixTime,
    to: UnixTime,
  ): Promise<L2CostPriceRecord[]> {
    const rows = await this.db
      .selectFrom('L2CostPrice')
      .selectAll()
      .where('timestamp', '>=', UnixTime.toDate(from))
      .where('timestamp', '<=', UnixTime.toDate(to))
      .execute()
    return rows.map(toRecord)
  }

  async insertMany(records: L2CostPriceRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('L2CostPrice').values(batch).execute()
    })
    return rows.length
  }

  async deleteAfter(from: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('L2CostPrice')
      .where('timestamp', '>', UnixTime.toDate(from))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('L2CostPrice').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
