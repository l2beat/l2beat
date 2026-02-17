import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import type {
  AggregatedInteropTransferWithTokens,
  SelectedChainsIds,
} from '../types'

export async function getLatestAggregatedInteropTransferWithTokens(
  selectedChains: SelectedChainsIds,
  type?: KnownInteropBridgeType,
): Promise<AggregatedInteropTransferWithTokens[]> {
  const db = getDb()

  const [firstChain, secondChain] = selectedChains
  if (!firstChain || !secondChain) {
    return []
  }

  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()
  if (!latestTimestamp) {
    return []
  }

  const [transfers, tokens] = await Promise.all([
    db.aggregatedInteropTransfer.getByChainsAndTimestamp(
      latestTimestamp,
      [firstChain, secondChain],
      type,
    ),
    db.aggregatedInteropToken.getByChainsAndTimestamp(
      latestTimestamp,
      [firstChain, secondChain],
      type,
    ),
  ])

  const records = transfers.map((transfer) => ({
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
        mintedValueUsd: token.mintedValueUsd,
        burnedValueUsd: token.burnedValueUsd,
      })),
  }))

  return records
}
