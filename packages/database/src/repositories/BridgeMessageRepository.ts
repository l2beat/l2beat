import { assert, UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { BridgeMessage } from '../kysely/generated/types'

export interface BridgeMessageRecord {
  messageId: string
  type: string
  duration: number | undefined
  timestamp: UnixTime
  srcTime: UnixTime | undefined
  srcChain: string | undefined
  srcTxHash: string | undefined
  srcLogIndex: number | undefined
  srcEventId: string | undefined
  dstTime: UnixTime | undefined
  dstChain: string | undefined
  dstTxHash: string | undefined
  dstLogIndex: number | undefined
  dstEventId: string | undefined
}

export function toRecord(row: Selectable<BridgeMessage>): BridgeMessageRecord {
  return {
    messageId: row.messageId,
    type: row.type,
    duration: row.duration ?? undefined,
    timestamp: UnixTime.fromDate(row.timestamp),
    srcTime: row.srcTime !== null ? UnixTime.fromDate(row.srcTime) : undefined,
    srcChain: row.srcChain ?? undefined,
    srcTxHash: row.srcTxHash ?? undefined,
    srcLogIndex: row.srcLogIndex ?? undefined,
    srcEventId: row.srcEventId ?? undefined,
    dstTime: row.dstTime !== null ? UnixTime.fromDate(row.dstTime) : undefined,
    dstChain: row.dstChain ?? undefined,
    dstTxHash: row.dstTxHash ?? undefined,
    dstLogIndex: row.dstLogIndex ?? undefined,
    dstEventId: row.dstEventId ?? undefined,
  }
}

export function toRow(record: BridgeMessageRecord): Insertable<BridgeMessage> {
  return {
    messageId: record.messageId,
    type: record.type,
    duration: record.duration,
    timestamp: UnixTime.toDate(record.timestamp),
    srcTime:
      record.srcTime !== undefined ? UnixTime.toDate(record.srcTime) : null,
    srcChain: record.srcChain,
    srcTxHash: record.srcTxHash,
    srcLogIndex: record.srcLogIndex,
    srcEventId: record.srcEventId,
    dstTime:
      record.dstTime !== undefined ? UnixTime.toDate(record.dstTime) : null,
    dstChain: record.dstChain,
    dstTxHash: record.dstTxHash,
    dstLogIndex: record.dstLogIndex,
    dstEventId: record.dstEventId,
  }
}

export interface BridgeMessageStatsRecord {
  type: string
  count: number
  medianDuration: number
}

export interface BridgeMessageDetailedStatsRecord {
  type: string
  sourceChain: string
  destinationChain: string
  count: number
  medianDuration: number
}

export class BridgeMessageRepository extends BaseRepository {
  async insertMany(records: BridgeMessageRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 2_000, async (batch) => {
      await this.db.insertInto('BridgeMessage').values(batch).execute()
    })
    return rows.length
  }

  async getAll(): Promise<BridgeMessageRecord[]> {
    const rows = await this.db.selectFrom('BridgeMessage').selectAll().execute()

    return rows.map(toRecord)
  }

  async getByType(
    type: string,
    options: {
      srcChain?: string
      dstChain?: string
    } = {},
  ): Promise<BridgeMessageRecord[]> {
    let query = this.db.selectFrom('BridgeMessage').where('type', '=', type)

    if (options.srcChain !== undefined) {
      query = query.where('srcChain', '=', options.srcChain)
    }

    if (options.dstChain !== undefined) {
      query = query.where('dstChain', '=', options.dstChain)
    }

    const rows = await query.orderBy('timestamp', 'desc').selectAll().execute()

    return rows.map(toRecord)
  }

  async getStats(): Promise<BridgeMessageStatsRecord[]> {
    const overallStats = await this.db
      .selectFrom('BridgeMessage')
      .select((eb) => [
        'type',
        eb.fn.countAll().as('count'),
        sql<number>`percentile_cont(0.5) within group (order by duration)`.as(
          'medianDuration',
        ),
      ])
      .groupBy('type')
      .execute()

    return overallStats.map((overall) => ({
      type: overall.type,
      count: Number(overall.count),
      medianDuration: Number(overall.medianDuration),
    }))
  }

  async getExistingItems(
    items: {
      srcTxHash: string
      dstTxHash: string
    }[],
  ): Promise<BridgeMessageRecord[]> {
    if (items.length === 0) return []

    let query = this.db.selectFrom('BridgeMessage').selectAll()

    query = query.where((eb) => {
      const conditions = items.map((item) => {
        return eb.and([
          eb(eb.fn('lower', ['srcTxHash']), '=', item.srcTxHash.toLowerCase()),
          eb(eb.fn('lower', ['dstTxHash']), '=', item.dstTxHash.toLowerCase()),
        ])
      })

      return eb.or(conditions)
    })

    const rows = await query.execute()
    return rows.map(toRecord)
  }

  async getDetailedStats(): Promise<BridgeMessageDetailedStatsRecord[]> {
    const chainStats = await this.db
      .selectFrom('BridgeMessage')
      .select((eb) => [
        'type',
        'srcChain',
        'dstChain',
        eb.fn.countAll().as('count'),
        sql<number>`percentile_cont(0.5) within group (order by duration)`.as(
          'medianDuration',
        ),
      ])
      .where('srcChain', 'is not', null)
      .where('dstChain', 'is not', null)
      .groupBy(['type', 'srcChain', 'dstChain'])
      .execute()

    return chainStats.map((chain) => {
      assert(chain.srcChain && chain.dstChain)
      return {
        type: chain.type,
        sourceChain: chain.srcChain,
        destinationChain: chain.dstChain,
        count: Number(chain.count),
        medianDuration: Number(chain.medianDuration),
      }
    })
  }

  async deleteBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('BridgeMessage')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('BridgeMessage').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
