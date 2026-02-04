import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import type { AggregatedInteropTransferWithTokens } from '../types'

export async function getLatestAggregatedInteropTransferWithTokens(
  from: string[],
  to: string[],
  type?: KnownInteropBridgeType,
): Promise<AggregatedInteropTransferWithTokens[]> {
  const db = getDb()
  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()
  if (!latestTimestamp) {
    return []
  }

  const [transfers, tokens] = await Promise.all([
    db.aggregatedInteropTransfer.getByChainsTimestampAndId(
      latestTimestamp,
      from,
      to,
      type,
    ),
    db.aggregatedInteropToken.getByChainsTimestampAndId(
      latestTimestamp,
      from,
      to,
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
          token.dstChain === transfer.dstChain,
      )
      .map((token) => ({
        abstractTokenId: token.abstractTokenId,
        transferCount: token.transferCount,
        totalDurationSum: token.totalDurationSum,
        volume: token.volume,
      })),
  }))

  return records
}
