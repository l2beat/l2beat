import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropRecentPrices } from '../kysely/generated/types'

export interface InteropRecentPricesRecord {
  coingeckoId: string
  timestamp: UnixTime
  priceUsd: number
}

export function toRecord(
  row: Selectable<InteropRecentPrices>,
): InteropRecentPricesRecord {
  return {
    coingeckoId: row.coingeckoId,
    timestamp: UnixTime.fromDate(row.timestamp),
    priceUsd: row.priceUsd,
  }
}

export function toRow(
  record: InteropRecentPricesRecord,
): Insertable<InteropRecentPrices> {
  return {
    coingeckoId: record.coingeckoId,
    timestamp: UnixTime.toDate(record.timestamp),
    priceUsd: record.priceUsd,
  }
}

export class InteropRecentPricesRepository extends BaseRepository {
  async insertMany(records: InteropRecentPricesRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('InteropRecentPrices').values(batch).execute()
    })
    return rows.length
  }

  async hasAnyPrices(): Promise<boolean> {
    const row = await this.db
      .selectFrom('InteropRecentPrices')
      .selectAll()
      .limit(1)
      .executeTakeFirst()
    return row !== undefined
  }

  async getClosestPrice(
    coingeckoId: string,
    timestamp: UnixTime,
  ): Promise<number | undefined> {
    const targetTimestamp = UnixTime.toDate(timestamp)
    const fromTime = UnixTime.toDate(timestamp - UnixTime.DAY)
    const toTime = UnixTime.toDate(timestamp + UnixTime.DAY)

    const row = await this.db
      .selectFrom('InteropRecentPrices')
      .select(['priceUsd'])
      .where('coingeckoId', '=', coingeckoId)
      .where('timestamp', '>=', fromTime)
      .where('timestamp', '<=', toTime)
      .orderBy(sql`abs(extract(epoch from age(timestamp, ${targetTimestamp})))`)
      .limit(1)
      .executeTakeFirst()

    return row?.priceUsd
  }

  // Test only methods

  async getAll(): Promise<InteropRecentPricesRecord[]> {
    const rows = await this.db
      .selectFrom('InteropRecentPrices')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async deleteBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropRecentPrices')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAfter(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropRecentPrices')
      .where('timestamp', '>', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropRecentPrices')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
