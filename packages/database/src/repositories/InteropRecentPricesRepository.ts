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

export interface InteropClosestPriceQuery<TKey extends string = string> {
  key: TKey
  coingeckoId: string
  timestamp: UnixTime
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

  async getClosestPricesForQueries<TKey extends string>(
    queryTuples: InteropClosestPriceQuery<TKey>[],
    errorMargin: UnixTime,
  ): Promise<Map<TKey, number | undefined>> {
    if (queryTuples.length === 0) {
      return new Map()
    }

    const queryValues = queryTuples.map(({ key, coingeckoId, timestamp }) => {
      const targetTimestamp = UnixTime.toDate(timestamp)
      const fromTime = UnixTime.toDate(timestamp - errorMargin)
      const toTime = UnixTime.toDate(timestamp + errorMargin)

      return sql`(
        ${key},
        ${coingeckoId},
        ${fromTime},
        ${toTime},
        ${targetTimestamp}
      )`
    })

    const queryResult = await sql<{ queryKey: TKey; priceUsd: number | null }>`
      select q."queryKey", p."priceUsd"
      from (
        values ${sql.join(queryValues)}
      ) as q("queryKey", "coingeckoId", "fromTime", "toTime", "targetTimestamp")
      left join lateral (
        select "priceUsd"
        from "InteropRecentPrices" as rp
        where rp."coingeckoId" = q."coingeckoId"
          and rp."timestamp" >= q."fromTime"::timestamp
          and rp."timestamp" <= q."toTime"::timestamp
        order by abs(extract(epoch from age(rp."timestamp", q."targetTimestamp"::timestamp))) asc,
          rp."timestamp" desc
        limit 1
      ) as p on true
    `.execute(this.db)

    const result = new Map<TKey, number | undefined>()

    for (const row of queryResult.rows) {
      result.set(row.queryKey, row.priceUsd ?? undefined)
    }

    return result
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
