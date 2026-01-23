import type {
  AggregatedInteropTransferRecord,
  AggregatedInteropTokenRecord,
  Database,
  InteropTransferRecord,
} from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../tools/uif/ManagedChildIndexer'

export interface InteropAggregatingIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  configs: InteropAggregationConfig[]
}

export class InteropAggregatingIndexer extends ManagedChildIndexer {
  constructor(private readonly $: InteropAggregatingIndexerDeps) {
    super({ ...$, name: 'interop_aggregating' })
  }

  override async update(_: number, to: number): Promise<number> {
    const from = to - UnixTime.DAY

    const transfers = await this.$.db.interopTransfer.getByRange(from, to)

    const aggregatedRecords: AggregatedInteropTransferRecord[] = []
    const aggregatedTokens: AggregatedInteropTokenRecord[] = []

    for (const config of this.$.configs) {
      const conditions = this.txMatchers(config)
      const filtered = transfers.filter((transfer) =>
        conditions.some((pConditions) => pConditions.every((c) => c(transfer))),
      )
      const grouped = groupBy(filtered, (x) => `${x.srcChain}-${x.dstChain}`)

      for (const group of Object.values(grouped)) {
        aggregatedRecords.push({
          timestamp: to,
          id: config.id,
          ...this.getAggregatedTransfer(group),
        })

        aggregatedTokens.push(
          ...this.getAggregatedTokens(group).map((token) => ({
            timestamp: to,
            id: config.id,
            ...token,
          })),
        )
      }
    }

    await this.$.db.transaction(async () => {
      await this.$.db.aggregatedInteropTransfer.deleteAllButEarliestPerDayBefore(
        from,
      )
      await this.$.db.aggregatedInteropToken.deleteAllButEarliestPerDayBefore(
        from,
      )
      await this.$.db.aggregatedInteropToken.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropTransfer.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropTransfer.insertMany(aggregatedRecords)
      await this.$.db.aggregatedInteropToken.insertMany(aggregatedTokens)
    })
    this.logger.info('Aggregated interop transfers saved to db', {
      aggregatedRecords: aggregatedRecords.length,
      aggregatedTokens: aggregatedTokens.length,
    })

    return to
  }

  // Invalidate on every restart
  override invalidate(_: number): Promise<number> {
    return Promise.resolve(0)
  }

  private getAggregatedTransfer(
    group: InteropTransferRecord[],
  ): Omit<AggregatedInteropTransferRecord, 'id' | 'timestamp'> {
    const first = group[0]
    assert(first, 'Group is empty')

    let totalDurationSum = 0
    let srcValueUsd: number | undefined = undefined
    let dstValueUsd: number | undefined = undefined

    for (const transfer of group) {
      totalDurationSum += transfer.duration
      if (srcValueUsd === undefined) {
        srcValueUsd = transfer.srcValueUsd
      } else {
        srcValueUsd += transfer.srcValueUsd ?? 0
      }

      if (dstValueUsd === undefined) {
        dstValueUsd = transfer.dstValueUsd
      } else {
        dstValueUsd += transfer.dstValueUsd ?? 0
      }
    }

    return {
      srcChain: first.srcChain,
      dstChain: first.dstChain,
      transferCount: group.length,
      totalDurationSum,
      srcValueUsd: srcValueUsd
        ? Math.round(srcValueUsd * 100) / 100
        : undefined,
      dstValueUsd: dstValueUsd
        ? Math.round(dstValueUsd * 100) / 100
        : undefined,
    }
  }

  private getAggregatedTokens(
    group: InteropTransferRecord[],
  ): Omit<AggregatedInteropTokenRecord, 'id' | 'timestamp'>[] {
    const first = group[0]
    assert(first, 'Group is empty')
    const tokens: Record<
      string,
      { transferCount: number; totalDurationSum: number; volume: number }
    > = {}

    for (const transfer of group) {
      if (transfer.srcAbstractTokenId) {
        tokens[transfer.srcAbstractTokenId] = {
          transferCount:
            (tokens[transfer.srcAbstractTokenId]?.transferCount ?? 0) + 1,
          totalDurationSum:
            (tokens[transfer.srcAbstractTokenId]?.totalDurationSum ?? 0) +
            transfer.duration,
          volume:
            (tokens[transfer.srcAbstractTokenId]?.volume ?? 0) +
            (transfer.srcValueUsd ?? 0),
        }
      }

      if (
        transfer.dstAbstractTokenId &&
        transfer.dstAbstractTokenId !== transfer.srcAbstractTokenId
      ) {
        tokens[transfer.dstAbstractTokenId] = {
          transferCount:
            (tokens[transfer.dstAbstractTokenId]?.transferCount ?? 0) + 1,
          totalDurationSum:
            (tokens[transfer.dstAbstractTokenId]?.totalDurationSum ?? 0) +
            transfer.duration,
          volume:
            (tokens[transfer.dstAbstractTokenId]?.volume ?? 0) +
            (transfer.dstValueUsd ?? 0),
        }
      }
    }

    return Object.entries(tokens).map(([abstractTokenId, data]) => ({
      srcChain: first.srcChain,
      dstChain: first.dstChain,
      abstractTokenId: abstractTokenId,
      transferCount: data.transferCount,
      totalDurationSum: data.totalDurationSum,
      volume: data.volume,
    }))
  }

  private txMatchers(config: InteropAggregationConfig) {
    const conditions: ((transfer: InteropTransferRecord) => boolean)[][] = []

    for (const plugin of config.plugins) {
      const pluginConditions: ((transfer: InteropTransferRecord) => boolean)[] =
        []
      pluginConditions.push((transfer) => plugin.plugin === transfer.plugin)
      if (plugin.chain) {
        pluginConditions.push(
          (transfer) =>
            plugin.chain === transfer.srcChain ||
            plugin.chain === transfer.dstChain,
        )
      }

      if (plugin.abstractTokenId) {
        pluginConditions.push(
          (transfer) =>
            plugin.abstractTokenId === transfer.srcAbstractTokenId ||
            plugin.abstractTokenId === transfer.dstAbstractTokenId,
        )
      }

      if (plugin.transferType) {
        pluginConditions.push(
          (transfer) => plugin.transferType === transfer.type,
        )
      }

      conditions.push(pluginConditions)
    }

    return conditions
  }
}
