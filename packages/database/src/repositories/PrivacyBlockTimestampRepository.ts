import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { PrivacyBlockTimestamp } from '../kysely/generated/types'

export interface PrivacyBlockTimestampRecord {
  timestamp: UnixTime
  configurationId: string
  chain: string
  blockNumber: number
}

export function toRecord(
  row: Selectable<PrivacyBlockTimestamp>,
): PrivacyBlockTimestampRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(
  record: PrivacyBlockTimestampRecord,
): Insertable<PrivacyBlockTimestamp> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export class PrivacyBlockTimestampRepository extends BaseRepository {
  async upsertMany(records: PrivacyBlockTimestampRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('PrivacyBlockTimestamp')
        .values(batch)
        .onConflict((oc) =>
          oc.columns(['timestamp', 'configurationId']).doUpdateSet((eb) => ({
            blockNumber: eb.ref('excluded.blockNumber'),
          })),
        )
        .execute()
    })
    return rows.length
  }

  async findBlockNumberByChainAndTimestamp(
    chain: string,
    timestamp: UnixTime,
  ): Promise<number | undefined> {
    const row = await this.db
      .selectFrom('PrivacyBlockTimestamp')
      .select('blockNumber')
      .where('chain', '=', chain)
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .limit(1)
      .executeTakeFirst()
    return row?.blockNumber
  }

  async deleteByConfigIds(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0
    const result = await this.db
      .deleteFrom('PrivacyBlockTimestamp')
      .where('configurationId', 'in', ids)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('PrivacyBlockTimestamp')
      .where('configurationId', '=', configId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
