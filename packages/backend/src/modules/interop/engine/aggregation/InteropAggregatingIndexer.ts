import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
  Database,
  InteropTransferRecord,
} from '@l2beat/database'
import { type InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../tools/uif/ManagedChildIndexer'
import { getAggregatedTokens, getAggregatedTransfer } from './aggregation'

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

    const aggregatedTransfers: AggregatedInteropTransferRecord[] = []
    const aggregatedTokens: AggregatedInteropTokenRecord[] = []
    const missingInConfigMap = new Map<string, Map<InteropBridgeType, number>>()

    for (const config of this.$.configs) {
      const conditions = this.txMatchers(config)
      const filtered = transfers.filter((transfer) =>
        conditions.some((pConditions) => pConditions.every((c) => c(transfer))),
      )
      const groupedByBridgeType = this.groupByBridgeType(filtered)
      for (const [type, actualRecords] of Object.entries(groupedByBridgeType)) {
        const bridgeType = type as InteropBridgeType

        if (!config.showAlways || config.showAlways.includes(bridgeType)) {
          continue
        }

        if (actualRecords.length === 0) {
          continue
        }
        const current = missingInConfigMap.get(config.id)
        if (current) {
          current.set(bridgeType, actualRecords.length)
        } else {
          missingInConfigMap.set(
            config.id,
            new Map([[bridgeType, actualRecords.length]]),
          )
        }
      }

      for (const [type, records] of Object.entries(groupedByBridgeType)) {
        const grouped = groupBy(records, (x) => `${x.srcChain}-${x.dstChain}`)
        const bridgeType = type as InteropBridgeType

        for (const group of Object.values(grouped)) {
          aggregatedTransfers.push({
            timestamp: to,
            id: config.id,
            bridgeType,
            ...getAggregatedTransfer(group, {
              calculateValueInFlight: bridgeType === 'nonMinting',
            }),
          })

          aggregatedTokens.push(
            ...getAggregatedTokens(group).map((token) => ({
              timestamp: to,
              id: config.id,
              bridgeType,
              ...token,
            })),
          )
        }
      }
    }

    this.logger.warn(
      'Some bridge types were automatically detected and are not defined in configs',
      {
        missingInConfigMap: Object.fromEntries(missingInConfigMap.entries()),
      },
    )

    await this.$.db.transaction(async () => {
      await this.$.db.aggregatedInteropTransfer.deleteAllButEarliestPerDayBefore(
        from,
      )
      await this.$.db.aggregatedInteropToken.deleteAllButEarliestPerDayBefore(
        from,
      )
      await this.$.db.aggregatedInteropToken.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropTransfer.deleteByTimestamp(to)
      await this.$.db.aggregatedInteropTransfer.insertMany(aggregatedTransfers)
      await this.$.db.aggregatedInteropToken.insertMany(aggregatedTokens)
    })
    this.logger.info('Aggregated interop transfers saved to db', {
      aggregatedRecords: aggregatedTransfers.length,
      aggregatedTokens: aggregatedTokens.length,
    })

    return to
  }

  // Invalidate on every restart
  override invalidate(_: number): Promise<number> {
    return Promise.resolve(0)
  }

  private groupByBridgeType(records: InteropTransferRecord[]) {
    const lockAndMint = []
    const omnichain = []
    const nonMinting = []
    for (const record of records) {
      if (record.srcWasBurned === false && record.dstWasMinted === true) {
        lockAndMint.push(record)
      } else if (record.srcWasBurned === true && record.dstWasMinted === true) {
        omnichain.push(record)
      } else if (
        record.srcWasBurned === false &&
        record.dstWasMinted === false
      ) {
        nonMinting.push(record)
      }
    }
    return { lockAndMint, omnichain, nonMinting }
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
