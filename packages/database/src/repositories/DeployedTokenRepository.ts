import { assert } from '@l2beat/shared-pure'
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
export type DeployedTokenUpdate = AsUpdate<DeployedToken, 'id'>

export class DeployedTokenRepository extends BaseRepository {
  async insert(record: DeployedTokenInsertable): Promise<number> {
    const row = await this.db
      .insertInto('DeployedToken')
      .values(record)
      .returning('id')
      .executeTakeFirst()

    assert(row)
    return row.id
  }

  async update(update: DeployedTokenUpdate): Promise<number> {
    const result = await this.db
      .updateTable('DeployedToken')
      .set(update)
      .where('id', '=', update.id)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async findById(id: number): Promise<DeployedTokenSelectable | undefined> {
    const result = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    return result ? toRecord(result) : undefined
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

  async getByIds(ids: number[]): Promise<DeployedTokenInsertable[]> {
    const rows = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('id', 'in', ids)
      .execute()

    return rows.map(toRecord)
  }

  async getByAbstractTokenId(id: string): Promise<DeployedTokenInsertable[]> {
    const rows = await this.db
      .selectFrom('DeployedToken')
      .selectAll()
      .where('abstractTokenId', '=', id)
      .execute()

    return rows.map(toRecord)
  }

  async getAll(): Promise<DeployedTokenInsertable[]> {
    const rows = await this.db.selectFrom('DeployedToken').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteByIds(ids: number[]): Promise<number> {
    const result = await this.db
      .deleteFrom('DeployedToken')
      .where('id', 'in', ids)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<bigint> {
    const result = await this.db.deleteFrom('DeployedToken').executeTakeFirst()
    return result.numDeletedRows
  }
}
