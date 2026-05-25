import type { AggregatedInteropTransferWithTokens } from '../types'

export function scopeRecordsToToken(
  records: AggregatedInteropTransferWithTokens[],
  tokenId: string,
): AggregatedInteropTransferWithTokens[] {
  return records
    .map((record) => {
      const tokens = record.tokens.filter(
        (token) => token.abstractTokenId === tokenId,
      )
      const volume = tokens.reduce((sum, token) => sum + (token.volume ?? 0), 0)
      const transferCount = tokens.reduce(
        (sum, token) => sum + (token.transferCount ?? 0),
        0,
      )
      const transfersWithDurationCount = tokens.reduce(
        (sum, token) => sum + (token.transfersWithDurationCount ?? 0),
        0,
      )
      const totalDurationSum = tokens.reduce(
        (sum, token) => sum + (token.totalDurationSum ?? 0),
        0,
      )

      if (tokens.length === 0 || transferCount === 0) return undefined

      return {
        ...record,
        tokens,
        srcValueUsd: volume,
        dstValueUsd: volume,
        transferCount,
        identifiedCount: transferCount,
        transfersWithDurationCount,
        totalDurationSum,
        transferTypeStats: tokens[0]?.transferTypeStats,
        minTransferValueUsd: minDefined(
          tokens.map((t) => t.minTransferValueUsd),
        ),
        maxTransferValueUsd: maxDefined(
          tokens.map((t) => t.maxTransferValueUsd),
        ),
        mintedValueUsd: sumDefined(tokens.map((t) => t.mintedValueUsd)),
        burnedValueUsd: sumDefined(tokens.map((t) => t.burnedValueUsd)),
      }
    })
    .filter((record) => record !== undefined)
}

function minDefined(values: (number | undefined)[]): number | undefined {
  const defined = values.filter((value) => value !== undefined)
  return defined.length > 0 ? Math.min(...defined) : undefined
}

function maxDefined(values: (number | undefined)[]): number | undefined {
  const defined = values.filter((value) => value !== undefined)
  return defined.length > 0 ? Math.max(...defined) : undefined
}

function sumDefined(values: (number | undefined)[]): number | undefined {
  const defined = values.filter((value) => value !== undefined)
  return defined.length > 0
    ? defined.reduce((sum, value) => sum + value, 0)
    : undefined
}
