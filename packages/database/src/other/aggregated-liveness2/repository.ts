import { type TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type AggregatedLiveness2Record, toRecord, toRow } from './entity'
import { selectAggregatedLiveness2 } from './select'
import { sql } from 'kysely'

export class AggregatedLiveness2Repository extends BaseRepository {
  async upsertMany(records: AggregatedLiveness2Record[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('AggregatedLiveness2')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns(['projectId', 'subtype', 'timestamp'])
            .doUpdateSet((eb) => ({
              min: eb.ref('excluded.min'),
              avg: eb.ref('excluded.avg'),
              max: eb.ref('excluded.max'),
              numberOfRecords: eb.ref('excluded.numberOfRecords'),
            })),
        )
        .execute()
    })
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedLiveness2')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<AggregatedLiveness2Record[]> {
    const rows = await this.db
      .selectFrom('AggregatedLiveness2')
      .select(selectAggregatedLiveness2)
      .execute()
    return rows.map(toRecord)
  }

  async getAggregatesByTimeRange(
    range: [UnixTime, UnixTime],
  ): Promise<
    Omit<AggregatedLiveness2Record, 'timestamp' | 'numberOfRecords'>[]
  > {
    const [from, to] = range

    const rows = await this.db
      .selectFrom('AggregatedLiveness2')
      .select([
        'projectId',
        'subtype',
        (eb) => eb.fn.min('min').as('min'),
        (eb) =>
          sql<number>`
            SUM(${eb.ref('avg')} * ${eb.ref('numberOfRecords')})
            / SUM(${eb.ref('numberOfRecords')})
          `.as('avg'),
        (eb) => eb.fn.max('max').as('max'),
      ])
      .where('timestamp', '>=', UnixTime.toDate(from))
      .where('timestamp', '<=', UnixTime.toDate(to))
      .groupBy(['projectId', 'subtype'])
      .execute()

    return rows.map((row) => ({
      ...row,
      subtype: row.subtype as TrackedTxsConfigSubtype,
      avg: Number(row.avg),
    }))
  }
}
