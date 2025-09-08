import type { TrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { L2Cost } from '../kysely/generated/types'

export interface L2CostRecord {
  timestamp: UnixTime
  txHash: string
  configurationId: TrackedTxId
  gasUsed: number
  gasPrice: bigint
  calldataLength: number
  calldataGasUsed: number
  blobGasUsed: number | null
  blobGasPrice: bigint | null
}

export function toRecord(row: Selectable<L2Cost>): L2CostRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    gasPrice: BigInt(row.gasPrice),
    blobGasPrice: row.blobGasPrice ? BigInt(row.blobGasPrice) : null,
  }
}

export function toRow(record: L2CostRecord): Insertable<L2Cost> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
    configurationId: record.configurationId.toString(),
    gasPrice: record.gasPrice.toString(),
    blobGasPrice: record.blobGasPrice?.toString() ?? null,
  }
}

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
      .where('timestamp', '>=', UnixTime.toDate(from))
      .where('timestamp', '<=', UnixTime.toDate(to))
      .selectAll()
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
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
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
      .where('timestamp', '>=', UnixTime.toDate(deleteFromInclusive))
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
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
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
