import type { Logger } from '@l2beat/backend-tools'
import type { InteropDurationSplit, Project } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type { TokenData } from '../types'
import type { TokenInteropData } from './buildTokensDataMap'
import type { TokensDetailsMap } from './buildTokensDetailsMap'
import { getAverageDuration } from './getAverageDuration'
import { getTopProtocolDisplay } from './getTopProtocolDisplay'

type Params = {
  tokens: Map<string, TokenInteropData>
  tokensDetailsMap: TokensDetailsMap
  interopProjects: Project<'interopConfig'>[]
  unknownTransfersCount: number
  logger: Logger
  durationSplit: InteropDurationSplit | undefined
}

export function getTokensData({
  tokens,
  tokensDetailsMap,
  interopProjects,
  unknownTransfersCount,
  logger,
  durationSplit,
}: Params): TokenData[] {
  const projectsById = new Map(
    interopProjects.map((project) => [project.id, project]),
  )

  const tokensData: TokenData[] = Array.from(tokens.entries())
    .map(([tokenId, token]) => {
      const tokenDetails = tokensDetailsMap.get(tokenId)

      if (!tokenDetails) {
        logger.warn(`Token not found: ${tokenId}`)
        return undefined
      }

      const avgDuration = getAverageDuration(token, durationSplit)

      return {
        id: tokenId,
        symbol: tokenDetails.symbol,
        issuer: tokenDetails.issuer,
        iconUrl: tokenDetails.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
        topProtocol: getTopProtocolDisplay(token.protocols, projectsById),
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
        flows: token.flows
          ? Array.from(token.flows.values()).toSorted(
              (a, b) => b.volume - a.volume,
            )
          : [],
      }
    })
    .filter(notUndefined)
    .toSorted((a, b) => b.volume - a.volume)

  if (unknownTransfersCount > 0) {
    tokensData.push({
      id: 'unknown',
      symbol: 'Unknown',
      issuer: null,
      iconUrl: TOKEN_PLACEHOLDER_ICON_URL,
      topProtocol: undefined,
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

  return tokensData
}
