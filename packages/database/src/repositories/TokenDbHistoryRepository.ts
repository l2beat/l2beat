import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TokenDbHistoryEntry } from '../kysely/generated/types'

export type TokenDbHistorySource = 'manual' | 'ingestion'

export interface TokenDbHistoryEntryRecord {
  id: string
  timestamp: UnixTime
  source: TokenDbHistorySource
  userEmail: string | null
  commandType: string
  command: unknown
}

export type TokenDbHistoryEntryInsert = Omit<TokenDbHistoryEntryRecord, 'id'>

function toRecord(
  row: Selectable<TokenDbHistoryEntry>,
): TokenDbHistoryEntryRecord {
  return {
    id: row.id,
    timestamp: UnixTime.fromDate(row.timestamp),
    source: row.source as TokenDbHistorySource,
    userEmail: row.userEmail,
    commandType: row.commandType,
    command: row.command,
  }
}

function toRow(
  record: TokenDbHistoryEntryInsert,
): Insertable<TokenDbHistoryEntry> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    source: record.source,
    userEmail: record.userEmail,
    commandType: record.commandType,
    command: toJsonSafe(record.command),
  }
}

function toJsonSafe(value: unknown): unknown {
  return JSON.parse(
    JSON.stringify(value, (_key, v) =>
      typeof v === 'bigint' ? v.toString() : v,
    ),
  )
}

export class TokenDbHistoryRepository extends BaseRepository {
  async insert(record: TokenDbHistoryEntryInsert): Promise<void> {
    await this.db
      .insertInto('TokenDbHistoryEntry')
      .values(toRow(record))
      .execute()
  }

  async getRecent(limit: number): Promise<TokenDbHistoryEntryRecord[]> {
    const rows = await this.db
      .selectFrom('TokenDbHistoryEntry')
      .selectAll()
      .orderBy('timestamp', 'desc')
      .orderBy('id', 'desc')
      .limit(limit)
      .execute()

    return rows.map(toRecord)
  }

  async getAll(): Promise<TokenDbHistoryEntryRecord[]> {
    const rows = await this.db
      .selectFrom('TokenDbHistoryEntry')
      .selectAll()
      .orderBy('timestamp', 'asc')
      .orderBy('id', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('TokenDbHistoryEntry')
      .executeTakeFirst()

    return Number(result.numDeletedRows)
  }
}
