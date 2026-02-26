import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import type {
  AggregatedInteropTransferWithTokens,
  InteropSelectionInput,
} from '../types'

export async function getLatestAggregatedInteropTransferWithTokens(
  selection: InteropSelectionInput,
  type?: KnownInteropBridgeType,
): Promise<AggregatedInteropTransferWithTokens[]> {
  const db = getDb()

  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()
  if (!latestTimestamp) {
    return []
  }

  const [transfers, tokens] = await Promise.all([
    db.aggregatedInteropTransfer.getByChainsAndTimestamp(
      latestTimestamp,
      selection.from,
      selection.to,
      type,
    ),
    db.aggregatedInteropToken.getByChainsAndTimestamp(
      latestTimestamp,
      selection.from,
      selection.to,
      type,
    ),
  ])

  return transfers.map((transfer) => ({
    ...transfer,
    tokens: tokens
      .filter(
        (token) =>
          token.id === transfer.id &&
          token.srcChain === transfer.srcChain &&
          token.dstChain === transfer.dstChain &&
          token.bridgeType === transfer.bridgeType,
      )
      .map((token) => ({
        abstractTokenId: token.abstractTokenId,
        transferCount: token.transferCount,
        totalDurationSum: token.totalDurationSum,
        volume: token.volume,
        minTransferValueUsd: token.minTransferValueUsd,
        maxTransferValueUsd: token.maxTransferValueUsd,
        mintedValueUsd: token.mintedValueUsd,
        burnedValueUsd: token.burnedValueUsd,
      })),
  }))
}
