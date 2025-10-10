import { assert, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable, Updateable } from 'kysely'
import isNil from 'lodash/isNil'
import { BaseRepository } from '../BaseRepository'
import type { AbstractToken } from '../kysely/generated/types'

export type AbstractTokenRecord = {
  symbol: string
  id: string
  issuer: string | null
  category: 'btc' | 'ether' | 'stablecoin' | 'other'
  iconUrl: string | null
  coingeckoId: string | null
  coingeckoListingTimestamp: UnixTime | null
  comment: string | null
  reviewed: boolean
}

export type AbstractTokenUpdateable = Omit<
  Updateable<AbstractTokenRecord>,
  'id'
>

function toRecord(row: Selectable<AbstractToken>): AbstractTokenRecord {
  return {
    ...row,
    category: row.category as 'btc' | 'ether' | 'stablecoin' | 'other',
    coingeckoListingTimestamp: row.coingeckoListingTimestamp
      ? UnixTime.fromDate(row.coingeckoListingTimestamp)
      : null,
  }
}

function toRow(record: AbstractTokenRecord): Insertable<AbstractToken> {
  return {
    ...record,
    coingeckoListingTimestamp: record.coingeckoListingTimestamp
      ? UnixTime.toDate(record.coingeckoListingTimestamp)
      : null,
  }
}

function toUpdateRow(
  record: AbstractTokenUpdateable,
): Updateable<AbstractToken> {
  return {
    ...record,
    coingeckoListingTimestamp: isNil(record.coingeckoListingTimestamp)
      ? record.coingeckoListingTimestamp
      : UnixTime.toDate(record.coingeckoListingTimestamp),
  }
}

export class AbstractTokenRepository extends BaseRepository {
  async insert(record: AbstractTokenRecord): Promise<string> {
    const row = await this.db
      .insertInto('AbstractToken')
      .values(toRow(record))
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
      .set(toUpdateRow(patch))
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

    return result ? toRecord(result) : undefined
  }

  async findByIssuerAndSymbol(
    issuer: string,
    symbol: string,
  ): Promise<AbstractTokenRecord | undefined> {
    const result = await this.db
      .selectFrom('AbstractToken')
      .selectAll()
      .where('issuer', '=', issuer)
      .where('symbol', '=', symbol)
      .executeTakeFirst()

    return result ? toRecord(result) : undefined
  }

  async getByIds(ids: string[]): Promise<AbstractTokenRecord[]> {
    const result = await this.db
      .selectFrom('AbstractToken')
      .selectAll()
      .where('id', 'in', ids)
      .execute()

    return result.map(toRecord)
  }

  async getAll(): Promise<AbstractTokenRecord[]> {
    const result = await this.db
      .selectFrom('AbstractToken')
      .selectAll()
      .execute()
    return result.map(toRecord)
  }

  async deleteById(id: string): Promise<number> {
    const result = await this.db
      .deleteFrom('AbstractToken')
      .where('id', '=', id)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
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
