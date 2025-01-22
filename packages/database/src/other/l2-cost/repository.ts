import type { TrackedTxId } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import { sql } from 'kysely'
import { BaseRepository } from '../../BaseRepository'
import { type L2CostRecord, toRecord, toRow } from './entity'
import { selectL2Cost } from './select'

export class L2CostRepository extends BaseRepository {
  async getAll() {
    const rows = await this.db.selectFrom('L2Cost').selectAll().execute()
    return rows.map(toRecord)
  }

  async insertMany(records: L2CostRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('L2Cost').values(batch).execute()
    })
    return rows.length
  }

  async getByTimeRange(timeRange: [UnixTime, UnixTime]) {
    const [from, to] = timeRange

    const rows = await this.db
      .selectFrom('L2Cost')
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<=', to.toDate())
      .select([...selectL2Cost.map((column) => `L2Cost.${column}` as const)])
      .distinctOn('txHash')
      .orderBy('txHash', 'asc')
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  async getGasSumByTimeRangeAndConfigId(
    configIds: string[],
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ) {
    const query = await this.db
      .selectFrom('L2Cost')
      .select((eb) => [
        'L2Cost.configurationId',
        eb.fn.sum(sql`"gasUsed" * "gasPrice"`).as('totalCostInWei'),
      ])
      .where('configurationId', 'in', configIds)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .groupBy('configurationId')
      .execute()

    return query.map((r) => ({
      ...r,
      totalCostInWei: BigInt(r.totalCostInWei),
    }))
  }

  async deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('L2Cost')
      .where('configurationId', '=', id)
      .where('timestamp', '>=', deleteFromInclusive.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigInTimeRange(
    configId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('L2Cost')
      .where('configurationId', '=', configId)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  // #region Status page

  async getUsedConfigsIds(): Promise<string[]> {
    const rows = await this.db
      .selectFrom('L2Cost')
      .select(['configurationId'])
      .distinctOn('configurationId')
      .execute()
    return rows.map((row) => row.configurationId)
  }

  // #endregion

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('L2Cost').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
