import { assert } from '@l2beat/shared-pure'
import type {
  AggregatedInteropTransferWithTokens,
  ScopedInteropTransfer,
} from '../types'

export function scopeRecordsToToken(
  records: AggregatedInteropTransferWithTokens[],
  tokenId: string,
): ScopedInteropTransfer[] {
  return records
    .map((record) => {
      const tokens = record.tokens.filter(
        (token) => token.abstractTokenId === tokenId,
      )
      if (tokens.length === 0) return undefined

      const token = tokens[0]
      assert(
        token !== undefined && tokens.length === 1,
        `Expected exactly one token row for ${tokenId}`,
      )

      const transferCount = token.transferCount ?? 0
      if (transferCount === 0) return undefined

      const scopedTokens: ScopedInteropTransfer['tokens'] = [token]

      return {
        id: record.id,
        timestamp: record.timestamp,
        bridgeType: record.bridgeType,
        srcChain: record.srcChain,
        dstChain: record.dstChain,
        avgValueInFlight: undefined,
        tokens: scopedTokens,
        volume: token.volume,
        transferCount,
        identifiedCount: transferCount,
        transfersWithDurationCount: token.transfersWithDurationCount ?? 0,
        totalDurationSum: token.totalDurationSum ?? 0,
        transferTypeStats: token.transferTypeStats,
        minTransferValueUsd: token.minTransferValueUsd,
        maxTransferValueUsd: token.maxTransferValueUsd,
        mintedValueUsd: token.mintedValueUsd,
        burnedValueUsd: token.burnedValueUsd,
      }
    })
    .filter((record) => record !== undefined)
}
