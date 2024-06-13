import { PostgresDatabase } from '../kysely'
import { Stake, fromEntity, toEntity } from './entity'
import { selectStake } from './select'

export class StakeRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async findMany() {
    const res = await this.db.selectFrom('Stake').select(selectStake).execute()
    return res.map(fromEntity)
  }

  async findOneByChainId(chainId: number) {
    const res = await this.db
      .selectFrom('Stake')
      .select(selectStake)
      .where('chainId', '=', chainId)
      .limit(1)
      .executeTakeFirst()
    return res ? fromEntity(res) : null
  }

  async upsert(stake: Stake) {
    const entity = toEntity(stake)
    const { chainId, ...rest } = entity
    return this.db
      .insertInto('Stake')
      .values(entity)
      .onConflict((oc) => oc.columns(['chainId']).doUpdateSet(rest))
      .execute()
  }
}
