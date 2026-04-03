import type {
  Database,
  InteropTransfersDetailedStatsRecord,
  InteropTransfersStatsRecord,
} from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import type { InteropBridgeType } from '@l2beat/shared-pure'

export interface InteropTransferFilters {
  plugin?: string
  srcChain?: string
  dstChain?: string
}

export interface InteropTransferDetailsRecord {
  plugin: string
  type: string
  transferId: string
  bridgeType: InteropBridgeType
  duration: number | undefined
  timestamp: number
  srcChain: string
  srcTxHash: string | undefined
  srcLogIndex: number | undefined
  srcTokenAddress: string | undefined
  srcAbstractTokenId: string | undefined
  srcSymbol: string | undefined
  srcAmount: number | undefined
  srcValueUsd: number | undefined
  srcWasBurned: boolean | undefined
  dstChain: string
  dstTxHash: string | undefined
  dstLogIndex: number | undefined
  dstTokenAddress: string | undefined
  dstAbstractTokenId: string | undefined
  dstSymbol: string | undefined
  dstAmount: number | undefined
  dstValueUsd: number | undefined
  dstWasMinted: boolean | undefined
}

export interface InteropTransferStatsItem extends InteropTransfersStatsRecord {
  chains: InteropTransfersDetailedStatsRecord[]
}

export async function getInteropTransferDetails(
  db: Database,
  type: string,
  filters: InteropTransferFilters = {},
): Promise<InteropTransferDetailsRecord[]> {
  const transfers = await db.interopTransfer.getByType(type, filters)

  return transfers.map((transfer) => ({
    plugin: transfer.plugin,
    type: transfer.type,
    transferId: transfer.transferId,
    bridgeType:
      transfer.bridgeType ??
      InteropTransferClassifier.inferBridgeType(transfer),
    duration: transfer.duration,
    timestamp: transfer.timestamp,
    srcChain: transfer.srcChain,
    srcTxHash: transfer.srcTxHash,
    srcLogIndex: transfer.srcLogIndex,
    srcTokenAddress: transfer.srcTokenAddress,
    srcAbstractTokenId: transfer.srcAbstractTokenId,
    srcSymbol: transfer.srcSymbol,
    srcAmount: transfer.srcAmount,
    srcValueUsd: transfer.srcValueUsd,
    srcWasBurned: transfer.srcWasBurned,
    dstChain: transfer.dstChain,
    dstTxHash: transfer.dstTxHash,
    dstLogIndex: transfer.dstLogIndex,
    dstTokenAddress: transfer.dstTokenAddress,
    dstAbstractTokenId: transfer.dstAbstractTokenId,
    dstSymbol: transfer.dstSymbol,
    dstAmount: transfer.dstAmount,
    dstValueUsd: transfer.dstValueUsd,
    dstWasMinted: transfer.dstWasMinted,
  }))
}

export async function getInteropTransferStats(
  db: Database,
): Promise<InteropTransferStatsItem[]> {
  const [stats, detailedStats] = await Promise.all([
    db.interopTransfer.getStats(),
    db.interopTransfer.getDetailedStats(),
  ])
  const chainsByTransfer = new Map<
    string,
    InteropTransfersDetailedStatsRecord[]
  >()

  for (const chain of detailedStats) {
    const key = `${chain.plugin}:${chain.type}`
    const chains = chainsByTransfer.get(key) ?? []

    chains.push(chain)
    chainsByTransfer.set(key, chains)
  }

  return stats.map((overall) => {
    const key = `${overall.plugin}:${overall.type}`

    return {
      ...overall,
      chains: chainsByTransfer.get(key) ?? [],
    }
  })
}
