import type { Logger } from '@l2beat/backend-tools'
import { type KnownInteropBridgeType, notUndefined } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'

import type { CommonInteropData, DurationSplitMap, TokenData } from '../types'
import type { TokensDetailsMap } from './buildTokensDetailsMap'

import { getAverageDuration } from './getAverageDuration'

type Params = {
  projectId: string
  bridgeType: KnownInteropBridgeType | undefined
  tokens: Map<string, CommonInteropData>
  tokensDetailsMap: TokensDetailsMap
  durationSplitMap: DurationSplitMap | undefined
  unknownTransfersCount: number
  logger: Logger
}

export function getTokensData({
  projectId,
  bridgeType,
  tokens,
  tokensDetailsMap,
  durationSplitMap,
  unknownTransfersCount,
  logger,
}: Params): TokenData[] {
  const tokensData: TokenData[] = Array.from(tokens.entries())
    .map(([tokenId, token]) => {
      const tokenDetails = tokensDetailsMap.get(tokenId)

      if (!tokenDetails) {
        logger.warn(`Token not found: ${tokenId}`)
        return undefined
      }

      const avgDuration = getAverageDuration(
        projectId,
        bridgeType,
        token,
        durationSplitMap,
      )

      return {
        id: tokenId,
        symbol: tokenDetails.symbol,
        issuer: tokenDetails.issuer,
        iconUrl:
          tokenDetails.iconUrl ??
          manifest.getUrl('/images/token-placeholder.png'),
        volume: token.volume,
        transferCount: token.transferCount,
        avgDuration: avgDuration,
        avgValue:
          token.transferCount > 0 ? token.volume / token.transferCount : null,
        minTransferValueUsd: token.minTransferValueUsd,
        maxTransferValueUsd: token.maxTransferValueUsd,
        netMintedValue:
          token.mintedValueUsd !== undefined &&
          token.burnedValueUsd !== undefined
            ? token.mintedValueUsd - token.burnedValueUsd
            : undefined,
      }
    })
    .filter(notUndefined)
    .toSorted((a, b) => b.volume - a.volume)

  if (unknownTransfersCount > 0) {
    tokensData.push({
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
    })
  }

  return tokensData
}
