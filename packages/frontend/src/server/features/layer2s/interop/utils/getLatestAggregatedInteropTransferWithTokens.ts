import type { InteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import type {
  AggregatedInteropTransferWithTokens,
  InteropSelectionInput,
} from '../types'
import { getAggregatedInteropSnapshotTimestamp } from './getAggregatedInteropTimestamp'
import { transferTouchesChain } from './transferTouchesChain'

interface AggregatedInteropTransferWithTokensResult {
  records: AggregatedInteropTransferWithTokens[]
  snapshotTimestamp: UnixTime | undefined
}

export async function getLatestAggregatedInteropTransferWithTokens({
  selection,
  types,
  protocolIds,
  anchorChain,
  snapshotTimestamp,
}: {
  selection: InteropSelectionInput
  types?: InteropBridgeType[]
  protocolIds?: string[]
  anchorChain?: string
  /** Pass when already resolved to skip the lookup. */
  snapshotTimestamp?: UnixTime
}): Promise<AggregatedInteropTransferWithTokensResult> {
  const db = getDb()

  const { from, to } = selection
  if (
    from.length === 0 ||
    to.length === 0 ||
    protocolIds?.length === 0 ||
    types?.length === 0
  ) {
    return { records: [], snapshotTimestamp: undefined }
  }

  const resolvedSnapshotTimestamp =
    snapshotTimestamp ?? (await getAggregatedInteropSnapshotTimestamp())
  if (!resolvedSnapshotTimestamp) {
    return { records: [], snapshotTimestamp: undefined }
  }

  const [transfers, tokens] = await Promise.all([
    db.aggregatedInteropTransfer.getByChainsAndTimestamp(
      resolvedSnapshotTimestamp,
      selection.from,
      selection.to,
      types,
      protocolIds,
    ),
    db.aggregatedInteropToken.getByChainsAndTimestamp(
      resolvedSnapshotTimestamp,
      selection.from,
      selection.to,
      types,
      protocolIds,
    ),
  ])

  const anchoredTransfers = transfers.filter((transfer) =>
    transferTouchesChain(transfer, anchorChain),
  )

  const records = anchoredTransfers.map((transfer) => ({
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
        transfersWithDurationCount: token.transfersWithDurationCount,
        volume: token.volume,
        minTransferValueUsd: token.minTransferValueUsd,
        maxTransferValueUsd: token.maxTransferValueUsd,
        mintedValueUsd: token.mintedValueUsd,
        burnedValueUsd: token.burnedValueUsd,
        transferTypeStats: token.transferTypeStats,
      })),
  }))

  return { records, snapshotTimestamp: resolvedSnapshotTimestamp }
}
