import type { InteropDurationSplit, Project } from '@l2beat/config'
import { assert, notUndefined, type ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { INTEROP_PAIR_SEPARATOR } from './consts'
import type { AverageDuration, InteropFlowsParams, TokenData } from './types'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import {
  getAverageDuration,
  getDurationSplit,
} from './utils/getAverageDuration'
import { getInteropChains } from './utils/getInteropChains'
import type { DurationData, TopEntry } from './utils/getInteropFlowAggregates'
import { getInteropFlowAggregates } from './utils/getInteropFlowAggregates'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getRelevantBridgeTypes } from './utils/getRelevantBridgeTypes'
import { getSummaryTokensData } from './utils/getSummaryTokensData'
import { getTopItems, type TopItems } from './utils/getTopItems'
import { scopeRecordsToToken } from './utils/scopeRecordsToToken'

export interface FlowToken {
  id: string
  symbol: string
  issuer: string | null
  iconUrl: string
  volume: number
}

export interface FlowProtocol {
  id: string
  slug: string
  name: string
  iconUrl: string
  volume: number
}

export interface FlowChain {
  chainId: string
  totalVolume: number
}

export interface Flow {
  srcChain: string
  dstChain: string
  volume: number
  transferCount: number
}

export interface ChainData {
  chainId: string
  totalVolume: number
  netFlow: number
  inflow: number
  outflow: number
  transfersIn: number
  transfersOut: number
  connectedChains: number
  tokenCount: number
  protocolCount: number
  topTokens: FlowToken[]
  topProtocols: FlowProtocol[]
  avgDuration: AverageDuration | null
}

export interface ChainPairData {
  chains: [string, string]
  topTokens: FlowToken[]
  topProtocols: FlowProtocol[]
  avgDuration: AverageDuration | null
}

interface FlowsStats {
  totalVolume: number
  totalTransferCount: number
  activeFlows: number
  tokenCount: number
  topTokens: TopItems<TokenData>
  topRoute: { srcChain: string; dstChain: string; volume: number } | undefined
  topChain: FlowChain | undefined
  topToken: FlowToken | undefined
  topProtocol: FlowProtocol | undefined
}

export type InteropFlowsData = {
  flows: Flow[]
  chainData: ChainData[]
  chainPairData: ChainPairData[]
  stats: FlowsStats
}

type GetInteropFlowsParams = InteropFlowsParams & {
  anchorChain?: string
}

export async function getInteropFlows(
  params: GetInteropFlowsParams,
): Promise<InteropFlowsData> {
  if (env.MOCK) {
    return getMockInteropFlows()
  }

  const { records } = await getLatestAggregatedInteropTransferWithTokens({
    selection: {
      from: params.chains,
      to: params.chains,
    },
    protocolIds: params.protocolIds,
    anchorChain: params.anchorChain,
  })
  const scopedRecords = params.tokenId
    ? scopeRecordsToToken(records, params.tokenId)
    : records

  if (scopedRecords.length === 0) {
    return {
      flows: [],
      chainData: [],
      chainPairData: [],
      stats: {
        totalVolume: 0,
        totalTransferCount: 0,
        activeFlows: 0,
        tokenCount: 0,
        topTokens: { items: [], remainingCount: 0 },
        topRoute: undefined,
        topChain: undefined,
        topToken: undefined,
        topProtocol: undefined,
      },
    }
  }

  // Skip subgroup projects to avoid double-counting
  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })
  const subgroupProjects = new Set(
    interopProjects.filter((p) => p.interopConfig.subgroupId).map((p) => p.id),
  )
  const {
    flows,
    chainTopTokens,
    chainPairTopTokens,
    chainTopProtocols,
    chainPairTopProtocols,
    chainDurations,
    chainPairDurations,
    chainTokenCounts,
    chainProtocolCounts,
    topToken: topTokenEntry,
    topProtocol: topProtocolEntry,
    tokenIds,
  } = getInteropFlowAggregates(scopedRecords, subgroupProjects)

  const selectedProject =
    params.protocolIds.length === 1
      ? interopProjects.find((p) => p.id === params.protocolIds[0])
      : undefined
  const durationSplit = selectedProject
    ? getDurationSplit(
        selectedProject,
        getRelevantBridgeTypes(selectedProject, undefined),
      )
    : undefined
  const detailsMap = await buildTokensDetailsMap(tokenIds)
  const summaryTokens = getSummaryTokensData(
    scopedRecords.filter(
      (record) => !subgroupProjects.has(record.id as ProjectId),
    ),
    detailsMap,
    interopProjects,
  )

  const protocolDetailsMap = new Map<
    string,
    { slug: string; name: string; iconUrl: string }
  >(
    interopProjects
      .filter((p) => !subgroupProjects.has(p.id))
      .map((p) => [
        p.id,
        {
          slug: p.slug,
          name: p.interopConfig.name ?? p.name,
          iconUrl: manifest.getUrl(`/icons/${p.slug}.png`),
        },
      ]),
  )

  const resolveToken = (entry: TopEntry): FlowToken | undefined => {
    const details = detailsMap.get(entry.id)
    if (!details) return undefined
    return {
      id: entry.id,
      symbol: details.symbol,
      issuer: details.issuer,
      iconUrl: details.iconUrl,
      volume: entry.volume,
    }
  }

  const resolveProtocol = (entry: TopEntry): FlowProtocol | undefined => {
    const details = protocolDetailsMap.get(entry.id)
    if (!details) return undefined
    return {
      id: entry.id,
      slug: details.slug,
      name: details.name,
      iconUrl: details.iconUrl,
      volume: entry.volume,
    }
  }

  const resolvedChainTokens = resolveEntries(chainTopTokens, resolveToken)
  const resolvedChainProtocols = resolveEntries(
    chainTopProtocols,
    resolveProtocol,
  )
  const resolvedPairTokens = resolveEntries(chainPairTopTokens, resolveToken)
  const resolvedPairProtocols = resolveEntries(
    chainPairTopProtocols,
    resolveProtocol,
  )

  const chainPairKeys = new Set([
    ...resolvedPairTokens.keys(),
    ...resolvedPairProtocols.keys(),
    ...chainPairDurations.keys(),
  ])
  const chainPairData: ChainPairData[] = []
  for (const pairKey of chainPairKeys) {
    const [chainA, chainB] = pairKey.split(INTEROP_PAIR_SEPARATOR)

    assert(chainA && chainB, `Invalid pair key: ${pairKey}`)
    chainPairData.push({
      chains: [chainA, chainB],
      topTokens: resolvedPairTokens.get(pairKey) ?? [],
      topProtocols: resolvedPairProtocols.get(pairKey) ?? [],
      avgDuration: resolveAvgDuration(
        chainPairDurations.get(pairKey),
        selectedProject,
        durationSplit,
      ),
    })
  }

  let totalVolume = 0
  let totalTransferCount = 0
  let topFlow: Flow | undefined
  for (const f of flows) {
    totalVolume += f.volume
    totalTransferCount += f.transferCount
    if (!topFlow || f.volume > topFlow.volume) topFlow = f
  }

  const topToken = topTokenEntry ? resolveToken(topTokenEntry) : undefined
  const topProtocol = topProtocolEntry
    ? resolveProtocol(topProtocolEntry)
    : undefined
  const chainData = computeChainsData(
    flows,
    params.chains,
    resolvedChainTokens,
    resolvedChainProtocols,
    chainTokenCounts,
    chainProtocolCounts,
    chainDurations,
    selectedProject,
    durationSplit,
  )

  const topChain = chainData.reduce<ChainData | undefined>((max, chain) => {
    return !max || chain.totalVolume > max.totalVolume ? chain : max
  }, undefined)

  return {
    flows,
    chainData,
    chainPairData,
    stats: {
      totalVolume,
      totalTransferCount,
      activeFlows: flows.length,
      tokenCount: summaryTokens.length,
      topTokens: getTopItems(summaryTokens, 5),
      topRoute: topFlow
        ? {
            srcChain: topFlow.srcChain,
            dstChain: topFlow.dstChain,
            volume: topFlow.volume,
          }
        : undefined,
      topChain: topChain
        ? {
            chainId: topChain.chainId,
            totalVolume: topChain.totalVolume,
          }
        : undefined,
      topToken,
      topProtocol,
    },
  }
}

function resolveAvgDuration(
  duration: DurationData | undefined,
  selectedProject: Project<'interopConfig'> | undefined,
  durationSplit: InteropDurationSplit | undefined,
): AverageDuration | null {
  if (!duration) return null
  if (selectedProject?.interopConfig.transfersTimeMode === 'unknown') {
    return { type: 'unknown' }
  }
  return getAverageDuration(duration, durationSplit)
}

function resolveEntries<T>(
  map: Map<string, TopEntry[]>,
  resolve: (entry: TopEntry) => T | undefined,
): Map<string, T[]> {
  const result = new Map<string, T[]>()
  for (const [key, entries] of map) {
    result.set(key, entries.map(resolve).filter(notUndefined))
  }
  return result
}

function computeChainsData(
  flows: Flow[],
  chainIds: string[],
  chainTopTokens: Map<string, FlowToken[]>,
  chainTopProtocols: Map<string, FlowProtocol[]>,
  chainTokenCounts: Map<string, number>,
  chainProtocolCounts: Map<string, number>,
  chainDurations: Map<string, DurationData>,
  selectedProject: Project<'interopConfig'> | undefined,
  durationSplit: InteropDurationSplit | undefined,
): ChainData[] {
  const chains = new Map<
    string,
    {
      inflow: number
      outflow: number
      transfersIn: number
      transfersOut: number
      connected: Set<string>
    }
  >()

  const getOrCreate = (chainId: string) => {
    let data = chains.get(chainId)
    if (!data) {
      data = {
        inflow: 0,
        outflow: 0,
        transfersIn: 0,
        transfersOut: 0,
        connected: new Set(),
      }
      chains.set(chainId, data)
    }
    return data
  }

  for (const flow of flows) {
    const src = getOrCreate(flow.srcChain)
    src.outflow += flow.volume
    src.transfersOut += flow.transferCount
    src.connected.add(flow.dstChain)

    const dst = getOrCreate(flow.dstChain)
    dst.inflow += flow.volume
    dst.transfersIn += flow.transferCount
    dst.connected.add(flow.srcChain)
  }

  return chainIds.map((chainId) => {
    const data = chains.get(chainId)
    const inflow = data?.inflow ?? 0
    const outflow = data?.outflow ?? 0
    return {
      chainId,
      totalVolume: inflow + outflow,
      netFlow: inflow - outflow,
      inflow,
      outflow,
      transfersIn: data?.transfersIn ?? 0,
      transfersOut: data?.transfersOut ?? 0,
      connectedChains: data?.connected.size ?? 0,
      tokenCount: chainTokenCounts.get(chainId) ?? 0,
      protocolCount: chainProtocolCounts.get(chainId) ?? 0,
      topTokens: chainTopTokens.get(chainId) ?? [],
      topProtocols: chainTopProtocols.get(chainId) ?? [],
      avgDuration: resolveAvgDuration(
        chainDurations.get(chainId),
        selectedProject,
        durationSplit,
      ),
    }
  })
}

function getMockInteropFlows(): InteropFlowsData {
  const chainIds = getInteropChains().map((c) => c.id)

  const flows: Flow[] = []
  for (const srcChain of chainIds) {
    for (const dstChain of chainIds) {
      if (srcChain === dstChain) continue
      flows.push({ srcChain, dstChain, volume: 1_000_000, transferCount: 100 })
    }
  }

  const chainData = computeChainsData(
    flows,
    chainIds,
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    undefined,
    undefined,
  )

  return {
    flows,
    chainData,
    chainPairData: [],
    stats: {
      totalVolume: flows.reduce((sum, f) => sum + f.volume, 0),
      totalTransferCount: flows.reduce((sum, f) => sum + f.transferCount, 0),
      activeFlows: flows.length,
      tokenCount: 2,
      topTokens: {
        items: [
          {
            id: 'eth',
            symbol: 'ETH',
            issuer: 'ethereum',
            iconUrl: '/icons/tokens/ether.png',
            topProtocol: undefined,
            volume: 1_000_000,
            transferCount: 100,
            avgDuration: null,
            avgValue: 10_000,
            minTransferValueUsd: undefined,
            maxTransferValueUsd: undefined,
            netMintedValue: undefined,
            flows: [],
          },
          {
            id: 'usdc',
            symbol: 'USDC',
            issuer: 'circle',
            iconUrl: '/icons/tokens/usdc.png',
            topProtocol: undefined,
            volume: 500_000,
            transferCount: 50,
            avgDuration: null,
            avgValue: 10_000,
            minTransferValueUsd: undefined,
            maxTransferValueUsd: undefined,
            netMintedValue: undefined,
            flows: [],
          },
        ],
        remainingCount: 0,
      },
      topRoute: flows[0]
        ? {
            srcChain: flows[0].srcChain,
            dstChain: flows[0].dstChain,
            volume: flows[0].volume,
          }
        : undefined,
      topChain: chainData[0]
        ? {
            chainId: chainData[0].chainId,
            totalVolume: chainData[0].totalVolume,
          }
        : undefined,
      topToken: {
        id: 'eth',
        symbol: 'ETH',
        issuer: 'ethereum',
        iconUrl: '/icons/tokens/ether.png',
        volume: 1_000_000,
      },
      topProtocol: {
        id: 'layerzero',
        slug: 'layerzero',
        name: 'LayerZero',
        iconUrl: '/icons/layerzero.png',
        volume: 1_000_000,
      },
    },
  }
}
