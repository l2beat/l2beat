import type { Selectable, Updateable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { DeployedToken } from '../kysely/generated/types'

export type DeployedTokenRecord = Selectable<DeployedToken>
export type DeployedTokenUpdateable = Omit<
  Updateable<DeployedToken>,
  'chain' | 'address'
>
export type DeployedTokenPrimaryKey = Pick<DeployedToken, 'chain' | 'address'>

export class DeployedTokenRepository extends BaseRepository {
  async insert(record: DeployedTokenRecord): Promise<void> {
    await this.db.insertInto('DeployedToken').values(record).execute()
  }

  async updateByChainAndAddress(
    pk: DeployedTokenPrimaryKey,
    patch: DeployedTokenUpdateable,
  ): Promise<number> {
    const result = await this.db
      .updateTable('DeployedToken')
      .set(patch)
      .where('chain', '=', pk.chain)
      .where('address', '=', pk.address)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async findByChainAndAddress(
    pk: DeployedTokenPrimaryKey,
  ): Promise<DeployedTokenRecord | undefined> {
    return await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('chain', '=', pk.chain)
      .where('address', '=', pk.address)
      .executeTakeFirst()
  }

  async getByAbstractTokenId(id: string): Promise<DeployedTokenRecord[]> {
    return await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('abstractTokenId', '=', id)
      .execute()
  }

  async getAll(): Promise<DeployedTokenRecord[]> {
    return await this.db.selectFrom('DeployedToken').selectAll().execute()
  }

  async getByPrimaryKeys(
    keys: DeployedTokenPrimaryKey[],
  ): Promise<DeployedTokenRecord[]> {
    if (keys.length === 0) {
      return []
    }

    return await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where((eb) =>
        eb.or(
          keys.map((key) =>
            eb.and([
              eb('chain', '=', key.chain),
              eb('address', '=', key.address),
            ]),
          ),
        ),
      )
      .execute()
  }

  async deleteByPrimaryKeys(keys: DeployedTokenPrimaryKey[]): Promise<number> {
    if (keys.length === 0) {
      return 0
    }

    const result = await this.db
      .deleteFrom('DeployedToken')
      .where((eb) =>
        eb.or(
          keys.map((key) =>
            eb.and([
              eb('chain', '=', key.chain),
              eb('address', '=', key.address),
            ]),
          ),
        ),
      )
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<bigint> {
    const result = await this.db.deleteFrom('DeployedToken').executeTakeFirst()
    return result.numDeletedRows
  }
}
