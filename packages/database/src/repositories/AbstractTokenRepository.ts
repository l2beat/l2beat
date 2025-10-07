import { assert } from '@l2beat/shared-pure'
import { BaseRepository } from '../BaseRepository'
import type { AbstractToken } from '../kysely/generated/types'
import {
  type AsInsertable,
  type AsSelectable,
  type AsUpdate,
  toRecord,
} from '../utils/typeUtils'

export type AbstractTokenInsertable = AsInsertable<AbstractToken>
export type AbstractTokenSelectable = AsSelectable<AbstractToken>
export type AbstractTokenUpdate = AsUpdate<AbstractToken, 'id'>

export class AbstractTokenRepository extends BaseRepository {
  async insert(record: AbstractTokenInsertable): Promise<string> {
    const row = await this.db
      .insertInto('AbstractToken')
      .values(record)
      .returning('id')
      .executeTakeFirst()

    assert(row)
    return row.id
  }

  async update(update: AbstractTokenUpdate): Promise<number> {
    const result = await this.db
      .updateTable('AbstractToken')
      .set(update)
      .where('id', '=', update.id)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async findById(id: string): Promise<AbstractTokenSelectable | undefined> {
    const result = await this.db
      .selectFrom('AbstractToken')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    return result ? toRecord(result) : undefined
  }

  async findByIssuerAndSymbol(
    issuer: string,
    symbol: string,
  ): Promise<AbstractTokenSelectable | undefined> {
    const result = await this.db
      .selectFrom('AbstractToken')
      .selectAll()
      .where('issuer', '=', issuer)
      .where('symbol', '=', symbol)
      .executeTakeFirst()

    return result ? toRecord(result) : undefined
  }

  async getByIds(ids: string[]): Promise<AbstractTokenSelectable[]> {
    const rows = await this.db
      .selectFrom('AbstractToken')
      .selectAll()
      .where('id', 'in', ids)
      .execute()

    return rows.map(toRecord)
  }

  async getAll(): Promise<AbstractTokenSelectable[]> {
    const rows = await this.db.selectFrom('AbstractToken').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteByIds(ids: string[]): Promise<number> {
    const result = await this.db
      .deleteFrom('AbstractToken')
      .where('id', 'in', ids)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<bigint> {
    const result = await this.db.deleteFrom('AbstractToken').executeTakeFirst()
    return result.numDeletedRows
  }
}
