import { assert } from '@l2beat/shared-pure'
import type { Insertable, Selectable, Updateable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AbstractToken } from '../kysely/generated/types'

export type AbstractTokenRecord = Selectable<AbstractToken>
export type AbstractTokenUpdateable = Omit<Updateable<AbstractToken>, 'id'>

export class AbstractTokenRepository extends BaseRepository {
  async insert(record: Insertable<AbstractToken>): Promise<string> {
    const row = await this.db
      .insertInto('AbstractToken')
      .values(record)
      .returning('id')
      .executeTakeFirst()

    assert(row)
    return row.id
  }

  async updateById(
    id: string,
    patch: AbstractTokenUpdateable,
  ): Promise<number> {
    const result = await this.db
      .updateTable('AbstractToken')
      .set(patch)
      .where('id', '=', id)
      .executeTakeFirst()

    return Number(result.numUpdatedRows)
  }

  async findById(id: string): Promise<AbstractTokenRecord | undefined> {
    const result = await this.db
      .selectFrom('AbstractToken')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    return result
  }

  async findByIssuerAndSymbol(
    issuer: string,
    symbol: string,
  ): Promise<AbstractTokenRecord | undefined> {
    return await this.db
      .selectFrom('AbstractToken')
      .selectAll()
      .where('issuer', '=', issuer)
      .where('symbol', '=', symbol)
      .executeTakeFirst()
  }

  async getByIds(ids: string[]): Promise<AbstractTokenRecord[]> {
    return await this.db
      .selectFrom('AbstractToken')
      .selectAll()
      .where('id', 'in', ids)
      .execute()
  }

  async getAll(): Promise<AbstractTokenRecord[]> {
    return await this.db.selectFrom('AbstractToken').selectAll().execute()
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
