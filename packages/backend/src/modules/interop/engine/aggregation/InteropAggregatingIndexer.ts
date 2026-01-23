import type {
  AggregatedInteropTransferRecord,
  AggregatedInteropTokenRecord,
  Database,
  InteropTransferRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../tools/uif/ManagedChildIndexer'
import {
  getAggregatedTransfer,
  getAggregatedTokens,
} from './aggregation'

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
          ...getAggregatedTransfer(group),
        })

        aggregatedTokens.push(
          ...getAggregatedTokens(group).map((token) => ({
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
