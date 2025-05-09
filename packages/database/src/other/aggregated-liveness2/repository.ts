import { type TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { sql } from 'kysely'
import { BaseRepository } from '../../BaseRepository'
import { type AggregatedLivenessRecord, toRecord, toRow } from './entity'
import { selectAggregatedLiveness } from './select'

export class AggregatedLiveness2Repository extends BaseRepository {
  async upsertMany(records: AggregatedLivenessRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('AggregatedLiveness')
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
      .deleteFrom('AggregatedLiveness')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<AggregatedLivenessRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedLiveness')
      .select(selectAggregatedLiveness)
      .execute()
    return rows.map(toRecord)
  }

  async getAggregatesByTimeRange(
    range: [UnixTime | null, UnixTime],
  ): Promise<
    Omit<AggregatedLivenessRecord, 'timestamp' | 'numberOfRecords'>[]
  > {
    const [from, to] = range

    let query = this.db
      .selectFrom('AggregatedLiveness')
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
      .where('timestamp', '<=', UnixTime.toDate(to))
      .groupBy(['projectId', 'subtype'])

    if (from) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    const rows = await query.execute()

    return rows.map((row) => ({
      ...row,
      subtype: row.subtype as TrackedTxsConfigSubtype,
      avg: Number(row.avg),
    }))
  }
}
