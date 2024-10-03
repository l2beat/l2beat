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

  async upsert(
    upsertable: UpsertableAssetRisksUserRecord,
  ): Promise<{ id: string }> {
    const result = await this.db
      .insertInto('AssetRisksUser')
      .values(upsertableToRecord(upsertable))
      .onConflict((oc) =>
        oc
          .column('address')
          .doUpdateSet((eb) => ({ updatedAt: eb.ref('excluded.updatedAt') })),
      )
      .returning('id')
      .executeTakeFirstOrThrow()
    return result
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('AssetRisksUser')
      .executeTakeFirstOrThrow()
    return Number(result.numDeletedRows)
  }
}
