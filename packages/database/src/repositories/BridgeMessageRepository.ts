import { UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../BaseRepository'
import type { Insertable, Selectable } from 'kysely'
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
  averageDuration: number
}

export class BridgeMessageRepository extends BaseRepository {
  async insertMany(records: BridgeMessageRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 10_000, async (batch) => {
      await this.db.insertInto('BridgeMessage').values(batch).execute()
    })
    return rows.length
  }

  async getAll(): Promise<BridgeMessageRecord[]> {
    const rows = await this.db.selectFrom('BridgeMessage').selectAll().execute()

    return rows.map(toRecord)
  }

  async getByType(type: string): Promise<BridgeMessageRecord[]> {
    const rows = await this.db
      .selectFrom('BridgeMessage')
      .where('type', '=', type)
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getStats(): Promise<BridgeMessageStatsRecord[]> {
    const rows = await this.db
      .selectFrom('BridgeMessage')
      .select((eb) => [
        'type',
        eb.fn.countAll().as('count'),
        eb.fn.avg('duration').as('averageDuration'),
      ])
      .groupBy('type')
      .execute()
    return rows.map((x) => ({
      type: x.type,
      count: Number(x.count),
      averageDuration: Number(x.averageDuration),
    }))
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
