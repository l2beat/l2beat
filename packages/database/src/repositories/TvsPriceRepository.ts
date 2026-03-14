import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TvsPrice } from '../kysely/generated/types'

export interface TvsPriceRecord {
  timestamp: UnixTime
  configurationId: string
  priceId: string
  priceUsd: number
}

export function toRecord(row: Selectable<TvsPrice>): TvsPriceRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(record: TvsPriceRecord): Insertable<TvsPrice> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export class TvsPriceRepository extends BaseRepository {
  async upsertMany(records: TvsPriceRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('TvsPrice')
        .values(batch)
        .onConflict((oc) =>
          oc.columns(['timestamp', 'configurationId']).doUpdateSet((eb) => ({
            priceUsd: eb.ref('excluded.priceUsd'),
          })),
        )
        .execute()
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

  async deleteByConfigIds(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0
    const result = await this.db
      .deleteFrom('TvsPrice')
      .where('configurationId', 'in', ids)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigs(
    configs: {
      configurationId: string
      fromInclusive: UnixTime
      toInclusive: UnixTime
    }[],
  ): Promise<number> {
    if (configs.length === 0) return 0

    let totalDeleted = 0
    await this.batch(configs, 100, async (batch) => {
      const result = await this.db
        .deleteFrom('TvsPrice')
        .where((eb) =>
          eb.or(
            batch.map((c) =>
              eb.and([
                eb('configurationId', '=', c.configurationId),
                eb('timestamp', '>=', UnixTime.toDate(c.fromInclusive)),
                eb('timestamp', '<=', UnixTime.toDate(c.toInclusive)),
              ]),
            ),
          ),
        )
        .executeTakeFirst()
      totalDeleted += Number(result.numDeletedRows)
    })
    return totalDeleted
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
