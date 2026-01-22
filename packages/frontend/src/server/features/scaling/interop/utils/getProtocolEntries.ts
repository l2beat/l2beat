import type { Logger } from '@l2beat/backend-tools'
import {
  INTEROP_CHAINS,
  type InteropConfig,
  type Project,
} from '@l2beat/config'
import { assert, notUndefined } from '@l2beat/shared-pure'
import { getLogger } from '~/server/utils/logger'
import { manifest } from '~/utils/Manifest'
import type { AggregatedInteropTransferWithTokens } from '../types'
import { getProtocolsDataMap } from './getProtocolsDataMap'

export type TokenData = {
  id: string
  symbol: string
  iconUrl: string
  volume: number
}

export type ChainData = {
  id: string
  name: string
  iconUrl: string
  volume: number
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

export type ProtocolEntry = {
  iconUrl: string
  protocolName: string
  bridgeType: 'nonMinting' | 'lockAndMint' | 'omnichain'
  volume: number
  tokens: TokenData[]
  chains: ChainData[]
  transferCount: number
  averageValue: number
  averageDuration: { type: 'single'; duration: number } | DurationSplit
}

export function getProtocolEntries(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  interopProjects: Project<'interopConfig'>[],
): ProtocolEntry[] {
  const logger = getLogger().for('getProtocolsByType')

  const durationSplitMap = new Map<
    string,
    NonNullable<InteropConfig['durationSplit']>
  >()
  for (const project of interopProjects) {
    if (project.interopConfig.durationSplit) {
      durationSplitMap.set(project.id, project.interopConfig.durationSplit)
    }
  }

  const protocolsDataMap = getProtocolsDataMap(records, durationSplitMap)

  const protocolsData = Array.from(protocolsDataMap.entries()).sort(
    (a, b) => b[1].volume - a[1].volume,
  )

  return protocolsData
    .map(([key, data]) => {
      const project = interopProjects.find((p) => p.id === key)
      assert(project, `Project not found: ${key}`)
      const bridgeType = project.interopConfig.bridgeType

      return {
        iconSlug: project.slug,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        protocolName: project.interopConfig.name ?? project.name,
        bridgeType,
        volume: data.volume,
        tokens: getTokensData(data.tokens, tokensDetailsMap, logger),
        chains: getChainsData(data.chains, logger),
        transferCount: data.transferCount,
        averageValue:
          data.transferCount > 0 ? data.volume / data.transferCount : 0,
        averageDuration: getAverageDuration(key, data, durationSplitMap),
      }
    })
    .sort((a, b) => b.volume - a.volume)
}

function getTokensData(
  tokens: Map<string, number>,
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  logger: Logger,
) {
  return Array.from(tokens.entries())
    .map(([tokenId, volume]) => {
      const tokenDetails = tokensDetailsMap.get(tokenId)

      if (!tokenDetails) {
        logger.warn(`Token not found: ${tokenId}`)
        return undefined
      }

      return {
        id: tokenId,
        symbol: tokenDetails.symbol,
        iconUrl:
          tokenDetails.iconUrl ??
          manifest.getUrl('/images/token-placeholder.png'),
        volume,
      }
    })
    .filter(notUndefined)
    .toSorted((a, b) => b.volume - a.volume)
}

function getChainsData(
  chains: Map<string, number>,
  logger: Logger,
): ChainData[] {
  return Array.from(chains.entries())
    .map(([chainId, volume]) => {
      const chain = INTEROP_CHAINS.find((c) => c.id === chainId)
      if (!chain) {
        logger.warn(`Chain not found: ${chainId}`)
        return undefined
      }

      return {
        id: chainId,
        name: chain.name,
        iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
        volume,
      }
    })
    .filter(notUndefined)
    .toSorted((a, b) => b.volume - a.volume)
}

function getAverageDuration(
  key: string,
  data: {
    transferCount: number
    totalDurationSum: number
    inTransferCount: number
    inDurationSum: number
    outTransferCount: number
    outDurationSum: number
  },
  durationSplitMap: Map<string, NonNullable<InteropConfig['durationSplit']>>,
): ProtocolEntry['averageDuration'] {
  const durationSplit = durationSplitMap.get(key)

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
