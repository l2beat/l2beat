import type { TrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { RealTimeLiveness } from '../kysely/generated/types'

export interface RealTimeLivenessRecord {
  configurationId: TrackedTxId
  txHash: string
  timestamp: UnixTime
  blockNumber: number
}

export function toRecord(
  row: Selectable<RealTimeLiveness>,
): RealTimeLivenessRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(
  record: RealTimeLivenessRecord,
): Insertable<RealTimeLiveness> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export class RealTimeLivenessRepository extends BaseRepository {
  async getAll(): Promise<RealTimeLivenessRecord[]> {
    const rows = await this.db
      .selectFrom('RealTimeLiveness')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async upsertMany(records: RealTimeLivenessRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db
        .insertInto('RealTimeLiveness')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['configurationId', 'txHash']).doUpdateSet((eb) => ({
            timestamp: eb.ref('excluded.timestamp'),
            blockNumber: eb.ref('excluded.blockNumber'),
          })),
        )
        .execute()
    })
    return rows.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('RealTimeLiveness')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getLatestRecords(): Promise<RealTimeLivenessRecord[]> {
    const subQuery = this.db
      .selectFrom('RealTimeLiveness')
      .select([
        'configurationId',
        this.db.fn.max('timestamp').as('maxTimestamp'),
      ])
      .groupBy('configurationId')

    const rows = await this.db
      .selectFrom('RealTimeLiveness as rtl')
      .innerJoin(subQuery.as('latest'), (join) =>
        join
          .onRef('rtl.configurationId', '=', 'latest.configurationId')
          .onRef('rtl.timestamp', '=', 'latest.maxTimestamp'),
      )
      .selectAll('rtl')
      .execute()

    return rows.map(toRecord)
  }
}
