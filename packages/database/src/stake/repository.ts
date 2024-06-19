import { PostgresDatabase } from '../kysely'
import { Stake, fromEntity, toEntity } from './entity'
import { selectStake } from './select'

export class StakeRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async findMany() {
    const res = await this.db
      .selectFrom('public.Stake')
      .select(selectStake)
      .execute()
    return res.map(fromEntity)
  }

  async findOneById(id: string) {
    const res = await this.db
      .selectFrom('public.Stake')
      .select(selectStake)
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst()
    return res ? fromEntity(res) : null
  }

  async upsert(stake: Stake) {
    const entity = toEntity(stake)
    const { id, ...rest } = entity
    return this.db
      .insertInto('public.Stake')
      .values(entity)
      .onConflict((oc) => oc.columns(['id']).doUpdateSet(rest))
      .execute()
  }
}
