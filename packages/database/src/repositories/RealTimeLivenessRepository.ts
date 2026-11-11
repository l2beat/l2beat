import type { TrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { RealTimeLiveness } from '../kysely/generated/types'
import {
  insertGroupedKeepingEarliest,
  splitLivenessRecords,
} from './utils/livenessGrouping'

export interface RealTimeLivenessRecord {
  configurationId: TrackedTxId
  txHash: string
  timestamp: UnixTime
  blockNumber: number
  groupingKey?: string
}

export function toRecord(
  row: Selectable<RealTimeLiveness>,
): RealTimeLivenessRecord {
  return {
    ...row,
    groupingKey: row.groupingKey ?? undefined,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(
  record: RealTimeLivenessRecord,
): Insertable<RealTimeLiveness> {
  return {
    ...record,
    groupingKey: record.groupingKey ?? null,
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

    const { ungrouped, groupedEarliest } = splitLivenessRecords(records)

    await this.batch(ungrouped.map(toRow), 10_000, async (batch) => {
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
    await this.batch(groupedEarliest.map(toRow), 10_000, async (batch) => {
      await insertGroupedKeepingEarliest(this.db, 'RealTimeLiveness', batch)
    })
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('RealTimeLiveness')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getLatestRecords(
    configurationIds: string[],
  ): Promise<RealTimeLivenessRecord[]> {
    if (configurationIds.length === 0) return []

    const rows = await this.db
      .selectFrom((eb) =>
        eb
          .fn<{ configurationId: string }>('unnest', [
            eb.cast(eb.val(configurationIds), sql`text[]`),
          ])
          .as('configurationId'),
      )
      .innerJoinLateral(
        (eb) =>
          eb
            .selectFrom('RealTimeLiveness')
            .selectAll()
            .whereRef(
              'RealTimeLiveness.configurationId',
              '=',
              'configurationId.configurationId',
            )
            .orderBy('RealTimeLiveness.timestamp', 'desc')
            .limit(1)
            .as('rtl'),
        (join) => join.onTrue(),
      )
      .selectAll('rtl')
      .execute()

    return rows.map(toRecord)
  }
}
