import { PostgresDatabase } from '../kysely'
import { UpsertableCurrentPrice, fromEntity, toEntity } from './entity'
import { selectCurrentPrice } from './select'

export class CurrentPriceRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async findMany() {
    const res = await this.db
      .selectFrom('public.CurrentPrice')
      .select(selectCurrentPrice)
      .execute()
    return res.map(fromEntity)
  }

  async findOneByAssetId(coingeckoId: string) {
    const res = await this.db
      .selectFrom('public.CurrentPrice')
      .select(selectCurrentPrice)
      .where('coingeckoId', '=', coingeckoId)
      .limit(1)
      .executeTakeFirst()
    return res ? fromEntity(res) : null
  }

  async upsert(currentPrice: UpsertableCurrentPrice) {
    const entity = toEntity(currentPrice)
    const { coingeckoId, ...rest } = entity
    return this.db
      .insertInto('public.CurrentPrice')
      .values(entity)
      .onConflict((oc) => oc.column('coingeckoId').doUpdateSet(rest))
      .execute()
  }

  async upsertMany(currentPrices: UpsertableCurrentPrice[]) {
    const entities = currentPrices.map(toEntity)
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
}
