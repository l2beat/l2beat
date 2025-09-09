import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TvsAmount } from '../kysely/generated/types'

export interface TvsAmountRecord {
  timestamp: UnixTime
  configurationId: string
  amount: bigint
}

export function toRecord(row: Selectable<TvsAmount>): TvsAmountRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    amount: BigInt(row.amount),
  }
}

export function toRow(record: TvsAmountRecord): Insertable<TvsAmount> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
    amount: record.amount.toString(),
  }
}

export class TvsAmountRepository extends BaseRepository {
  async insertMany(records: TvsAmountRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('TvsAmount').values(batch).execute()
    })
    return rows.length
  }

  async getAmount(
    configurationId: string,
    timestamp: UnixTime,
  ): Promise<TvsAmountRecord | undefined> {
    const row = await this.db
      .selectFrom('TvsAmount')
      .select(['timestamp', 'configurationId', 'amount'])
      .where('configurationId', '=', configurationId)
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getAmountsInRange(
    configurationIds: string[],
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<TvsAmountRecord[]> {
    const rows = await this.db
      .selectFrom('TvsAmount')
      .select(['timestamp', 'configurationId', 'amount'])
      .where('configurationId', 'in', configurationIds)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .execute()

    return rows.map(toRecord)
  }

  async getLatestAmountBefore(
    configurationId: string,
    timestamp: UnixTime,
  ): Promise<TvsAmountRecord | undefined> {
    const row = await this.db
      .selectFrom('TvsAmount')
      .select(['timestamp', 'configurationId', 'amount'])
      .where('configurationId', '=', configurationId)
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .orderBy('timestamp', 'desc')
      .limit(1)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('TvsAmount')
      .where('configurationId', '=', configId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<TvsAmountRecord[]> {
    const rows = await this.db
      .selectFrom('TvsAmount')
      .select(['timestamp', 'configurationId', 'amount'])
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TvsAmount').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
