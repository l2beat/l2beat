import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TvsBlockTimestamp } from '../kysely/generated/types'

export interface TvsBlockTimestampRecord {
  timestamp: UnixTime
  configurationId: string
  chain: string
  blockNumber: number
}

export function toRecord(
  row: Selectable<TvsBlockTimestamp>,
): TvsBlockTimestampRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(
  record: TvsBlockTimestampRecord,
): Insertable<TvsBlockTimestamp> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export class TvsBlockTimestampRepository extends BaseRepository {
  async insertMany(records: TvsBlockTimestampRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('TvsBlockTimestamp').values(batch).execute()
    })
    return rows.length
  }

  async findBlockNumberByChainAndTimestamp(
    chain: string,
    timestamp: UnixTime,
  ): Promise<number | undefined> {
    const row = await this.db
      .selectFrom('TvsBlockTimestamp')
      .select('blockNumber')
      .where('chain', '=', chain)
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .limit(1)
      .executeTakeFirst()
    return row?.blockNumber
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('TvsBlockTimestamp')
      .where('configurationId', '=', configId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<TvsBlockTimestampRecord[]> {
    const rows = await this.db
      .selectFrom('TvsBlockTimestamp')
      .select(['timestamp', 'configurationId', 'chain', 'blockNumber'])
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('TvsBlockTimestamp')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
