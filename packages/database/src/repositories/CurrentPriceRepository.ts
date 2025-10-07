import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { CurrentPrice } from '../kysely/generated/types'

export interface CurrentPriceRecord {
  coingeckoId: string
  priceUsd: number
  updatedAt: Date
}

export function toRecord(entity: Selectable<CurrentPrice>): CurrentPriceRecord {
  return entity
}

export function toRow(
  currentPrice: Omit<CurrentPriceRecord, 'updatedAt'>,
): Insertable<CurrentPrice> {
  return {
    ...currentPrice,
    updatedAt: new Date(),
  }
}

export class CurrentPriceRepository extends BaseRepository {
  async getAll(): Promise<CurrentPriceRecord[]> {
    const rows = await this.db.selectFrom('CurrentPrice').selectAll().execute()
    return rows.map(toRecord)
  }

  async findByCoingeckoId(
    coingeckoId: string,
  ): Promise<CurrentPriceRecord | undefined> {
    const row = await this.db
      .selectFrom('CurrentPrice')
      .selectAll()
      .where('coingeckoId', '=', coingeckoId)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getByCoingeckoIds(
    coingeckoIds: string[],
  ): Promise<CurrentPriceRecord[]> {
    if (coingeckoIds.length === 0) return []

    const rows = await this.db
      .selectFrom('CurrentPrice')
      .selectAll()
      .where('coingeckoId', 'in', coingeckoIds)
      .execute()
    return rows.map(toRecord)
  }

  async upsertMany(
    records: Omit<CurrentPriceRecord, 'updatedAt'>[],
  ): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.db
      .insertInto('CurrentPrice')
      .values(rows)
      .onConflict((oc) =>
        oc.column('coingeckoId').doUpdateSet((eb) => ({
          priceUsd: eb.ref('excluded.priceUsd'),
          updatedAt: eb.ref('excluded.updatedAt'),
        })),
      )
      .executeTakeFirst()
    return records.length
  }

  async deleteByCoingeckoIds(coingeckoIds: string[]): Promise<number> {
    if (coingeckoIds.length === 0) return 0

    const result = await this.db
      .deleteFrom('CurrentPrice')
      .where('coingeckoId', 'in', coingeckoIds)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('CurrentPrice').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
