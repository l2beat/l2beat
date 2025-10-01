import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { BridgeTransfer } from '../kysely/generated/types'

export interface BridgeTransferRecord {
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
  dstSymbol: string | undefined
  dstAmount: number | undefined
  dstPrice: number | undefined
  dstValueUsd: number | undefined
}

export function toRecord(
  row: Selectable<BridgeTransfer>,
): BridgeTransferRecord {
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
    srcTokenAddress: row.srcTokenAddress
      ? row.srcTokenAddress === 'native'
        ? 'native'
        : EthereumAddress(row.srcTokenAddress)
      : undefined,
    srcRawAmount: row.srcRawAmount ?? undefined,
    srcSymbol: row.srcSymbol ?? undefined,
    srcAmount: row.srcAmount ?? undefined,
    srcPrice: row.srcPrice ?? undefined,
    srcValueUsd: row.srcValueUsd ?? undefined,
    dstTime: row.dstTime !== null ? UnixTime.fromDate(row.dstTime) : undefined,
    dstChain: row.dstChain ?? undefined,
    dstTxHash: row.dstTxHash ?? undefined,
    dstLogIndex: row.dstLogIndex ?? undefined,
    dstEventId: row.dstEventId ?? undefined,
    dstTokenAddress: row.dstTokenAddress
      ? row.dstTokenAddress === 'native'
        ? 'native'
        : EthereumAddress(row.dstTokenAddress)
      : undefined,
    dstRawAmount: row.dstRawAmount ?? undefined,
    dstSymbol: row.dstSymbol ?? undefined,
    dstAmount: row.dstAmount ?? undefined,
    dstPrice: row.dstPrice ?? undefined,
    dstValueUsd: row.dstValueUsd ?? undefined,
  }
}

export function toRow(
  record: BridgeTransferRecord,
): Insertable<BridgeTransfer> {
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
    srcTokenAddress: record.srcTokenAddress
      ? record.srcTokenAddress === 'native'
        ? 'native'
        : EthereumAddress(record.srcTokenAddress)
      : undefined,
    srcRawAmount: record.srcRawAmount,
    srcSymbol: record.srcSymbol,
    srcAmount: record.srcAmount,
    srcPrice: record.srcPrice,
    srcValueUsd: record.srcValueUsd,
    dstTime:
      record.dstTime !== undefined ? UnixTime.toDate(record.dstTime) : null,
    dstChain: record.dstChain,
    dstTxHash: record.dstTxHash,
    dstLogIndex: record.dstLogIndex,
    dstEventId: record.dstEventId,
    dstTokenAddress: record.dstTokenAddress
      ? record.dstTokenAddress === 'native'
        ? 'native'
        : EthereumAddress(record.dstTokenAddress)
      : undefined,
    dstRawAmount: record.dstRawAmount,
    dstSymbol: record.dstSymbol,
    dstAmount: record.dstAmount,
    dstPrice: record.dstPrice,
    dstValueUsd: record.dstValueUsd,
  }
}

export interface BridgeTransfersStatsRecord {
  type: string
  count: number
  medianDuration: number
  outboundValueSum: number
  inboundValueSum: number
}

export interface BridgeTransfersDetailedStatsRecord {
  type: string
  sourceChain: string
  destinationChain: string
  count: number
  medianDuration: number
  outboundValueSum: number
  inboundValueSum: number
}

export class BridgeTransferRepository extends BaseRepository {
  async insertMany(records: BridgeTransferRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('BridgeTransfer').values(batch).execute()
    })
    return rows.length
  }

  async getAll(): Promise<BridgeTransferRecord[]> {
    const rows = await this.db
      .selectFrom('BridgeTransfer')
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
    let query = this.db.selectFrom('BridgeTransfer').where('type', '=', type)

    if (options.srcChain !== undefined) {
      query = query.where('srcChain', '=', options.srcChain)
    }

    if (options.dstChain !== undefined) {
      query = query.where('dstChain', '=', options.dstChain)
    }

    const rows = await query.orderBy('timestamp', 'desc').selectAll().execute()

    return rows.map(toRecord)
  }

  async getStats(): Promise<BridgeTransfersStatsRecord[]> {
    const overallStats = await this.db
      .selectFrom('BridgeTransfer')
      .select((eb) => [
        'type',
        eb.fn.countAll().as('count'),
        sql<number>`percentile_cont(0.5) within group (order by duration)`.as(
          'medianDuration',
        ),
        eb.fn.sum('srcValueUsd').as('outboundValueSum'),
        eb.fn.sum('dstValueUsd').as('inboundValueSum'),
      ])
      .groupBy('type')
      .execute()

    return overallStats.map((overall) => ({
      type: overall.type,
      count: Number(overall.count),
      medianDuration: Number(overall.medianDuration),
      outboundValueSum: Number(overall.outboundValueSum),
      inboundValueSum: Number(overall.inboundValueSum),
    }))
  }

  async getDetailedStats(): Promise<BridgeTransfersDetailedStatsRecord[]> {
    const chainStats = await this.db
      .selectFrom('BridgeTransfer')
      .select((eb) => [
        'type',
        'srcChain',
        'dstChain',
        eb.fn.countAll().as('count'),
        sql<number>`percentile_cont(0.5) within group (order by duration)`.as(
          'medianDuration',
        ),
        eb.fn.sum('srcValueUsd').as('outboundValueSum'),
        eb.fn.sum('dstValueUsd').as('inboundValueSum'),
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
        outboundValueSum: Number(chain.outboundValueSum),
        inboundValueSum: Number(chain.inboundValueSum),
      }
    })
  }

  async getExistingItems(
    items: {
      srcTxHash: string
      dstTxHash: string
    }[],
    types: string[],
  ): Promise<BridgeTransferRecord[]> {
    if (items.length === 0) return []

    let query = this.db.selectFrom('BridgeTransfer').selectAll()

    if (types.length > 0) {
      query = query.where('type', 'in', types)
    }

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

  async deleteBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('BridgeTransfer')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('BridgeTransfer').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
