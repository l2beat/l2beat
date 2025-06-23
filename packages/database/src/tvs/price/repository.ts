import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type TvsPriceRecord, toRecord, toRow } from './entity'

export class TvsPriceRepository extends BaseRepository {
  async insertMany(records: TvsPriceRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('TvsPrice').values(batch).execute()
    })
    return rows.length
  }

  async getPrice(
    configurationId: string,
    timestamp: UnixTime,
  ): Promise<TvsPriceRecord | undefined> {
    const row = await this.db
      .selectFrom('TvsPrice')
      .select(['timestamp', 'configurationId', 'priceId', 'priceUsd'])
      .where('configurationId', '=', configurationId)
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getPricesInRange(
    configurationIds: string[],
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<TvsPriceRecord[]> {
    const rows = await this.db
      .selectFrom('TvsPrice')
      .select(['timestamp', 'configurationId', 'priceId', 'priceUsd'])
      .where('configurationId', 'in', configurationIds)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .execute()

    return rows.map(toRecord)
  }

  async getPricesInRangeByPriceId(
    priceId: string,
    fromInclusive: UnixTime | null,
    toInclusive: UnixTime,
  ): Promise<TvsPriceRecord[]> {
    let query = this.db
      .selectFrom('TvsPrice')
      .select(['timestamp', 'configurationId', 'priceId', 'priceUsd'])
      .where('priceId', '=', priceId)

    if (fromInclusive) {
      query = query.where('timestamp', '>=', UnixTime.toDate(fromInclusive))
    }
    query = query
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .orderBy('timestamp', 'asc')

    const rows = await query.execute()

    return rows.map(toRecord)
  }

  async getLatestPriceBefore(
    configurationId: string,
    timestamp: UnixTime,
  ): Promise<TvsPriceRecord | undefined> {
    const row = await this.db
      .selectFrom('TvsPrice')
      .select(['timestamp', 'configurationId', 'priceId', 'priceUsd'])
      .where('configurationId', '=', configurationId)
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .orderBy('timestamp', 'desc')
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async deleteByConfigInTimeRange(
    configurationId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('TvsPrice')
      .where('configurationId', '=', configurationId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<TvsPriceRecord[]> {
    const rows = await this.db.selectFrom('TvsPrice').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TvsPrice').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
