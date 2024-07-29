import { TrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { L2CostRecord, toRecord, toRow } from './entity'
import { selectL2Cost } from './select'

export class L2CostRepository extends BaseRepository {
  async getAll() {
    const rows = await this.db
      .selectFrom('public.l2_costs')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async insertMany(records: L2CostRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('public.l2_costs').values(batch).execute()
    })
    return rows.length
  }

  async getByTimeRange(timeRange: [UnixTime, UnixTime]) {
    const [from, to] = timeRange

    const rows = await this.db
      .selectFrom('public.l2_costs')
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<=', to.toDate())
      .select([
        ...selectL2Cost.map((column) => `public.l2_costs.${column}` as const),
      ])
      .distinctOn('tx_hash')
      .orderBy('tx_hash', 'asc')
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  async deleteFromById(
    id: TrackedTxId,
    deleteFromInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('public.l2_costs')
      .where('configuration_id', '=', id)
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
      .deleteFrom('public.l2_costs')
      .where('configuration_id', '=', configId)
      .where('timestamp', '>=', fromInclusive.toDate())
      .where('timestamp', '<=', toInclusive.toDate())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  // #region Status page

  async getUsedConfigsIds(): Promise<string[]> {
    const rows = await this.db
      .selectFrom('public.l2_costs')
      .select(['configuration_id'])
      .distinctOn('configuration_id')
      .execute()
    return rows.map((row) => row.configuration_id)
  }

  // #endregion

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.l2_costs')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
