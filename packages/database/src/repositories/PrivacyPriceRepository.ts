import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { PrivacyPrice } from '../kysely/generated/types'

export interface PrivacyPriceRecord {
  configurationId: string
  timestamp: UnixTime
  priceUsd: number
  priceId: string
}

export function toRecord(row: Selectable<PrivacyPrice>): PrivacyPriceRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(record: PrivacyPriceRecord): Insertable<PrivacyPrice> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export class PrivacyPriceRepository extends BaseRepository {
  async upsertMany(records: PrivacyPriceRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db
        .insertInto('PrivacyPrice')
        .values(batch)
        .onConflict((oc) =>
          oc.columns(['timestamp', 'configurationId']).doUpdateSet((eb) => ({
            priceUsd: eb.ref('excluded.priceUsd'),
            priceId: eb.ref('excluded.priceId'),
          })),
        )
        .execute()
    })

    return rows.length
  }

  async getPricesInRange(
    configurationId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<PrivacyPriceRecord[]> {
    const rows = await this.db
      .selectFrom('PrivacyPrice')
      .selectAll()
      .where('configurationId', '=', configurationId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  async getPricesByPriceIdInRange(
    priceId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<PrivacyPriceRecord[]> {
    const rows = await this.db
      .selectFrom('PrivacyPrice')
      .selectAll()
      .where('priceId', '=', priceId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  async getPricesByPriceIdsInRange(
    priceIds: string[],
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<PrivacyPriceRecord[]> {
    if (priceIds.length === 0) return []

    const rows = await this.db
      .selectFrom('PrivacyPrice')
      .selectAll()
      .where('priceId', 'in', priceIds)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  async deleteByConfigs(
    configs: {
      configurationId: string
      fromInclusive: UnixTime
      toInclusive: UnixTime
    }[],
  ): Promise<number> {
    if (configs.length === 0) return 0

    let deleted = 0
    for (const config of configs) {
      const result = await this.db
        .deleteFrom('PrivacyPrice')
        .where('configurationId', '=', config.configurationId)
        .where('timestamp', '>=', UnixTime.toDate(config.fromInclusive))
        .where('timestamp', '<=', UnixTime.toDate(config.toInclusive))
        .executeTakeFirst()

      deleted += Number(result.numDeletedRows)
    }

    return deleted
  }

  async getAll(): Promise<PrivacyPriceRecord[]> {
    const rows = await this.db.selectFrom('PrivacyPrice').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('PrivacyPrice').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
