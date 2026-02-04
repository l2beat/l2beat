import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AggregatedInteropToken } from '../kysely/generated/types'

export interface AggregatedInteropTokenRecord {
  timestamp: UnixTime
  id: string
  bridgeType: InteropBridgeType
  srcChain: string
  dstChain: string
  abstractTokenId: string
  transferCount: number
  totalDurationSum: number
  volume: number
}

export function toRecord(
  row: Selectable<AggregatedInteropToken>,
): AggregatedInteropTokenRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    id: row.id,
    bridgeType: row.bridgeType as InteropBridgeType,
    srcChain: row.srcChain ?? undefined,
    dstChain: row.dstChain ?? undefined,
    abstractTokenId: row.abstractTokenId,
    transferCount: row.transferCount,
    totalDurationSum: row.totalDurationSum,
    volume: row.volume,
  }
}

export function toRow(
  record: AggregatedInteropTokenRecord,
): Insertable<AggregatedInteropToken> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    id: record.id,
    bridgeType: record.bridgeType,
    srcChain: record.srcChain,
    dstChain: record.dstChain,
    abstractTokenId: record.abstractTokenId,
    transferCount: record.transferCount,
    totalDurationSum: record.totalDurationSum,
    volume: record.volume,
  }
}

export class AggregatedInteropTokenRepository extends BaseRepository {
  async insertMany(records: AggregatedInteropTokenRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('AggregatedInteropToken').values(batch).execute()
    })
    return rows.length
  }

  async getAll(): Promise<AggregatedInteropTokenRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedInteropToken')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getByChainsTimestampAndId(
    timestamp: UnixTime,
    srcChains: string[],
    dstChains: string[],
    type?: InteropBridgeType,
  ): Promise<AggregatedInteropTokenRecord[]> {
    if (srcChains.length === 0 || dstChains.length === 0) {
      return []
    }

    let query = this.db
      .selectFrom('AggregatedInteropToken')
      .selectAll()
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .where('srcChain', 'in', srcChains)
      .where('dstChain', 'in', dstChains)

    if (type) {
      query = query.where('bridgeType', '=', type)
    }

    const rows = await query.execute()
    return rows.map(toRecord)
  }

  async deleteAllButEarliestPerDayBefore(timestamp: UnixTime): Promise<number> {
    const query = this.db
      .with('earliest_timestamp_by_day', (eb) =>
        eb
          .selectFrom('AggregatedInteropToken')
          .select((eb) => eb.fn.min('timestamp').as('min_timestamp'))
          .groupBy(sql`date_trunc('day', timestamp)`),
      )
      .deleteFrom('AggregatedInteropToken')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .where('timestamp', 'not in', (eb) =>
        eb.selectFrom('earliest_timestamp_by_day').select('min_timestamp'),
      )

    const result = await query.executeTakeFirst()

    return Number(result.numDeletedRows)
  }

  async deleteByTimestamp(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedInteropToken')
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedInteropToken')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
