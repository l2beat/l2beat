import type { Logger } from '@l2beat/backend-tools'
import {
  INTEROP_CHAINS,
  type InteropConfig,
  type Project,
} from '@l2beat/config'
import { assert, notUndefined } from '@l2beat/shared-pure'
import { getLogger } from '~/server/utils/logger'
import { manifest } from '~/utils/Manifest'
import type {
  AggregatedInteropTransferWithTokens,
  CommonInteropData,
} from '../types'
import { getProtocolsDataMap } from './getProtocolsDataMap'

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
  avgDuration: AverageDuration
  avgValue: number
  netMintedValue?: number
}

export type AverageDuration =
  | { type: 'single'; duration: number }
  | DurationSplit
  | 'unknown'

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
  isAggregate?: boolean
  subgroup?: {
    name: string
    iconUrl: string
  }
  bridgeType: 'nonMinting' | 'lockAndMint' | 'omnichain'
  volume: number
  tokens: TokenData[]
  chains: ChainData[]
  transferCount: number
  averageValue: number
  averageDuration: AverageDuration
  averageValueInFlight?: number
  netMintedValue?: number
}

export function getProtocolEntries(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  interopProjects: Project<'interopConfig'>[],
): ProtocolEntry[] {
  const logger = getLogger().for('getProtocolsByType')

  const customDurationConfigMap = new Map<
    string,
    NonNullable<
      InteropConfig['durationSplit'] | InteropConfig['transfersTimeMode']
    >
  >()
  for (const project of interopProjects) {
    if (project.interopConfig.durationSplit) {
      customDurationConfigMap.set(
        project.id,
        project.interopConfig.durationSplit,
      )
    }
    if (project.interopConfig.transfersTimeMode) {
      customDurationConfigMap.set(
        project.id,
        project.interopConfig.transfersTimeMode,
      )
    }
  }

  const protocolsDataMap = getProtocolsDataMap(records, customDurationConfigMap)

  const protocolsData = Array.from(protocolsDataMap.entries()).sort(
    (a, b) => b[1].volume - a[1].volume,
  )

  return protocolsData
    .map(([key, data]) => {
      const project = interopProjects.find((p) => p.id === key)
      assert(project, `Project not found: ${key}`)
      const bridgeType = project.interopConfig.bridgeType

      const subgroupProject = interopProjects.find(
        (p) => p.id === project.interopConfig.subgroupId,
      )

      return {
        iconSlug: project.slug,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        protocolName: project.interopConfig.name ?? project.name,
        isAggregate: project.interopConfig.isAggregate,
        subgroup: subgroupProject
          ? {
              name: subgroupProject.name,
              iconUrl: manifest.getUrl(`/icons/${subgroupProject.slug}.png`),
            }
          : undefined,
        bridgeType,
        volume: data.volume,
        tokens: getTokensData(
          key,
          data.tokens,
          tokensDetailsMap,
          customDurationConfigMap,
          logger,
          data.transferCount - data.identifiedTransferCount,
        ),
        chains: getChainsData(
          key,
          data.chains,
          customDurationConfigMap,
          logger,
        ),
        transferCount: data.transferCount,
        averageValue:
          data.identifiedTransferCount > 0
            ? data.volume / data.identifiedTransferCount
            : 0,
        averageDuration: getAverageDuration(key, data, customDurationConfigMap),
        averageValueInFlight: data.averageValueInFlight,
        netMintedValue:
          data.mintedValueUsd && data.burnedValueUsd
            ? data.mintedValueUsd - data.burnedValueUsd
            : undefined,
      }
    })
    .sort((a, b) => b.volume - a.volume)
}

function getTokensData(
  protocolId: string,
  tokens: Map<string, CommonInteropData>,
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  customDurationConfigMap: Map<
    string,
    NonNullable<
      InteropConfig['durationSplit'] | InteropConfig['transfersTimeMode']
    >
  >,
  logger: Logger,
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

function getChainsData(
  protocolId: string,
  chains: Map<string, CommonInteropData>,
  customDurationConfigMap: Map<
    string,
    NonNullable<
      InteropConfig['durationSplit'] | InteropConfig['transfersTimeMode']
    >
  >,
  logger: Logger,
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
        netMintedValue:
          chainData.mintedValueUsd !== undefined &&
          chainData.burnedValueUsd !== undefined
            ? chainData.mintedValueUsd - chainData.burnedValueUsd
            : undefined,
      }
    })
    .filter(notUndefined)
    .toSorted((a, b) => b.volume - a.volume)
}

function getAverageDuration(
  key: string,
  data: CommonInteropData,
  customDurationConfigMap: Map<
    string,
    NonNullable<
      InteropConfig['durationSplit'] | InteropConfig['transfersTimeMode']
    >
  >,
): ProtocolEntry['averageDuration'] {
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
