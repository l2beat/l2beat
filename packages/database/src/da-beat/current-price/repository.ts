import { BaseRepository } from '../../BaseRepository'
import { type CurrentPriceRecord, toRecord, toRow } from './entity'

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

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('CurrentPrice').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
