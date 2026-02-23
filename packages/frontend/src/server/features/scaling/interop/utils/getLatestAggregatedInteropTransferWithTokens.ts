import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import type {
  AggregatedInteropTransferWithTokens,
  InteropSelectionInput,
} from '../types'
import {
  filterDirectionalTokens,
  filterDirectionalTransfers,
  resolveInteropSelection,
  toLegacySelectedChainsTuple,
} from './resolveInteropSelection'

export async function getLatestAggregatedInteropTransferWithTokens(
  selectionInput: InteropSelectionInput,
  type?: KnownInteropBridgeType,
): Promise<AggregatedInteropTransferWithTokens[]> {
  const selection = resolveInteropSelection(selectionInput)
  if (selection.mode === 'empty') {
    return []
  }

  const db = getDb()

  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()
  if (!latestTimestamp) {
    return []
  }

  const selectedChains = toLegacySelectedChainsTuple(selection.union)

  const [allTransfers, allTokens] = await Promise.all([
    db.aggregatedInteropTransfer.getByChainsAndTimestamp(
      latestTimestamp,
      selectedChains,
      type,
    ),
    db.aggregatedInteropToken.getByChainsAndTimestamp(
      latestTimestamp,
      selectedChains,
      type,
    ),
  ])

  const transfers =
    selection.mode === 'directional'
      ? filterDirectionalTransfers(allTransfers, selection.from, selection.to)
      : allTransfers
  const tokens =
    selection.mode === 'directional'
      ? filterDirectionalTokens(allTokens, selection.from, selection.to)
      : allTokens

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
        mintedValueUsd: token.mintedValueUsd,
        burnedValueUsd: token.burnedValueUsd,
      })),
  }))
}
