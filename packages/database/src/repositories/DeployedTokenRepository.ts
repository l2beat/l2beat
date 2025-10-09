import { BaseRepository } from '../BaseRepository'
import type { DeployedToken } from '../kysely/generated/types'
import { type AsPatch, type AsSelectable, toRecord } from '../utils/typeUtils'

export type DeployedTokenRecord = AsSelectable<DeployedToken>
export type DeployedTokenPatch = AsPatch<DeployedToken, 'chain' | 'address'>
export type DeployedTokenPrimaryKey = Pick<DeployedToken, 'chain' | 'address'>

export class DeployedTokenRepository extends BaseRepository {
  async insert(record: DeployedTokenRecord): Promise<void> {
    await this.db.insertInto('DeployedToken').values(record).execute()
  }

  async updateByChainAndAddress(
    pk: DeployedTokenPrimaryKey,
    patch: DeployedTokenPatch,
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
    chain: string,
    address: string,
  ): Promise<DeployedTokenRecord | undefined> {
    const result = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('chain', '=', chain)
      .where('address', '=', address)
      .executeTakeFirst()

    return result ? toRecord(result) : undefined
  }

  async getByAbstractTokenId(id: string): Promise<DeployedTokenRecord[]> {
    const rows = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('abstractTokenId', '=', id)
      .execute()

    return rows.map(toRecord)
  }

  async getAll(): Promise<DeployedTokenRecord[]> {
    const rows = await this.db.selectFrom('DeployedToken').selectAll().execute()
    return rows.map(toRecord)
  }

  async getByPrimaryKeys(
    keys: DeployedTokenPrimaryKey[],
  ): Promise<DeployedTokenRecord[]> {
    if (keys.length === 0) {
      return []
    }

    const rows = await this.db
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

    return rows.map(toRecord)
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
