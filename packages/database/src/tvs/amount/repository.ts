import { assert, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { type TvsAmountRecord, toRecord, toRow } from './entity'

export class TvsAmountRepository extends BaseRepository {
  async insertMany(records: TvsAmountRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('TvsAmount').values(batch).execute()
    })
    return rows.length
  }

  async getAmounts(configurationIds: string[], timestamps: UnixTime[]) {
    const from = timestamps[0]
    const to = timestamps[timestamps.length - 1]
    assert(from && to, 'Timestamps should not be empty')

    const rows = await this.db
      .selectFrom('TvsAmount')
      .select(['timestamp', 'configurationId', 'project', 'amount'])
      .where('configurationId', 'in', configurationIds)
      .where('timestamp', '>=', UnixTime.toDate(from))
      .where('timestamp', '<=', UnixTime.toDate(to))
      .execute()

    const records = rows.map(toRecord)

    const result = new Map(
      timestamps.map((t) => [t, new Map<string, bigint>()]),
    )

    for (const r of records) {
      result.get(r.timestamp)?.set(r.configurationId, r.amount)
    }

    return result
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
}
