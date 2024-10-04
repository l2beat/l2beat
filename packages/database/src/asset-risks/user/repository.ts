import { BaseRepository } from '../../BaseRepository'
import {
  AssetRisksUserRecord,
  UpsertableAssetRisksUserRecord,
  upsertableToRecord,
} from './entity'
import { selectAssetRisksUser } from './select'

export class AssetRisksUserRepository extends BaseRepository {
  async findUserById(id: string): Promise<AssetRisksUserRecord | undefined> {
    const result = await this.db
      .selectFrom('AssetRisksUser')
      .select(selectAssetRisksUser)
      .where('id', '=', id)
      .executeTakeFirst()
    return result
  }

  async findUserByAddress(
    address: string,
  ): Promise<AssetRisksUserRecord | undefined> {
    const result = await this.db
      .selectFrom('AssetRisksUser')
      .select(selectAssetRisksUser)
      .where('address', '=', address)
      .executeTakeFirst()
    return result
  }

  async update(
    id: string,
    updateable: Partial<AssetRisksUserRecord>,
  ): Promise<void> {
    await this.db
      .updateTable('AssetRisksUser')
      .set(updateable)
      .where('id', '=', id)
      .execute()
  }

  async upsert(upsertable: UpsertableAssetRisksUserRecord): Promise<void> {
    await this.db
      .insertInto('AssetRisksUser')
      .values(upsertableToRecord(upsertable))
      .onConflict((oc) =>
        oc
          .column('address')
          .doUpdateSet((eb) => ({
            updatedAt: eb.ref('excluded.updatedAt'),
            tokensRefreshedAt: eb.ref('excluded.tokensRefreshedAt'),
            balancesRefreshedAt: eb.ref('excluded.balancesRefreshedAt'),
          })),
      )
      .execute()
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('AssetRisksUser')
      .executeTakeFirstOrThrow()
    return Number(result.numDeletedRows)
  }
}
