import { PostgresDatabase } from '../kysely'
import { CurrentPrice, fromEntity, toEntity } from './entity'
import { selectCurrentPrice } from './select'

export class CurrentPriceRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async findMany() {
    const res = await this.db
      .selectFrom('CurrentPrice')
      .select(selectCurrentPrice)
      .execute()
    return res.map(fromEntity)
  }

  async findOneByAssetId(assetId: string) {
    const res = await this.db
      .selectFrom('CurrentPrice')
      .select(selectCurrentPrice)
      .where('assetId', '=', assetId)
      .limit(1)
      .executeTakeFirst()
    return res ? fromEntity(res) : null
  }

  async upsert(currentPrice: CurrentPrice) {
    const entity = toEntity(currentPrice)
    const { assetId, ...rest } = entity
    return this.db
      .insertInto('CurrentPrice')
      .values(entity)
      .onConflict((oc) => oc.columns(['assetId']).doUpdateSet(rest))
      .execute()
  }
}
