import { assert } from '@l2beat/shared-pure'
import type { Selectable, Updateable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AbstractToken } from '../kysely/generated/types'

// Drops optional/undefined from a given set of fields
type WithPrimaryKey<T, K extends keyof T> = {
  [P in K]-?: Exclude<T[P], undefined>
} & {
  [P in Exclude<keyof T, K>]: T[P]
}

type ReplaceNulls<T> = {
  [K in keyof T]: null extends T[K] ? Exclude<T[K], null> | undefined : T[K]
}

// Combines Selectable with ReplaceNulls
type AsRecord<T> = Selectable<ReplaceNulls<T>>

// Combines WithPrimaryKey with Updateable
type AsUpdateable<T, K extends keyof Updateable<T>> = WithPrimaryKey<
  Updateable<T>,
  K
>

export type AbstractTokenRecord = AsRecord<AbstractToken>
export type AbstractTokenUpdate = AsUpdateable<AbstractToken, 'id'>

function toRecord<T extends object>(obj: T): ReplaceNulls<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : v]),
  ) as ReplaceNulls<T>
}

export class AbstractTokenRepository extends BaseRepository {
  async insert(record: AbstractTokenRecord): Promise<string> {
    const row = await this.db
      .insertInto('AbstractToken')
      .values(record)
      .returning('id')
      .executeTakeFirst()

    assert(row)
    return row.id
  }

  async update(id: string, update: AbstractTokenUpdate): Promise<bigint> {
    const result = await this.db
      .updateTable('AbstractToken')
      .set(update)
      .where('id', '=', update.id)
      .executeTakeFirst()

    return result.numUpdatedRows
  }

  async findById(id: string): Promise<AbstractTokenRecord | undefined> {
    const result = await this.db
      .selectFrom('AbstractToken')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    return result ? toRecord(result) : undefined
  }

  async getByIds(ids: string[]): Promise<AbstractTokenRecord[]> {
    const rows = await this.db
      .selectFrom('AbstractToken')
      .selectAll()
      .where('id', 'in', ids)
      .execute()

    return rows.map(toRecord)
  }

  async getAll(): Promise<AbstractTokenRecord[]> {
    const rows = await this.db.selectFrom('AbstractToken').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteByIds(ids: string[]): Promise<bigint> {
    const result = await this.db
      .deleteFrom('AbstractToken')
      .where('id', 'in', ids)
      .executeTakeFirst()

    return result.numDeletedRows
  }

  async deleteAll(): Promise<bigint> {
    const result = await this.db.deleteFrom('AbstractToken').executeTakeFirst()
    return result.numDeletedRows
  }
}
