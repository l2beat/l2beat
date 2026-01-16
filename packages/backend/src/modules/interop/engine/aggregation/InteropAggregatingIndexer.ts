import type {
  InteropByChainPlugin,
  InteropByTokenIdPlugin,
  InteropPlainPlugin,
} from '@l2beat/config'
import type {
  AggregatedInteropTransferRecord,
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

    for (const config of this.$.configs) {
      const conditions = this.txMatchers(config)
      const filtered = transfers.filter((transfer) =>
        conditions.some((condition) => condition(transfer)),
      )
      const grouped = groupBy(filtered, (x) => `${x.srcChain}-${x.dstChain}`)

      for (const group of Object.values(grouped)) {
        aggregatedRecords.push({
          timestamp: to,
          id: config.id,
          ...this.mergeGroup(group),
        })
      }
    }

    await this.$.db.transaction(async () => {
      await this.$.db.aggregatedInteropTransfer.deleteAllButEarliestPerDayBefore(
        from,
      )
      await this.$.db.aggregatedInteropTransfer.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropTransfer.insertMany(aggregatedRecords)
    })
    this.logger.info('Aggregated interop transfers saved to db', {
      aggregatedRecords: aggregatedRecords.length,
    })

    return to
  }

  // Invalidate everytime
  override invalidate(_: number): Promise<number> {
    return Promise.resolve(0)
  }

  private mergeGroup(
    group: InteropTransferRecord[],
  ): Omit<AggregatedInteropTransferRecord, 'id' | 'timestamp'> {
    const first = group[0]
    assert(first, 'Group is empty')

    const tokensByVolume: Record<string, number> = {}
    let totalDurationSum = 0
    let srcValueUsd = 0
    let dstValueUsd = 0

    for (const transfer of group) {
      totalDurationSum += transfer.duration ?? 0
      if (transfer.srcValueUsd !== undefined) {
        srcValueUsd += transfer.srcValueUsd
      }
      if (transfer.dstValueUsd !== undefined) {
        dstValueUsd += transfer.dstValueUsd
      }
      if (transfer.srcAbstractTokenId === transfer.dstAbstractTokenId) {
        if (transfer.srcAbstractTokenId) {
          tokensByVolume[transfer.srcAbstractTokenId] =
            (tokensByVolume[transfer.srcAbstractTokenId] ?? 0) +
            (transfer.srcValueUsd ?? transfer.dstValueUsd ?? 0)
        }
      } else {
        if (transfer.srcAbstractTokenId) {
          tokensByVolume[transfer.srcAbstractTokenId] =
            (tokensByVolume[transfer.srcAbstractTokenId] ?? 0) +
            (transfer.srcValueUsd ?? 0)
        }
        if (transfer.dstAbstractTokenId) {
          tokensByVolume[transfer.dstAbstractTokenId] =
            (tokensByVolume[transfer.dstAbstractTokenId] ?? 0) +
            (transfer.dstValueUsd ?? 0)
        }
      }
    }

    return {
      srcChain: first.srcChain,
      dstChain: first.dstChain,
      tokensByVolume,
      transferCount: group.length,
      totalDurationSum,
      srcValueUsd,
      dstValueUsd,
    }
  }

  private txMatchers(config: InteropAggregationConfig) {
    const conditions: ((transfer: InteropTransferRecord) => boolean)[] = []
    const { plain, byChain, byTokenId } = this.groupPlugins(config)

    for (const plugin of plain) {
      conditions.push((transfer) => plugin.plugin === transfer.plugin)
    }

    for (const plugin of byChain) {
      conditions.push(
        (transfer) =>
          (plugin.chain === transfer.srcChain ||
            plugin.chain === transfer.dstChain) &&
          plugin.plugin === transfer.plugin,
      )
    }

    for (const plugin of byTokenId) {
      conditions.push(
        (transfer) =>
          (plugin.abstractTokenId === transfer.srcAbstractTokenId ||
            plugin.abstractTokenId === transfer.dstAbstractTokenId) &&
          plugin.plugin === transfer.plugin,
      )
    }

    return conditions
  }

  private groupPlugins(config: InteropAggregationConfig) {
    const plain: InteropPlainPlugin[] = []
    const byChain: InteropByChainPlugin[] = []
    const byTokenId: InteropByTokenIdPlugin[] = []

    for (const plugin of config.plugins) {
      switch (plugin.filterBy) {
        case 'chain':
          byChain.push(plugin)
          break
        case 'abstractTokenId':
          byTokenId.push(plugin)
          break
        default:
          plain.push(plugin)
          break
      }
    }

    return { plain, byChain, byTokenId }
  }
}
