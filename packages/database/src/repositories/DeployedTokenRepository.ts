import { BaseRepository } from '../BaseRepository'
import type { DeployedToken } from '../kysely/generated/types'
import {
  type AsInsertable,
  type AsSelectable,
  type AsUpdate,
  toRecord,
} from '../utils/typeUtils'

export type DeployedTokenInsertable = AsInsertable<DeployedToken>
export type DeployedTokenSelectable = AsSelectable<DeployedToken>
export type DeployedTokenUpdate = AsUpdate<DeployedToken, 'chain' | 'address'>
export type DeployedTokenPrimaryKey = Pick<DeployedToken, 'chain' | 'address'>

export class DeployedTokenRepository extends BaseRepository {
  async insert(record: DeployedTokenInsertable): Promise<void> {
    await this.db.insertInto('DeployedToken').values(record).execute()
  }

  async update(update: DeployedTokenUpdate): Promise<number> {
    const result = await this.db
      .updateTable('DeployedToken')
      .set(update)
      .where('chain', '=', update.chain)
      .where('address', '=', update.address)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async findByChainAndAddress(
    chain: string,
    address: string,
  ): Promise<DeployedTokenSelectable | undefined> {
    const result = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('chain', '=', chain)
      .where('address', '=', address)
      .executeTakeFirst()

    return result ? toRecord(result) : undefined
  }

  async getByAbstractTokenId(id: string): Promise<DeployedTokenSelectable[]> {
    const rows = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('abstractTokenId', '=', id)
      .execute()

    return rows.map(toRecord)
  }

  async getAll(): Promise<DeployedTokenSelectable[]> {
    const rows = await this.db.selectFrom('DeployedToken').selectAll().execute()
    return rows.map(toRecord)
  }

  async getByPrimaryKeys(
    keys: DeployedTokenPrimaryKey[],
  ): Promise<DeployedTokenSelectable[]> {
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
