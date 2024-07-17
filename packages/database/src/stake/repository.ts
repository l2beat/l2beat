import { PostgresDatabase } from '../kysely'
import { StakeRecord, toRecord, toRow } from './entity'
import { selectStake } from './select'

export class StakeRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async findMany() {
    const res = await this.db
      .selectFrom('public.Stake')
      .select(selectStake)
      .execute()
    return res.map(toRecord)
  }

  async findOneById(id: string) {
    const res = await this.db
      .selectFrom('public.Stake')
      .select(selectStake)
      .where('id', '=', id)
      .limit(1)
      .executeTakeFirst()
    return res ? toRecord(res) : null
  }

  async findByIds(ids: string[]) {
    const res = await this.db
      .selectFrom('public.Stake')
      .select(selectStake)
      .where('id', 'in', ids)
      .execute()
    return res.map(toRecord)
  }

  async upsert(stake: StakeRecord) {
    const entity = toRow(stake)
    const { id, ...rest } = entity
    return this.db
      .insertInto('public.Stake')
      .values(entity)
      .onConflict((oc) => oc.columns(['id']).doUpdateSet(rest))
      .execute()
  }

  deleteAll() {
    return this.db.deleteFrom('public.Stake').execute()
  }
}
