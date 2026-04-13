import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TokenFactInput } from '../kysely/generated/types'

export interface TokenFactInputRecord {
  id: number
  name: string
  arguments: string
  context: unknown | null
}

function toRecord(row: Selectable<TokenFactInput>): TokenFactInputRecord {
  return {
    id: row.id,
    name: row.name,
    arguments: row.arguments,
    context: row.context ?? null,
  }
}

function toRow(
  record: Omit<TokenFactInputRecord, 'id'>,
): Insertable<TokenFactInput> {
  return {
    name: record.name,
    arguments: record.arguments,
    context: record.context === null ? null : JSON.stringify(record.context),
  }
}

export class TokenFactInputRepository extends BaseRepository {
  async insert(record: Omit<TokenFactInputRecord, 'id'>): Promise<void> {
    await this.db.insertInto('TokenFactInput').values(toRow(record)).execute()
  }

  async insertMany(records: Omit<TokenFactInputRecord, 'id'>[]): Promise<void> {
    if (records.length === 0) return
    await this.batch(records, 1000, async (batch) => {
      await this.db
        .insertInto('TokenFactInput')
        .values(batch.map(toRow))
        .execute()
    })
  }

  async getAll(): Promise<TokenFactInputRecord[]> {
    const rows = await this.db
      .selectFrom('TokenFactInput')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async getByName(name: string): Promise<TokenFactInputRecord[]> {
    const rows = await this.db
      .selectFrom('TokenFactInput')
      .selectAll()
      .where('name', '=', name)
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TokenFactInput').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
