import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { TvsEscrowValue } from '../kysely/generated/types'
import { atResolutionSteps } from '../utils/atResolutionSteps'
import {
  type CleanDateRange,
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from '../utils/deleteArchivedRecords'

export interface TvsEscrowValueRecord {
  timestamp: UnixTime
  /** TokenValue configurationId of the token the escrow belongs to. */
  configurationId: string
  projectId: string
  tokenId: string
  chain: string
  escrowAddress: string
  amount: number
  value: number
}

export function toRecord(
  row: Selectable<TvsEscrowValue>,
): TvsEscrowValueRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(
  record: TvsEscrowValueRecord,
): Insertable<TvsEscrowValue> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export class TvsEscrowValueRepository extends BaseRepository {
  async upsertMany(records: TvsEscrowValueRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('TvsEscrowValue')
        .values(batch)
        .onConflict((oc) =>
          oc
            .columns(['timestamp', 'configurationId', 'chain', 'escrowAddress'])
            .doUpdateSet((eb) => ({
              amount: eb.ref('excluded.amount'),
              value: eb.ref('excluded.value'),
            })),
        )
        .execute()
    })
    return rows.length
  }

  async getByProjectAt(
    projectId: string,
    timestamps: UnixTime[],
  ): Promise<TvsEscrowValueRecord[]> {
    if (timestamps.length === 0) return []
    const rows = await this.db
      .selectFrom('TvsEscrowValue')
      .selectAll()
      .where('projectId', '=', projectId)
      .where('timestamp', 'in', timestamps.map(UnixTime.toDate))
      .execute()
    return rows.map(toRecord)
  }

  /**
   * Sums the value of a project's escrows on one chain at the rows a chart of
   * this `resolution` draws, see `atResolutionSteps`.
   */
  async getSummedByChainAtResolution(
    projectId: string,
    chain: string,
    [from, to]: [UnixTime | null, UnixTime],
    resolution: 'hour' | 'six hours' | 'day',
  ): Promise<{ timestamp: UnixTime; value: number }[]> {
    let query = this.db
      .selectFrom('TvsEscrowValue')
      .select((eb) => [
        'timestamp',
        eb.cast(eb.fn.sum('value'), 'double precision').as('value'),
      ])
      .where('projectId', '=', projectId)
      .where('chain', '=', chain)
      .where('timestamp', '<=', UnixTime.toDate(to))
      .where(atResolutionSteps('timestamp', to, resolution))
      .groupBy('timestamp')

    if (from) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    const rows = await query.execute()

    return rows.map((row) => ({
      timestamp: UnixTime.fromDate(row.timestamp),
      value: Number(row.value),
    }))
  }

  async deleteByConfigIds(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0
    const result = await this.db
      .deleteFrom('TvsEscrowValue')
      .where('configurationId', 'in', ids)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByConfigInTimeRange(
    configurationId: string,
    fromInclusive: UnixTime,
    toInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('TvsEscrowValue')
      .where('configurationId', '=', configurationId)
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .where('timestamp', '<=', UnixTime.toDate(toInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return await deleteHourlyUntil(this.db, 'TvsEscrowValue', dateRange)
  }

  async deleteSixHourlyUntil(dateRange: CleanDateRange): Promise<number> {
    return await deleteSixHourlyUntil(this.db, 'TvsEscrowValue', dateRange)
  }

  async getAll(): Promise<TvsEscrowValueRecord[]> {
    const rows = await this.db
      .selectFrom('TvsEscrowValue')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('TvsEscrowValue').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
