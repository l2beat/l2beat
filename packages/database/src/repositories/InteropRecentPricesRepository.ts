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

export interface InteropRecentPriceRequest {
  requestId: number
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

  async getClosestPricesAtOrBefore(
    requests: InteropRecentPriceRequest[],
    errorMargin: UnixTime,
  ): Promise<Map<number, number | undefined>> {
    const result = new Map<number, number | undefined>()
    if (requests.length === 0) {
      return result
    }

    await this.batch(requests, 10_000, async (batch) => {
      const values = sql.join(
        batch.map(
          (request) =>
            sql`(${request.requestId}::integer, ${request.coingeckoId}::varchar, ${UnixTime.toDate(request.timestamp)}::timestamp)`,
        ),
      )

      const rows = await sql<{
        requestId: number
        priceUsd: number | null
      }>`
        WITH "Requests" ("requestId", "coingeckoId", "timestamp") AS (
          VALUES ${values}
        )
        SELECT "Requests"."requestId", "Price"."priceUsd"
        FROM "Requests"
        LEFT JOIN LATERAL (
          SELECT "priceUsd"
          FROM "InteropRecentPrices"
          WHERE "coingeckoId" = "Requests"."coingeckoId"
            AND "timestamp" <= "Requests"."timestamp"
            AND "timestamp" >= "Requests"."timestamp" - ${errorMargin} * INTERVAL '1 second'
          ORDER BY "timestamp" DESC
          LIMIT 1
        ) AS "Price" ON true
      `.execute(this.db)

      for (const row of rows.rows) {
        result.set(row.requestId, row.priceUsd ?? undefined)
      }
    })

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
