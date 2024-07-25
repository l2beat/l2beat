import { BaseRepository } from '../../BaseRepository'
import { CurrentPriceRecord, toRecord, toRow } from './entity'
import { selectCurrentPrice } from './select'

export class CurrentPriceRepository extends BaseRepository {
  async getAll(): Promise<CurrentPriceRecord[]> {
    const rows = await this.db
      .selectFrom('public.CurrentPrice')
      .select(selectCurrentPrice)
      .execute()
    return rows.map(toRecord)
  }

  async findByCoingeckoId(
    coingeckoId: string,
  ): Promise<CurrentPriceRecord | undefined> {
    const row = await this.db
      .selectFrom('public.CurrentPrice')
      .select(selectCurrentPrice)
      .where('coingeckoId', '=', coingeckoId)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getByCoingeckoIds(
    coingeckoIds: string[],
  ): Promise<CurrentPriceRecord[]> {
    if (coingeckoIds.length === 0) {
      return []
    }

    const rows = await this.db
      .selectFrom('public.CurrentPrice')
      .select(selectCurrentPrice)
      .where('coingeckoId', 'in', coingeckoIds)
      .execute()
    return rows.map(toRecord)
  }

  async addOrUpdateMany(
    records: Omit<CurrentPriceRecord, 'updatedAt'>[],
  ): Promise<number> {
    const rows = records.map(toRow)
    await this.db
      .insertInto('public.CurrentPrice')
      .values(rows)
      .onConflict((oc) =>
        oc.column('coingeckoId').doUpdateSet((eb) => ({
          priceUsd: eb.ref('excluded.priceUsd'),
          updatedAt: eb.ref('excluded.updatedAt'),
        })),
      )
      .execute()
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.CurrentPrice')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
