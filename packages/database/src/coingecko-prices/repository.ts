import { PostgresDatabase } from '../kysely'
import { CoingeckoPrice, fromEntity, toEntity } from './entity'
import { selectCoingeckoPrice } from './select'

export class CoingeckoPrices {
  constructor(private readonly db: PostgresDatabase) {}

  async findMany() {
    const res = await this.db
      .selectFrom('coingecko_prices')
      .select(selectCoingeckoPrice)
      .execute()
    return res.map(fromEntity)
  }

  async findOneByAssetId(assetId: string) {
    const res = await this.db
      .selectFrom('coingecko_prices')
      .select(selectCoingeckoPrice)
      .where('asset_id', '=', assetId)
      .limit(1)
      .executeTakeFirst()
    return res ? fromEntity(res) : null
  }

  async upsert(stake: CoingeckoPrice) {
    const entity = toEntity(stake)
    const { asset_id, ...rest } = entity
    return this.db
      .insertInto('coingecko_prices')
      .values(entity)
      .onConflict((oc) => oc.columns(['asset_id']).doUpdateSet(rest))
      .execute()
  }
}
