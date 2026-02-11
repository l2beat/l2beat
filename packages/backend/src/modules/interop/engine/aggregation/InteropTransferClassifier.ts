import type { InteropTransferRecord } from '@l2beat/database'
import type { InteropBridgeType } from '@l2beat/shared-pure'
import type { InteropAggregationConfig } from '../../../../config/features/interop'

export interface ClassifiedTransfers {
  lockAndMint: InteropTransferRecord[]
  burnAndMint: InteropTransferRecord[]
  nonMinting: InteropTransferRecord[]
  unknown: InteropTransferRecord[]
}

export class InteropTransferClassifier {
  classifyTransfers(
    transfers: InteropTransferRecord[],
    config: InteropAggregationConfig,
  ): ClassifiedTransfers {
    const conditions = this.buildMatchers(config)
    const filtered = transfers.filter((transfer) =>
      conditions.some((pConditions) => pConditions.every((c) => c(transfer))),
    )

    return this.groupByBridgeType(filtered)
  }

  private groupByBridgeType(
    records: InteropTransferRecord[],
  ): ClassifiedTransfers {
    const lockAndMint: InteropTransferRecord[] = []
    const burnAndMint: InteropTransferRecord[] = []
    const nonMinting: InteropTransferRecord[] = []
    const unknown: InteropTransferRecord[] = []

    for (const record of records) {
      if (
        (record.srcWasBurned === false && record.dstWasMinted === true) ||
        (record.srcWasBurned === true && record.dstWasMinted === false)
      ) {
        lockAndMint.push(record)
      } else if (record.srcWasBurned === true && record.dstWasMinted === true) {
        burnAndMint.push(record)
      } else if (
        record.srcWasBurned === false &&
        record.dstWasMinted === false
      ) {
        nonMinting.push(record)
      } else {
        unknown.push(record)
      }
    }

    return { lockAndMint, burnAndMint, nonMinting, unknown }
  }

  private buildMatchers(config: InteropAggregationConfig) {
    const conditions: ((transfer: InteropTransferRecord) => boolean)[][] = []

    for (const plugin of config.plugins) {
      const pluginConditions: ((transfer: InteropTransferRecord) => boolean)[] =
        []
      pluginConditions.push((transfer) => plugin.plugin === transfer.plugin)

      if (plugin.bridgeType) {
        pluginConditions.push((transfer) => {
          const transferBridgeType =
            transfer.bridgeType ?? this.inferBridgeType(transfer)
          return plugin.bridgeType === transferBridgeType
        })
      }

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

  private inferBridgeType(transfer: InteropTransferRecord): InteropBridgeType {
    if (
      (transfer.srcWasBurned === false && transfer.dstWasMinted === true) ||
      (transfer.srcWasBurned === true && transfer.dstWasMinted === false)
    ) {
      return 'lockAndMint'
    }
    if (transfer.srcWasBurned === true && transfer.dstWasMinted === true) {
      return 'burnAndMint'
    }
    if (transfer.srcWasBurned === false && transfer.dstWasMinted === false) {
      return 'nonMinting'
    }
    return 'unknown'
  }
}
