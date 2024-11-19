import { BaseRepository } from '../../BaseRepository'
import {
  InsightUserRecord,
  UpsertableInsightUserRecord,
  upsertableToRecord,
} from './entity'
import { selectInsightUser } from './select'

export class InsightUserRepository extends BaseRepository {
  async findUserById(id: string): Promise<InsightUserRecord | undefined> {
    const result = await this.db
      .selectFrom('InsightUser')
      .select(selectInsightUser)
      .where('id', '=', id)
      .executeTakeFirst()
    return result
  }

  async findUserByAddress(
    address: string,
  ): Promise<InsightUserRecord | undefined> {
    const result = await this.db
      .selectFrom('InsightUser')
      .select(selectInsightUser)
      .where('address', 'ilike', address)
      .executeTakeFirst()
    return result
  }

  async getAll(): Promise<InsightUserRecord[]> {
    const result = await this.db
      .selectFrom('InsightUser')
      .select(selectInsightUser)
      .execute()
    return result
  }

  async update(
    id: string,
    updateable: Partial<InsightUserRecord>,
  ): Promise<void> {
    await this.db
      .updateTable('InsightUser')
      .set(updateable)
      .where('id', '=', id)
      .execute()
  }

  async upsert(upsertable: UpsertableInsightUserRecord): Promise<void> {
    await this.db
      .insertInto('InsightUser')
      .values(upsertableToRecord(upsertable))
      .onConflict((oc) =>
        oc.column('address').doUpdateSet((eb) => ({
          updatedAt: eb.ref('excluded.updatedAt'),
          tokensRefreshedAt: eb.ref('excluded.tokensRefreshedAt'),
          balancesRefreshedAt: eb.ref('excluded.balancesRefreshedAt'),
        })),
      )
      .execute()
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('InsightUser')
      .executeTakeFirstOrThrow()
    return Number(result.numDeletedRows)
  }
}
