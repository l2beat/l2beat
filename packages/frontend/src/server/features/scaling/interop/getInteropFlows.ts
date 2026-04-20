import { assert, notUndefined } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { INTEROP_PAIR_SEPARATOR } from './consts'
import type { InteropFlowsParams } from './types'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getInteropChains } from './utils/getInteropChains'
import type { TopEntry } from './utils/getInteropFlowAggregates'
import { getInteropFlowAggregates } from './utils/getInteropFlowAggregates'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'

export interface FlowToken {
  symbol: string
  iconUrl: string
  volume: number
}

export interface FlowProtocol {
  id: string
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
  topTokens: FlowToken[]
  topProtocols: FlowProtocol[]
}

export interface ChainPairData {
  chains: [string, string]
  topTokens: FlowToken[]
  topProtocols: FlowProtocol[]
}

interface FlowsStats {
  totalVolume: number
  totalTransferCount: number
  activeFlows: number
  topRoute: { srcChain: string; dstChain: string } | undefined
  topChain: FlowChain | undefined
  topToken: FlowToken | undefined
}

export type InteropFlowsData = {
  flows: Flow[]
  chainData: ChainData[]
  chainPairData: ChainPairData[]
  stats: FlowsStats
}

export async function getInteropFlows(
  params: InteropFlowsParams,
): Promise<InteropFlowsData> {
  if (env.MOCK) {
    return getMockInteropFlows()
  }

  const { records } = await getLatestAggregatedInteropTransferWithTokens(
    {
      from: params.chains,
      to: params.chains,
    },
    undefined,
    params.protocolIds,
  )
  if (records.length === 0) {
    return {
      flows: [],
      chainData: [],
      chainPairData: [],
      stats: {
        totalVolume: 0,
        totalTransferCount: 0,
        activeFlows: 0,
        topRoute: undefined,
        topChain: undefined,
        topToken: undefined,
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
    topToken: topTokenEntry,
    tokenIds,
  } = getInteropFlowAggregates(records, subgroupProjects)

  const detailsMap = await buildTokensDetailsMap(tokenIds)

  const protocolDetailsMap = new Map<string, { name: string; iconUrl: string }>(
    interopProjects
      .filter((p) => !subgroupProjects.has(p.id))
      .map((p) => [
        p.id,
        {
          name: p.interopConfig.name ?? p.name,
          iconUrl: manifest.getUrl(`/icons/${p.slug}.png`),
        },
      ]),
  )

  const resolveToken = (entry: TopEntry): FlowToken | undefined => {
    const details = detailsMap.get(entry.id)
    if (!details) return undefined
    return {
      symbol: details.symbol,
      iconUrl: details.iconUrl,
      volume: entry.volume,
    }
  }

  const resolveProtocol = (entry: TopEntry): FlowProtocol | undefined => {
    const details = protocolDetailsMap.get(entry.id)
    if (!details) return undefined
    return {
      id: entry.id,
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

  const chainPairData: ChainPairData[] = []
  for (const [pairKey, topTokens] of resolvedPairTokens) {
    const [chainA, chainB] = pairKey.split(INTEROP_PAIR_SEPARATOR)

    assert(chainA && chainB, `Invalid pair key: ${pairKey}`)
    chainPairData.push({
      chains: [chainA, chainB],
      topTokens,
      topProtocols: resolvedPairProtocols.get(pairKey) ?? [],
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
  const chainData = computeChainsData(
    flows,
    params.chains,
    resolvedChainTokens,
    resolvedChainProtocols,
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
      topRoute: topFlow
        ? { srcChain: topFlow.srcChain, dstChain: topFlow.dstChain }
        : undefined,
      topChain: topChain
        ? {
            chainId: topChain.chainId,
            totalVolume: topChain.totalVolume,
          }
        : undefined,
      topToken,
    },
  }
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
      topTokens: chainTopTokens.get(chainId) ?? [],
      topProtocols: chainTopProtocols.get(chainId) ?? [],
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

  const chainData = computeChainsData(flows, chainIds, new Map(), new Map())

  return {
    flows,
    chainData,
    chainPairData: [],
    stats: {
      totalVolume: flows.reduce((sum, f) => sum + f.volume, 0),
      totalTransferCount: flows.reduce((sum, f) => sum + f.transferCount, 0),
      activeFlows: flows.length,
      topRoute: flows[0]
        ? { srcChain: flows[0].srcChain, dstChain: flows[0].dstChain }
        : undefined,
      topChain: chainData[0]
        ? {
            chainId: chainData[0].chainId,
            totalVolume: chainData[0].totalVolume,
          }
        : undefined,
      topToken: {
        symbol: 'ETH',
        iconUrl: '/icons/tokens/ether.png',
        volume: 1_000_000,
      },
    },
  }
}
