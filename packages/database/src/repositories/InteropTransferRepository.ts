import {
  assert,
  type KnownInteropBridgeType,
  UnixTime,
} from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropTransfer } from '../kysely/generated/types'

export interface InteropTransferRecord {
  plugin: string
  bridgeType: KnownInteropBridgeType | undefined
  transferId: string
  type: string
  duration: number
  timestamp: UnixTime
  srcTime: UnixTime
  srcChain: string
  srcTxHash: string
  srcLogIndex: number
  srcEventId: string
  srcTokenAddress: string | undefined
  srcRawAmount: bigint | undefined
  srcWasBurned: boolean | undefined
  srcAbstractTokenId: string | undefined
  srcSymbol: string | undefined
  srcAmount: number | undefined
  srcPrice: number | undefined
  srcValueUsd: number | undefined
  dstTime: UnixTime
  dstChain: string
  dstTxHash: string
  dstLogIndex: number
  dstEventId: string
  dstTokenAddress: string | undefined
  dstRawAmount: bigint | undefined
  dstWasMinted: boolean | undefined
  dstAbstractTokenId: string | undefined
  dstSymbol: string | undefined
  dstAmount: number | undefined
  dstPrice: number | undefined
  dstValueUsd: number | undefined
  isProcessed: boolean
}

export interface InteropTransferUpdate {
  srcAbstractTokenId?: string
  srcSymbol?: string
  srcPrice?: number
  srcAmount?: number
  srcValueUsd?: number
  dstAbstractTokenId?: string
  dstSymbol?: string
  dstPrice?: number
  dstAmount?: number
  dstValueUsd?: number
}

export interface InteropMissingTokenInfo {
  chain: string
  tokenAddress: string
  count: number
  plugins: string[]
}

export function toRecord(
  row: Selectable<InteropTransfer>,
): InteropTransferRecord {
  return {
    plugin: row.plugin,
    // @ts-ignore
    bridgeType: row.bridgeType ?? undefined,
    transferId: row.transferId,
    type: row.type,
    duration: row.duration,
    timestamp: UnixTime.fromDate(row.timestamp),
    srcTime: UnixTime.fromDate(row.srcTime),
    srcChain: row.srcChain,
    srcTxHash: row.srcTxHash,
    srcLogIndex: row.srcLogIndex,
    srcEventId: row.srcEventId,
    srcTokenAddress: row.srcTokenAddress ?? undefined,
    srcRawAmount: row.srcRawAmount ? BigInt(row.srcRawAmount) : undefined,
    srcWasBurned: row.srcWasBurned ?? undefined,
    srcAbstractTokenId: row.srcAbstractTokenId ?? undefined,
    srcSymbol: row.srcSymbol ?? undefined,
    srcAmount: row.srcAmount ?? undefined,
    srcPrice: row.srcPrice ?? undefined,
    srcValueUsd: row.srcValueUsd ?? undefined,
    dstTime: UnixTime.fromDate(row.dstTime),
    dstChain: row.dstChain,
    dstTxHash: row.dstTxHash,
    dstLogIndex: row.dstLogIndex,
    dstEventId: row.dstEventId,
    dstTokenAddress: row.dstTokenAddress ?? undefined,
    dstRawAmount: row.dstRawAmount ? BigInt(row.dstRawAmount) : undefined,
    dstWasMinted: row.dstWasMinted ?? undefined,
    dstAbstractTokenId: row.dstAbstractTokenId ?? undefined,
    dstSymbol: row.dstSymbol ?? undefined,
    dstAmount: row.dstAmount ?? undefined,
    dstPrice: row.dstPrice ?? undefined,
    dstValueUsd: row.dstValueUsd ?? undefined,
    isProcessed: row.isProcessed,
  }
}

export function toRow(
  record: InteropTransferRecord,
): Insertable<InteropTransfer> {
  return {
    plugin: record.plugin,
    transferId: record.transferId,
    type: record.type,
    duration: record.duration,
    timestamp: UnixTime.toDate(record.timestamp),
    srcTime: UnixTime.toDate(record.srcTime),
    srcChain: record.srcChain,
    srcTxHash: record.srcTxHash?.toLowerCase(),
    srcLogIndex: record.srcLogIndex,
    srcEventId: record.srcEventId,
    srcTokenAddress: record.srcTokenAddress,
    srcRawAmount: record.srcRawAmount?.toString(),
    srcWasBurned: record.srcWasBurned,
    srcAbstractTokenId: record.srcAbstractTokenId,
    srcSymbol: record.srcSymbol,
    srcAmount: record.srcAmount,
    srcPrice: record.srcPrice,
    srcValueUsd: record.srcValueUsd,
    dstTime: UnixTime.toDate(record.dstTime),
    dstChain: record.dstChain,
    dstTxHash: record.dstTxHash?.toLowerCase(),
    dstLogIndex: record.dstLogIndex,
    dstEventId: record.dstEventId,
    dstTokenAddress: record.dstTokenAddress,
    dstRawAmount: record.dstRawAmount?.toString(),
    dstWasMinted: record.dstWasMinted,
    dstAbstractTokenId: record.dstAbstractTokenId,
    dstSymbol: record.dstSymbol,
    dstAmount: record.dstAmount,
    dstPrice: record.dstPrice,
    dstValueUsd: record.dstValueUsd,
    isProcessed: record.isProcessed,
  }
}

export interface InteropTransfersStatsRecord {
  plugin: string
  type: string
  count: number
  avgDuration: number
  srcValueSum: number
  dstValueSum: number
}

export interface InteropTransfersDetailedStatsRecord {
  plugin: string
  type: string
  srcChain: string
  dstChain: string
  count: number
  avgDuration: number
  srcValueSum: number
  dstValueSum: number
}

export class InteropTransferRepository extends BaseRepository {
  async insertMany(records: InteropTransferRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db.insertInto('InteropTransfer').values(batch).execute()
    })
    return rows.length
  }

  async getAll(): Promise<InteropTransferRecord[]> {
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .selectAll()
      .execute()

    return rows.map(toRecord)
  }

  async getByRange(
    from: UnixTime,
    to: UnixTime,
  ): Promise<InteropTransferRecord[]> {
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .where('timestamp', '>', UnixTime.toDate(from))
      .where('timestamp', '<=', UnixTime.toDate(to))
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
  ): Promise<InteropTransferRecord[]> {
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
    update: InteropTransferUpdate,
  ): Promise<void> {
    await this.db
      .updateTable('InteropTransfer')
      .set({ ...update, isProcessed: true })
      .where('transferId', '=', id)
      .execute()
  }

  async getStats(): Promise<InteropTransfersStatsRecord[]> {
    const overallStats = await this.db
      .selectFrom('InteropTransfer')
      .select((eb) => [
        'plugin',
        'type',
        eb.fn.countAll().as('count'),
        eb.fn.avg('duration').as('avgDuration'),
        eb.fn.sum('srcValueUsd').as('srcValueSum'),
        eb.fn.sum('dstValueUsd').as('dstValueSum'),
      ])
      .groupBy(['plugin', 'type'])
      .execute()

    return overallStats.map((overall) => ({
      plugin: overall.plugin,
      type: overall.type,
      count: Number(overall.count),
      avgDuration: Number(overall.avgDuration),
      srcValueSum: Number(overall.srcValueSum),
      dstValueSum: Number(overall.dstValueSum),
    }))
  }

  async getDetailedStats(): Promise<InteropTransfersDetailedStatsRecord[]> {
    const chainStats = await this.db
      .selectFrom('InteropTransfer')
      .select((eb) => [
        'plugin',
        'type',
        'srcChain',
        'dstChain',
        eb.fn.countAll().as('count'),
        eb.fn.avg('duration').as('avgDuration'),
        eb.fn.sum('srcValueUsd').as('srcValueSum'),
        eb.fn.sum('dstValueUsd').as('dstValueSum'),
      ])
      .where('srcChain', 'is not', null)
      .where('dstChain', 'is not', null)
      .groupBy(['plugin', 'type', 'srcChain', 'dstChain'])
      .execute()

    return chainStats.map((chain) => {
      assert(chain.srcChain && chain.dstChain)
      return {
        plugin: chain.plugin,
        type: chain.type,
        srcChain: chain.srcChain,
        dstChain: chain.dstChain,
        count: Number(chain.count),
        avgDuration: Number(chain.avgDuration),
        srcValueSum: Number(chain.srcValueSum),
        dstValueSum: Number(chain.dstValueSum),
      }
    })
  }

  async getExistingItems(
    items: { srcTxHash: string; dstTxHash: string }[],
  ): Promise<InteropTransferRecord[]> {
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

  async deleteForPlugin(plugin: string): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropTransfer')
      .where('plugin', '=', plugin)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropTransfer')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getMissingTokensInfo(): Promise<InteropMissingTokenInfo[]> {
    const rows = await this.db
      .selectFrom('InteropTransfer')
      .select([
        'plugin',
        'srcValueUsd',
        'dstValueUsd',
        'srcChain',
        'srcTokenAddress',
        'dstChain',
        'dstTokenAddress',
      ])
      .where('isProcessed', '=', true)
      .where((eb) =>
        eb.or([eb('srcValueUsd', 'is', null), eb('dstValueUsd', 'is', null)]),
      )
      .execute()

    const chainAddressCounts = new Map<string, number>()
    const chainAddressPlugins = new Map<string, Set<string>>()

    for (const row of rows) {
      if (row.srcValueUsd === null && row.srcChain && row.srcTokenAddress) {
        const key = `${row.srcChain}:${row.srcTokenAddress}`
        chainAddressCounts.set(key, (chainAddressCounts.get(key) || 0) + 1)
        const plugins = chainAddressPlugins.get(key)
        if (!plugins) {
          chainAddressPlugins.set(key, new Set())
        } else {
          plugins.add(row.plugin)
        }
      }
      if (row.dstValueUsd === null && row.dstChain && row.dstTokenAddress) {
        const key = `${row.dstChain}:${row.dstTokenAddress}`
        chainAddressCounts.set(key, (chainAddressCounts.get(key) || 0) + 1)
        const plugins = chainAddressPlugins.get(key)
        if (!plugins) {
          chainAddressPlugins.set(key, new Set())
        } else {
          plugins.add(row.plugin)
        }
      }
    }

    const result: InteropMissingTokenInfo[] = []
    for (const [key, count] of chainAddressCounts) {
      const [chain, tokenAddress] = key.split(':')
      const plugins = Array.from(
        chainAddressPlugins.get(key) || new Set<string>(),
      ).sort()
      result.push({
        chain: chain as string,
        tokenAddress: tokenAddress as string,
        count,
        plugins,
      })
    }

    return result
  }
}
