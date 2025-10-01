import { assert, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AbstractToken } from '../kysely/generated/types'

export interface AbstractTokenRecord {
  id: string
  issuer: string | undefined
  symbol: string
  category: string
  iconUrl: string | undefined
  coingeckoId: string | undefined
  coingeckoListingTimestamp: UnixTime | undefined
  comment: string | undefined
}

export function toRecord(row: Selectable<AbstractToken>): AbstractTokenRecord {
  return {
    id: row.id,
    issuer: row.issuer ?? undefined,
    symbol: row.symbol,
    category: row.category,
    iconUrl: row.iconUrl ?? undefined,
    coingeckoId: row.coingeckoId ?? undefined,
    coingeckoListingTimestamp:
      row.coingeckoListingTimestamp !== null
        ? UnixTime.fromDate(row.coingeckoListingTimestamp)
        : undefined,
    comment: row.comment ?? undefined,
  }
}

export function toRow(record: AbstractTokenRecord): Insertable<AbstractToken> {
  return {
    id: record.id,
    issuer: record.issuer,
    symbol: record.symbol,
    category: record.category,
    iconUrl: record.iconUrl,
    coingeckoId: record.coingeckoId,
    coingeckoListingTimestamp:
      record.coingeckoListingTimestamp !== undefined
        ? UnixTime.toDate(record.coingeckoListingTimestamp)
        : null,
    comment: record.comment,
  }
}

export class AbstractTokenRepository extends BaseRepository {
  async insert(record: AbstractTokenRecord): Promise<string> {
    const [row] = await this.db
      .insertInto('AbstractToken')
      .values(toRow(record))
      .returning('id')
      .execute()

    assert(row)
    return row?.id
  }

  async findById(id: string): Promise<AbstractTokenRecord | undefined> {
    const row = await this.db
      .selectFrom('AbstractToken')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getByIds(ids: string[]): Promise<AbstractTokenRecord[]> {
    if (ids.length === 0) return []

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

  async deleteByIds(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0

    const result = await this.db
      .deleteFrom('AbstractToken')
      .where('id', 'in', ids)
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('AbstractToken').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
