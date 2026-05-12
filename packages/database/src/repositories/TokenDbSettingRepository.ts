import type { Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TokenDbSetting } from '../kysely/generated/types'

export interface TokenDbSettingRecord {
  key: string
  value: string
}

function toRecord(row: Selectable<TokenDbSetting>): TokenDbSettingRecord {
  return {
    key: row.key,
    value: row.value,
  }
}

export class TokenDbSettingRepository extends BaseRepository {
  async get(key: string): Promise<TokenDbSettingRecord | undefined> {
    const row = await this.db
      .selectFrom('TokenDbSetting')
      .selectAll()
      .where('key', '=', key)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async set(record: TokenDbSettingRecord): Promise<void> {
    const now = new Date()
    await this.db
      .insertInto('TokenDbSetting')
      .values({ ...record, updatedAt: now })
      .onConflict((cb) =>
        cb.column('key').doUpdateSet({
          value: record.value,
          updatedAt: now,
        }),
      )
      .execute()
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TokenDbSetting').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
