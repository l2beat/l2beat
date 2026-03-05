import type { KnownInteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import type {
  AggregatedInteropTransferWithTokens,
  InteropSelectionInput,
} from '../types'
import { getAggregatedInteropSnapshotTimestamp } from './getAggregatedInteropTimestamp'

interface AggregatedInteropTransferWithTokensResult {
  records: AggregatedInteropTransferWithTokens[]
  snapshotTimestamp: UnixTime | undefined
}

export async function getLatestAggregatedInteropTransferWithTokens(
  selection: InteropSelectionInput,
  type?: KnownInteropBridgeType,
  protocolId?: string,
): Promise<AggregatedInteropTransferWithTokensResult> {
  const db = getDb()

  const { from, to } = selection
  if (from.length === 0 || to.length === 0) {
    return { records: [], snapshotTimestamp: undefined }
  }

  const snapshotTimestamp = await getAggregatedInteropSnapshotTimestamp()
  if (!snapshotTimestamp) {
    return { records: [], snapshotTimestamp: undefined }
  }

  const [transfers, tokens] = await Promise.all([
    db.aggregatedInteropTransfer.getByChainsAndTimestamp(
      snapshotTimestamp,
      selection.from,
      selection.to,
      type,
      protocolId,
    ),
    db.aggregatedInteropToken.getByChainsAndTimestamp(
      snapshotTimestamp,
      selection.from,
      selection.to,
      type,
      protocolId,
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
        minTransferValueUsd: token.minTransferValueUsd,
        maxTransferValueUsd: token.maxTransferValueUsd,
        mintedValueUsd: token.mintedValueUsd,
        burnedValueUsd: token.burnedValueUsd,
      })),
  }))

  return { records, snapshotTimestamp }
}
