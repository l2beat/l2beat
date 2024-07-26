import { BaseRepository } from '../../BaseRepository'
import { UpsertableCurrentPrice, toRecord, toRow } from './entity'
import { selectCurrentPrice } from './select'

export class CurrentPriceRepository extends BaseRepository {
  async findMany() {
    const res = await this.db
      .selectFrom('public.CurrentPrice')
      .select(selectCurrentPrice)
      .execute()
    return res.map(toRecord)
  }

  async findOneByAssetId(coingeckoId: string) {
    const res = await this.db
      .selectFrom('public.CurrentPrice')
      .select(selectCurrentPrice)
      .where('coingeckoId', '=', coingeckoId)
      .limit(1)
      .executeTakeFirst()
    return res ? toRecord(res) : null
  }

  async findByIds(coingeckoIds: string[]) {
    if (coingeckoIds.length === 0) {
      return []
    }

    const res = await this.db
      .selectFrom('public.CurrentPrice')
      .select(selectCurrentPrice)
      .where('coingeckoId', 'in', coingeckoIds)
      .execute()
    return res.map(toRecord)
  }

  async upsert(currentPrice: UpsertableCurrentPrice) {
    const entity = toRow(currentPrice)
    const { coingeckoId, ...rest } = entity
    return this.db
      .insertInto('public.CurrentPrice')
      .values(entity)
      .onConflict((oc) => oc.column('coingeckoId').doUpdateSet(rest))
      .execute()
  }

  async upsertMany(currentPrices: UpsertableCurrentPrice[]) {
    const entities = currentPrices.map(toRow)
    return this.db
      .insertInto('public.CurrentPrice')
      .values(entities)
      .onConflict((oc) =>
        oc.column('coingeckoId').doUpdateSet((eb) => ({
          priceUsd: eb.ref('excluded.priceUsd'),
          updatedAt: eb.ref('excluded.updatedAt'),
        })),
      )
      .execute()
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.CurrentPrice')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
