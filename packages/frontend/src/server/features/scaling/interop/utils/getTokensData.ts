import type { Logger } from '@l2beat/backend-tools'
import { type KnownInteropBridgeType, notUndefined } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'
import type { CommonInteropData, DurationSplitMap, TokenData } from '../types'
import { getAverageDuration } from './getAverageDuration'

type Params = {
  projectId: string
  bridgeType: KnownInteropBridgeType | undefined
  tokens: Map<string, CommonInteropData>
  tokensDetailsMap: Map<
    string,
    {
      symbol: string
      iconUrl: string | null
    }
  >
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
        iconUrl:
          tokenDetails.iconUrl ??
          manifest.getUrl('/images/token-placeholder.png'),
        volume: token.volume,
        transferCount: token.transferCount,
        avgDuration: avgDuration,
        avgValue: Math.floor(token.volume / token.transferCount),
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
      iconUrl: manifest.getUrl('/images/token-placeholder.png'),
      transferCount: unknownTransfersCount,
      avgDuration: null,
      avgValue: null,
      volume: null,
      netMintedValue: undefined,
    })
  }

  return tokensData
}
