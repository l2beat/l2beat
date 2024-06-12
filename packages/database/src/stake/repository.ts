import { PostgresDatabase } from '../kysely'
import { Stake, fromEntity, toEntity } from './entity'
import { selectStake } from './select'

export class StakeRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async findMany() {
    const res = await this.db.selectFrom('stake').select(selectStake).execute()
    return res.map(fromEntity)
  }

  async findOneByChainId(chainId: number) {
    const res = await this.db
      .selectFrom('stake')
      .select(selectStake)
      .where('chain_id', '=', chainId)
      .limit(1)
      .executeTakeFirst()
    return res ? fromEntity(res) : null
  }

  async upsert(stake: Stake) {
    const entity = toEntity(stake)
    const { chain_id, ...rest } = entity
    return this.db
      .insertInto('stake')
      .values(entity)
      .onConflict((oc) => oc.columns(['chain_id']).doUpdateSet(rest))
      .execute()
  }
}
