import { assert, type TokenCategory, type UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable, Updateable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AbstractToken } from '../kysely/generated/types'
import { fromTimestamp, toTimestamp } from '../utils/timestamp'

export type AbstractTokenRecord = {
  symbol: string
  id: string
  issuer: string | null
  category: TokenCategory | null
  iconUrl: string | null
  coingeckoId: string | null
  coingeckoListingTimestamp: UnixTime | null
  additionalCoingeckoEntries: CoingeckoEntry[] | null
  comment: string | null
  reviewed: boolean
  isPriceUnreliable: boolean
}

export type CoingeckoEntry = {
  coingeckoId: string
  coingeckoListingTimestamp: UnixTime | null
  iconUrl: string | null
}

export type AbstractTokenUpdateable = Omit<
  Updateable<AbstractTokenRecord>,
  'id'
>

function toRecord(row: Selectable<AbstractToken>): AbstractTokenRecord {
  return {
    id: row.id,
    symbol: row.symbol,
    issuer: row.issuer,
    iconUrl: row.iconUrl,
    comment: row.comment,
    reviewed: row.reviewed,
    isPriceUnreliable: row.isPriceUnreliable,
    coingeckoId: row.coingeckoId,
    additionalCoingeckoEntries:
      row.additionalCoingeckoEntries === undefined
        ? null
        : (row.additionalCoingeckoEntries as CoingeckoEntry[] | null),

    coingeckoListingTimestamp: toTimestamp(row.coingeckoListingTimestamp),
    category: row.category as TokenCategory | null,
  }
}
export { toRecord as toAbstractTokenRecord }

function toRow(record: AbstractTokenRecord): Insertable<AbstractToken> {
  return {
    id: record.id,
    symbol: record.symbol,
    issuer: record.issuer,
    iconUrl: record.iconUrl,
    comment: record.comment,
    reviewed: record.reviewed,
    isPriceUnreliable: record.isPriceUnreliable,
    category: record.category,
    coingeckoId: record.coingeckoId,
    additionalCoingeckoEntries:
      record.additionalCoingeckoEntries !== null
        ? JSON.stringify(record.additionalCoingeckoEntries)
        : null,

    coingeckoListingTimestamp: fromTimestamp(record.coingeckoListingTimestamp),
  }
}

function toUpdateRow(
  record: AbstractTokenUpdateable,
): Updateable<AbstractToken> {
  return {
    ...record,
    coingeckoListingTimestamp: fromTimestamp(record.coingeckoListingTimestamp),
    additionalCoingeckoEntries:
      record.additionalCoingeckoEntries !== undefined
        ? record.additionalCoingeckoEntries !== null
          ? JSON.stringify(record.additionalCoingeckoEntries)
          : null
        : undefined,
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

  async findByCoingeckoId(
    coingeckoId: string,
  ): Promise<AbstractTokenRecord | undefined> {
    const result = await this.db
      .selectFrom('AbstractToken')
      .selectAll()
      .where((eb) =>
        eb.or([
          eb('coingeckoId', '=', coingeckoId),
          sql<boolean>`"additionalCoingeckoEntries" @> ${JSON.stringify([{ coingeckoId }])}::jsonb`,
        ]),
      )
      .executeTakeFirst()

    return result ? toRecord(result) : undefined
  }

  async getByIds(
    ids: string[],
  ): Promise<
    Pick<
      AbstractTokenRecord,
      'id' | 'symbol' | 'iconUrl' | 'issuer' | 'category'
    >[]
  > {
    if (ids.length === 0) return []

    const result = await this.db
      .selectFrom('AbstractToken')
      .select(['id', 'symbol', 'iconUrl', 'issuer', 'category'])
      .where('id', 'in', ids)
      .execute()

    return result.map((row) => ({
      ...row,
      category: row.category as AbstractTokenRecord['category'],
    }))
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
