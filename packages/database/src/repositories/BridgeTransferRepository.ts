import { assert, UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropTransfer } from '../kysely/generated/types'

export interface BridgeTransferRecord {
  plugin: string
  messageId: string
  type: string
  duration: number | undefined
  timestamp: UnixTime
  srcTime: UnixTime | undefined
  srcChain: string | undefined
  srcTxHash: string | undefined
  srcLogIndex: number | undefined
  srcEventId: string | undefined
  srcTokenAddress: string | undefined
  srcRawAmount: string | undefined
  srcAbstractTokenId: string | undefined
  srcSymbol: string | undefined
  srcAmount: number | undefined
  srcPrice: number | undefined
  srcValueUsd: number | undefined
  dstTime: UnixTime | undefined
  dstChain: string | undefined
  dstTxHash: string | undefined
  dstLogIndex: number | undefined
  dstEventId: string | undefined
  dstTokenAddress: string | undefined
  dstRawAmount: string | undefined
  dstAbstractTokenId: string | undefined
  dstSymbol: string | undefined
  dstAmount: number | undefined
  dstPrice: number | undefined
  dstValueUsd: number | undefined
  isProcessed: boolean
}

export interface BridgeTransferUpdate {
  srcAbstractTokenId?: string
  srcPrice?: number
  srcAmount?: number
  srcValueUsd?: number
  dstAbstractTokenId?: string
  dstPrice?: number
  dstAmount?: number
  dstValueUsd?: number
}

export function toRecord(
  row: Selectable<InteropTransfer>,
): BridgeTransferRecord {
  return {
    plugin: row.plugin,
    messageId: row.transferId,
    type: row.type,
    duration: row.duration ?? undefined,
    timestamp: UnixTime.fromDate(row.timestamp),
    srcTime: row.srcTime !== null ? UnixTime.fromDate(row.srcTime) : undefined,
    srcChain: row.srcChain ?? undefined,
    srcTxHash: row.srcTxHash ?? undefined,
    srcLogIndex: row.srcLogIndex ?? undefined,
    srcEventId: row.srcEventId ?? undefined,
    srcTokenAddress: row.srcTokenAddress ?? undefined,
    srcRawAmount: row.srcRawAmount ?? undefined,
    srcAbstractTokenId: row.srcAbstractTokenId ?? undefined,
    srcSymbol: undefined,
    srcAmount: row.srcAmount ?? undefined,
    srcPrice: row.srcPrice ?? undefined,
    srcValueUsd: row.srcValueUsd ?? undefined,
    dstTime: row.dstTime !== null ? UnixTime.fromDate(row.dstTime) : undefined,
    dstChain: row.dstChain ?? undefined,
    dstTxHash: row.dstTxHash ?? undefined,
    dstLogIndex: row.dstLogIndex ?? undefined,
    dstEventId: row.dstEventId ?? undefined,
    dstTokenAddress: row.dstTokenAddress ?? undefined,
    dstRawAmount: row.dstRawAmount ?? undefined,
    dstAbstractTokenId: row.dstAbstractTokenId ?? undefined,
    dstSymbol: undefined,
    dstAmount: row.dstAmount ?? undefined,
    dstPrice: row.dstPrice ?? undefined,
    dstValueUsd: row.dstValueUsd ?? undefined,
    isProcessed: row.isProcessed,
  }
}

export function toRow(
  record: BridgeTransferRecord,
): Insertable<InteropTransfer> {
  return {
    plugin: record.plugin,
    transferId: record.messageId,
    type: record.type,
    duration: record.duration,
    timestamp: UnixTime.toDate(record.timestamp),
    srcTime:
      record.srcTime !== undefined ? UnixTime.toDate(record.srcTime) : null,
    srcChain: record.srcChain,
    srcTxHash: record.srcTxHash?.toLowerCase(),
    srcLogIndex: record.srcLogIndex,
    srcEventId: record.srcEventId,
    srcTokenAddress: record.srcTokenAddress,
    srcRawAmount: record.srcRawAmount,
    srcAbstractTokenId: record.srcAbstractTokenId,
    srcAmount: record.srcAmount,
    srcPrice: record.srcPrice,
    srcValueUsd: record.srcValueUsd,
    dstTime:
      record.dstTime !== undefined ? UnixTime.toDate(record.dstTime) : null,
    dstChain: record.dstChain,
    dstTxHash: record.dstTxHash?.toLowerCase(),
    dstLogIndex: record.dstLogIndex,
    dstEventId: record.dstEventId,
    dstTokenAddress: record.dstTokenAddress,
    dstRawAmount: record.dstRawAmount,
    dstAbstractTokenId: record.dstAbstractTokenId,
    dstAmount: record.dstAmount,
    dstPrice: record.dstPrice,
    dstValueUsd: record.dstValueUsd,
    isProcessed: record.isProcessed,
  }
}

export interface BridgeTransfersStatsRecord {
  type: string
  count: number
  medianDuration: number
  srcValueSum: number
  dstValueSum: number
}

export interface BridgeTransfersDetailedStatsRecord {
  type: string
  srcChain: string
  dstChain: string
  count: number
  medianDuration: number
  srcValueSum: number
  dstValueSum: number
}

export class BridgeTransferRepository extends BaseRepository {
  async insertMany(records: BridgeTransferRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('InteropTransfer').values(batch).execute()
    })
    return rows.length
  }

  async getAll(): Promise<BridgeTransferRecord[]> {
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getByType(
    type: string,
    options: {
      srcChain?: string
      dstChain?: string
    } = {},
  ): Promise<BridgeTransferRecord[]> {
    let query = this.db.selectFrom('InteropTransfer').where('type', '=', type)

    if (options.srcChain !== undefined) {
      query = query.where('srcChain', '=', options.srcChain)
    }

    if (options.dstChain !== undefined) {
      query = query.where('dstChain', '=', options.dstChain)
    }

    const rows = await query.orderBy('timestamp', 'desc').selectAll().execute()

    return rows.map(toRecord)
  }

  async getUnprocessed() {
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .where('isProcessed', '=', false)
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async updateFinancials(
    id: string,
    update: BridgeTransferUpdate,
  ): Promise<void> {
    await this.db
      .updateTable('InteropTransfer')
      .set({ ...update, isProcessed: true })
      .where('transferId', '=', id)
      .execute()
  }

  async getStats(): Promise<BridgeTransfersStatsRecord[]> {
    const overallStats = await this.db
      .selectFrom('InteropTransfer')
      .select((eb) => [
        'type',
        eb.fn.countAll().as('count'),
        sql<number>`percentile_cont(0.5) within group (order by duration)`.as(
          'medianDuration',
        ),
        eb.fn.sum('srcValueUsd').as('srcValueSum'),
        eb.fn.sum('dstValueUsd').as('dstValueSum'),
      ])
      .groupBy('type')
      .execute()

    return overallStats.map((overall) => ({
      type: overall.type,
      count: Number(overall.count),
      medianDuration: Number(overall.medianDuration),
      srcValueSum: Number(overall.srcValueSum),
      dstValueSum: Number(overall.dstValueSum),
    }))
  }

  async getDetailedStats(): Promise<BridgeTransfersDetailedStatsRecord[]> {
    const chainStats = await this.db
      .selectFrom('InteropTransfer')
      .select((eb) => [
        'type',
        'srcChain',
        'dstChain',
        eb.fn.countAll().as('count'),
        sql<number>`percentile_cont(0.5) within group (order by duration)`.as(
          'medianDuration',
        ),
        eb.fn.sum('srcValueUsd').as('srcValueSum'),
        eb.fn.sum('dstValueUsd').as('dstValueSum'),
      ])
      .where('srcChain', 'is not', null)
      .where('dstChain', 'is not', null)
      .groupBy(['type', 'srcChain', 'dstChain'])
      .execute()

    return chainStats.map((chain) => {
      assert(chain.srcChain && chain.dstChain)
      return {
        type: chain.type,
        srcChain: chain.srcChain,
        dstChain: chain.dstChain,
        count: Number(chain.count),
        medianDuration: Number(chain.medianDuration),
        srcValueSum: Number(chain.srcValueSum),
        dstValueSum: Number(chain.dstValueSum),
      }
    })
  }

  async getExistingItems(
    items: { srcTxHash: string; dstTxHash: string }[],
  ): Promise<BridgeTransferRecord[]> {
    if (items.length === 0) return []

    const srcHashes = items.map((x) => x.srcTxHash.toLowerCase())
    const dstHashes = items.map((x) => x.dstTxHash.toLowerCase())
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .selectAll()
      .where('srcTxHash', 'in', srcHashes)
      .where('dstTxHash', 'in', dstHashes)
      .execute()
    return rows.map(toRecord)
  }

  async deleteBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropTransfer')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropTransfer')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
