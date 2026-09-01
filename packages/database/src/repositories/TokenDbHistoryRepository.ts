import { UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TokenDbHistory } from '../kysely/generated/types'
import { escapeLikePattern } from '../utils/escapeLikePattern'
import { toJsonSafe } from '../utils/toJsonSafe'

export type TokenDbHistorySource = 'manual' | 'ingestion'

export interface TokenDbHistoryEntryRecord {
  id: string
  timestamp: UnixTime
  source: TokenDbHistorySource
  userEmail: string | null
  commandType: string
  command: unknown
  intent: unknown | null
  ingestionLog: string | null
}

export type TokenDbHistoryEntryInsert = Omit<TokenDbHistoryEntryRecord, 'id'>

export interface TokenDbHistoryPage {
  entries: TokenDbHistoryEntryRecord[]
  totalCount: number
}

function toRecord(row: Selectable<TokenDbHistory>): TokenDbHistoryEntryRecord {
  return {
    id: row.id,
    timestamp: UnixTime.fromDate(row.timestamp),
    source: row.source as TokenDbHistorySource,
    userEmail: row.userEmail,
    commandType: row.commandType,
    command: row.command,
    intent: row.intent,
    ingestionLog: row.ingestionLog,
  }
}

function toRow(record: TokenDbHistoryEntryInsert): Insertable<TokenDbHistory> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    source: record.source,
    userEmail: record.userEmail,
    commandType: record.commandType,
    command: toJsonSafe(record.command),
    intent: toJsonSafe(record.intent),
    ingestionLog: record.ingestionLog,
  }
}

export class TokenDbHistoryRepository extends BaseRepository {
  async insert(record: TokenDbHistoryEntryInsert): Promise<void> {
    await this.db.insertInto('TokenDbHistory').values(toRow(record)).execute()
  }

  async getRecent(limit: number): Promise<TokenDbHistoryEntryRecord[]> {
    const rows = await this.db
      .selectFrom('TokenDbHistory')
      .selectAll()
      .orderBy('timestamp', 'desc')
      .orderBy('id', 'desc')
      .limit(limit)
      .execute()

    return rows.map(toRecord)
  }

  async getPage(options: {
    offset: number
    limit: number
    search?: string
  }): Promise<TokenDbHistoryPage> {
    const search = options.search?.trim()
    const pattern = search ? `%${escapeLikePattern(search)}%` : undefined

    let rowsQuery = this.db
      .selectFrom('TokenDbHistory')
      .selectAll()
      .orderBy('timestamp', 'desc')
      .orderBy('id', 'desc')
      .offset(options.offset)
      .limit(options.limit)

    let countQuery = this.db
      .selectFrom('TokenDbHistory')
      .select((eb) => eb.fn.countAll<number>().as('count'))

    if (pattern) {
      rowsQuery = rowsQuery.where(
        sql<boolean>`"command"::text ILIKE ${pattern} OR "intent"::text ILIKE ${pattern}`,
      )
      countQuery = countQuery.where(
        sql<boolean>`"command"::text ILIKE ${pattern} OR "intent"::text ILIKE ${pattern}`,
      )
    }

    const rows = await rowsQuery.execute()
    const count = await countQuery.executeTakeFirstOrThrow()

    return {
      entries: rows.map(toRecord),
      totalCount: Number(count.count),
    }
  }

  async getAll(): Promise<TokenDbHistoryEntryRecord[]> {
    const rows = await this.db
      .selectFrom('TokenDbHistory')
      .selectAll()
      .orderBy('timestamp', 'asc')
      .orderBy('id', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TokenDbHistory').executeTakeFirst()

    return Number(result.numDeletedRows)
  }
}
