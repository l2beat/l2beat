import type { TrackedTxId } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { Liveness } from '../kysely/generated/types'
import { keepEarliestLivenessRecords } from './utils/keepEarliestLivenessRecords'

export interface LivenessRecord {
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  configurationId: TrackedTxId
  eventId: string
}

export function toRecord(row: Selectable<Liveness>): LivenessRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(record: LivenessRecord): Insertable<Liveness> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export class LivenessRepository extends BaseRepository {
  async getAll(): Promise<LivenessRecord[]> {
    const rows = await this.db.selectFrom('Liveness').selectAll().execute()
    return rows.map(toRecord)
  }

  async getByConfigurationIdWithinTimeRange(
    configurationIds: string[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    if (configurationIds.length === 0) return []

    assert(from < to, 'From must be less than to')
    const rows = await this.db
      .selectFrom('Liveness')
      .selectAll()
      .where('configurationId', 'in', configurationIds)
      .where('timestamp', '>=', UnixTime.toDate(from))
      .where('timestamp', '<', UnixTime.toDate(to))
      .execute()
    return rows.map(toRecord)
  }

  async getRecordsInRangeWithLatestBefore(
    configurationIds: string[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    if (configurationIds.length === 0) return []

    assert(from < to, 'From must be less than to')

    // Get latest record before 'from' for each configuration
    const subquery = this.db
      .selectFrom('Liveness')
      .select(['configurationId'])
      .select(this.db.fn.max('timestamp').as('maxTimestamp'))
      .where('configurationId', 'in', configurationIds)
      .where('timestamp', '<', UnixTime.toDate(from))
      .groupBy(['configurationId'])
      .as('latest')

    const [latestBeforeFromRows, withinRangeRows] = await Promise.all([
      this.db
        .selectFrom('Liveness')
        .innerJoin(subquery, (join) =>
          join
            .onRef('Liveness.configurationId', '=', 'latest.configurationId')
            .onRef('Liveness.timestamp', '=', 'latest.maxTimestamp'),
        )
        .where('Liveness.configurationId', 'in', configurationIds)
        .selectAll('Liveness')
        .orderBy('timestamp', 'desc')
        .execute(),
      this.db
        .selectFrom('Liveness')
        .selectAll()
        .where('configurationId', 'in', configurationIds)
        .where('timestamp', '>=', UnixTime.toDate(from))
        .where('timestamp', '<', UnixTime.toDate(to))
        .execute(),
    ])

    return [...withinRangeRows, ...latestBeforeFromRows].map(toRecord)
  }

  async insertMany(records: LivenessRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = keepEarliestLivenessRecords(records).map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db
        .insertInto('Liveness')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns(['configurationId', 'eventId'])
            .doUpdateSet((eb) => ({
              timestamp: eb.ref('excluded.timestamp'),
              blockNumber: eb.ref('excluded.blockNumber'),
              txHash: eb.ref('excluded.txHash'),
            }))
            .where((eb) =>
              eb.or([
                eb(
                  eb.ref('excluded.timestamp'),
                  '<',
                  eb.ref('Liveness.timestamp'),
                ),
                eb.and([
                  eb(
                    eb.ref('excluded.timestamp'),
                    '=',
                    eb.ref('Liveness.timestamp'),
                  ),
                  eb(
                    eb.ref('excluded.blockNumber'),
                    '<',
                    eb.ref('Liveness.blockNumber'),
                  ),
                ]),
              ]),
            ),
        )
        .execute()
    })
    return rows.length
  }

  async deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('Liveness')
      .where('configurationId', '=', id.toString())
      .where('timestamp', '>=', UnixTime.toDate(deleteFromInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigIds(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0
    const result = await this.db
      .deleteFrom('Liveness')
      .where('configurationId', 'in', ids)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigInTimeRange(
    id: TrackedTxId,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('Liveness')
      .where('configurationId', '=', id)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Liveness').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getUsedConfigsIds(): Promise<string[]> {
    const rows = await this.db
      .selectFrom('Liveness')
      .select('configurationId')
      .distinctOn('configurationId')
      .execute()
    return rows.map((row) => row.configurationId)
  }

  async getLatestTimestampsByConfigId(): Promise<
    { configurationId: string; latestTimestamp: UnixTime }[]
  > {
    const rows = await this.db
      .selectFrom('Liveness')
      .select(['configurationId'])
      .select(this.db.fn.max('timestamp').as('latestTimestamp'))
      .groupBy('configurationId')
      .execute()

    return rows.flatMap((row) => {
      if (row.latestTimestamp === null) {
        return []
      }

      return {
        configurationId: row.configurationId,
        latestTimestamp: UnixTime.fromDate(row.latestTimestamp),
      }
    })
  }
}
