import { assert, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type TvsPriceRecord, toRecord, toRow } from './entity'

export class TvsPriceRepository extends BaseRepository {
  async insertMany(records: TvsPriceRecord[]) {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('TvsPrice').values(batch).execute()
    })
    return rows.length
  }

  async getPrices(configurationIds: string[], timestamps: UnixTime[]) {
    const from = timestamps[0]
    const to = timestamps[timestamps.length - 1]
    assert(from && to, 'Timestamps should not be empty')

    const rows = await this.db
      .selectFrom('TvsPrice')
      .select(['timestamp', 'configurationId', 'priceId', 'priceUsd'])
      .where('configurationId', 'in', configurationIds)
      .where('timestamp', '>=', UnixTime.toDate(from))
      .where('timestamp', '<=', UnixTime.toDate(to))
      .execute()

    const records = rows.map(toRecord)

    const result = new Map(timestamps.map((t) => [t, new Map()]))

    for (const r of records) {
      result.get(r.timestamp)?.set(r.configurationId, r.priceUsd)
    }

    return result
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
