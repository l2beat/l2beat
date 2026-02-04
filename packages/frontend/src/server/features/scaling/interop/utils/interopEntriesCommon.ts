import {
  INTEROP_CHAINS,
  type InteropConfig,
  type InteropDurationSplit,
} from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { getLogger } from '~/server/utils/logger'
import { manifest } from '~/utils/Manifest'
import type { AverageDurationData } from '../types'

export type TokenData = {
  id: string
  symbol: string
  iconUrl: string
  volume: number | null
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number | null
}

export type ChainData = {
  id: string
  name: string
  iconUrl: string
  volume: number
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number
}

export type DurationSplit = {
  type: 'split'
  in: {
    label: string
    duration: number | null
  }
  out: {
    label: string
    duration: number | null
  }
}

export type AverageDuration =
  | { type: 'single'; duration: number }
  | DurationSplit
  | 'unknown'

const logger = getLogger().for('interopEntriesCommon')

export function getTokensData(
  protocolId: string,
  tokens: Map<string, AverageDurationData & { volume: number }>,
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  customDurationConfigMap: Map<
    string,
    NonNullable<InteropDurationSplit | InteropConfig['transfersTimeMode']>
  >,
  unknownTransfersCount: number,
): TokenData[] {
  const tokensData: TokenData[] = Array.from(tokens.entries())
    .map(([tokenId, token]) => {
      const tokenDetails = tokensDetailsMap.get(tokenId)

      if (!tokenDetails) {
        logger.warn(`Token not found: ${tokenId}`)
        return undefined
      }

      const avgDuration = getAverageDuration(
        protocolId,
        token,
        customDurationConfigMap,
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
    })
  }

  return tokensData
}

export function getChainsData(
  protocolId: string,
  chains: Map<string, AverageDurationData & { volume: number }>,
  customDurationConfigMap: Map<
    string,
    NonNullable<InteropDurationSplit | InteropConfig['transfersTimeMode']>
  >,
): ChainData[] {
  return Array.from(chains.entries())
    .map(([chainId, chainData]) => {
      const chain = INTEROP_CHAINS.find((c) => c.id === chainId)
      if (!chain) {
        logger.warn(`Chain not found: ${chainId}`)
        return undefined
      }

      const avgDuration = getAverageDuration(
        protocolId,
        chainData,
        customDurationConfigMap,
      )

      return {
        id: chainId,
        name: chain.name,
        iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
        volume: chainData.volume,
        transferCount: chainData.transferCount,
        avgDuration: avgDuration,
        avgValue: Math.floor(chainData.volume / chainData.transferCount),
      }
    })
    .filter(notUndefined)
    .toSorted((a, b) => b.volume - a.volume)
}

export function getAverageDuration(
  key: string,
  data: AverageDurationData,
  customDurationConfigMap: Map<
    string,
    NonNullable<InteropDurationSplit | InteropConfig['transfersTimeMode']>
  >,
): AverageDuration {
  const durationSplit = customDurationConfigMap.get(key)
  if (durationSplit === 'unknown') return 'unknown'
  if (durationSplit) {
    return {
      type: 'split',
      in: {
        label: durationSplit.in.label,
        duration:
          data.inTransferCount > 0
            ? Math.floor(data.inDurationSum / data.inTransferCount)
            : null,
      },
      out: {
        label: durationSplit.out.label,
        duration:
          data.outTransferCount > 0
            ? Math.floor(data.outDurationSum / data.outTransferCount)
            : null,
      },
    }
  }

  return {
    type: 'single',
    duration:
      data.transferCount > 0
        ? Math.floor(data.totalDurationSum / data.transferCount)
        : 0,
  }
}
