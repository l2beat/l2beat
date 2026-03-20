import { notUndefined } from '@l2beat/shared-pure'
import { getLogger } from '~/server/utils/logger'
import { manifest } from '~/utils/Manifest'
import type { AggregatedInteropTransferWithTokens, TokenData } from '../types'
import { buildTokensDataMap } from './buildTokensDataMap'
import type { TokensDetailsMap } from './buildTokensDetailsMap'

const logger = getLogger().for('getSummaryTokensData')

export function getSummaryTokensData(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: TokensDetailsMap,
): TokenData[] {
  const counts = {
    transferCount: records.reduce(
      (acc, transfer) => acc + transfer.transferCount,
      0,
    ),
    identifiedCount: records.reduce(
      (acc, transfer) => acc + transfer.identifiedCount,
      0,
    ),
  }

  const tokenDataMap = buildTokensDataMap(records)

  const result: TokenData[] = Array.from(tokenDataMap.entries())
    .map(([tokenId, token]) => {
      const tokenDetails = tokensDetailsMap.get(tokenId)

      if (!tokenDetails) {
        logger.warn(`Token not found: ${tokenId}`)
        return undefined
      }

      return {
        id: tokenId,
        symbol: tokenDetails.symbol,
        issuer: tokenDetails.issuer,
        iconUrl:
          tokenDetails.iconUrl ??
          manifest.getUrl('/images/token-placeholder.png'),
        volume: token.volume,
        transferCount: token.transferCount,
        avgDuration:
          token.transferCount > 0
            ? {
                type: 'single',
                duration: Math.floor(
                  token.totalDurationSum / token.transferCount,
                ),
              }
            : null,
        avgValue:
          token.transferCount > 0 ? token.volume / token.transferCount : null,
        minTransferValueUsd: token.minTransferValueUsd,
        maxTransferValueUsd: token.maxTransferValueUsd,
        netMintedValue:
          token.mintedValueUsd !== undefined &&
          token.burnedValueUsd !== undefined
            ? token.mintedValueUsd - token.burnedValueUsd
            : undefined,
        flows: Array.from(token.flows.values()).toSorted(
          (a, b) => b.volume - a.volume,
        ),
      } satisfies TokenData
    })
    .filter(notUndefined)
    .toSorted((a, b) => (b.volume ?? 0) - (a.volume ?? 0))

  const unknownTransfersCount = counts.transferCount - counts.identifiedCount
  if (unknownTransfersCount > 0) {
    result.push({
      id: 'unknown',
      symbol: 'Unknown',
      issuer: null,
      iconUrl: manifest.getUrl('/images/token-placeholder.png'),
      transferCount: unknownTransfersCount,
      avgDuration: null,
      avgValue: null,
      volume: null,
      minTransferValueUsd: undefined,
      maxTransferValueUsd: undefined,
      netMintedValue: undefined,
      flows: [],
    })
  }

  return result
}
