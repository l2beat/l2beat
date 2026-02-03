import type { Logger } from '@l2beat/backend-tools'
import {
  INTEROP_CHAINS,
  type InteropDurationSplit,
  type Project,
} from '@l2beat/config'
import {
  assert,
  type InteropBridgeType,
  notUndefined,
} from '@l2beat/shared-pure'
import { getLogger } from '~/server/utils/logger'
import { manifest } from '~/utils/Manifest'
import type { AggregatedInteropTransferWithTokens } from '../types'
import { getProtocolsDataMap } from './getProtocolsDataMap'
import {
  makeProtocolEntriesKey,
  parseProtocolEntriesKey,
} from './protocolEntriesKey'

export type TokenData = {
  id: string
  symbol: string
  iconUrl: string
  volume: number | null
  transferCount: number
  avgDuration: { type: 'single'; duration: number } | DurationSplit | null
  avgValue: number | null
}

export type ChainData = {
  id: string
  name: string
  iconUrl: string
  volume: number
  transferCount: number
  avgDuration: { type: 'single'; duration: number } | DurationSplit
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

export type ProtocolEntry = {
  id: string
  iconUrl: string
  protocolName: string
  isAggregate?: boolean
  subgroup?: {
    name: string
    iconUrl: string
  }
  bridgeType: InteropBridgeType
  volume: number
  tokens: TokenData[]
  chains: ChainData[]
  transferCount: number
  averageValue: number
  averageDuration: { type: 'single'; duration: number } | DurationSplit
  averageValueInFlight?: number
}

export function getProtocolEntries(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  interopProjects: Project<'interopConfig'>[],
): ProtocolEntry[] {
  const logger = getLogger().for('getProtocolsByType')

  const durationSplitMap = new Map<string, InteropDurationSplit>()
  for (const project of interopProjects) {
    for (const [bridgeType, durationSplit] of Object.entries(
      project.interopConfig.durationSplit ?? {},
    )) {
      durationSplitMap.set(
        makeProtocolEntriesKey(project.id, bridgeType as InteropBridgeType),
        durationSplit,
      )
    }
  }

  const protocolsDataMap = getProtocolsDataMap(
    records,
    durationSplitMap,
    (record) => makeProtocolEntriesKey(record.id, record.bridgeType),
  )

  const protocolsData = Array.from(protocolsDataMap.entries()).sort(
    (a, b) => b[1].volume - a[1].volume,
  )

  return protocolsData
    .map(([key, data]) => {
      const { id, bridgeType } = parseProtocolEntriesKey(key)
      const project = interopProjects.find((p) => p.id === id)
      assert(project, `Project not found: ${id}`)

      const subgroupProject = interopProjects.find(
        (p) => p.id === project.interopConfig.subgroupId,
      )

      return {
        id: project.id,
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
          durationSplitMap,
          logger,
          data.transferCount - data.identifiedTransferCount,
        ),
        chains: getChainsData(key, data.chains, durationSplitMap, logger),
        transferCount: data.transferCount,
        averageValue:
          data.identifiedTransferCount > 0
            ? data.volume / data.identifiedTransferCount
            : 0,
        averageDuration: getAverageDuration(key, data, durationSplitMap),
        averageValueInFlight: data.averageValueInFlight,
      }
    })
    .sort((a, b) => b.volume - a.volume)
}

function getTokensData(
  protocolId: string,
  tokens: Map<string, AverageDurationData & { volume: number }>,
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  durationSplitMap: Map<string, InteropDurationSplit>,
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
  chains: Map<string, AverageDurationData & { volume: number }>,
  durationSplitMap: Map<string, InteropDurationSplit>,
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
        durationSplitMap,
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

type AverageDurationData = {
  transferCount: number
  totalDurationSum: number
  inTransferCount: number
  inDurationSum: number
  outTransferCount: number
  outDurationSum: number
}

function getAverageDuration(
  key: string,
  data: AverageDurationData,
  durationSplitMap: Map<string, InteropDurationSplit>,
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
