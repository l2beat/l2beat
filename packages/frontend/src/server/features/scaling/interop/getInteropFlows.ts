import { notUndefined } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
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

  const chainPairData: ChainPairData[] = []
  for (const [pairKey, entries] of chainPairTopTokens) {
    const [chainA, chainB] = pairKey.split('::')
    const protocolEntries = chainPairTopProtocols.get(pairKey) ?? []
    if (chainA && chainB) {
      chainPairData.push({
        chains: [chainA, chainB],
        topTokens: entries.map(resolveToken).filter(notUndefined),
        topProtocols: protocolEntries.map(resolveProtocol).filter(notUndefined),
      })
    }
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

  return {
    flows,
    chainData: computeChainsData(
      flows,
      params.chains,
      (chainId) =>
        chainTopTokens.get(chainId)?.map(resolveToken).filter(notUndefined) ??
        [],
      (chainId) =>
        chainTopProtocols
          .get(chainId)
          ?.map(resolveProtocol)
          .filter(notUndefined) ?? [],
    ),
    chainPairData,
    stats: {
      totalVolume,
      totalTransferCount,
      activeFlows: flows.length,
      topRoute: topFlow
        ? { srcChain: topFlow.srcChain, dstChain: topFlow.dstChain }
        : undefined,
      topToken,
    },
  }
}

function chainPairKey(chainA: string, chainB: string) {
  return chainA < chainB ? `${chainA}::${chainB}` : `${chainB}::${chainA}`
}

function computeChainsData(
  flows: Flow[],
  chainIds: string[],
  getChainTopTokens: (chainId: string) => FlowToken[],
  getChainTopProtocols: (chainId: string) => FlowProtocol[],
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
      topTokens: getChainTopTokens(chainId),
      topProtocols: getChainTopProtocols(chainId),
    }
  })
}

function getMockInteropFlows(): InteropFlowsData {
  const chainIds = getInteropChains().map((c) => c.id)

  const mockTokens: FlowToken[] = [
    { symbol: 'ETH', iconUrl: '/icons/tokens/ether.png', volume: 0 },
    { symbol: 'USDC', iconUrl: '/icons/tokens/usdc.png', volume: 0 },
    { symbol: 'USDT', iconUrl: '/icons/tokens/usdt.png', volume: 0 },
  ]

  const buildMockTopTokens = (volume: number, seed: number): FlowToken[] =>
    mockTokens.map((token, i) => ({
      ...token,
      volume: Math.round((volume * (3 - i)) / (6 + (seed % 3))),
    }))

  // Generate a deterministic mock volume for every chain pair
  const flows: Flow[] = []
  for (let i = 0; i < chainIds.length; i++) {
    for (let j = 0; j < chainIds.length; j++) {
      if (i === j) continue
      const volume = (((i + 1) * (j + 2) * 7_123_456) % 50_000_000) + 500_000
      const transferCount = Math.round(volume / 1250) // ~$1250 avg transfer
      const srcChain = chainIds[i]
      const dstChain = chainIds[j]
      if (srcChain && dstChain)
        flows.push({ srcChain, dstChain, volume, transferCount })
    }
  }

  const totalVolume = flows.reduce((sum, f) => sum + f.volume, 0)
  const totalTransferCount = flows.length * 150 // deterministic mock count
  const topFlow = flows.reduce<Flow | undefined>(
    (max, f) => (!max || f.volume > max.volume ? f : max),
    undefined,
  )

  const chainPairData: ChainPairData[] = []
  const seenPairs = new Set<string>()
  for (const flow of flows) {
    const key = chainPairKey(flow.srcChain, flow.dstChain)
    if (seenPairs.has(key)) continue
    seenPairs.add(key)
    const pairVolume = flows
      .filter((f) => chainPairKey(f.srcChain, f.dstChain) === key)
      .reduce((sum, f) => sum + f.volume, 0)
    const [chainA, chainB] = key.split('::') as [string, string]
    chainPairData.push({
      chains: [chainA, chainB],
      topTokens: buildMockTopTokens(
        pairVolume,
        chainIds.indexOf(chainA) + chainIds.indexOf(chainB),
      ),
      topProtocols: [],
    })
  }

  return {
    flows,
    chainData: computeChainsData(
      flows,
      chainIds,
      (chainId) => {
        const chainVolume = flows
          .filter((f) => f.srcChain === chainId || f.dstChain === chainId)
          .reduce((sum, f) => sum + f.volume, 0)
        return buildMockTopTokens(chainVolume, chainIds.indexOf(chainId))
      },
      () => [],
    ),
    chainPairData,
    stats: {
      totalVolume,
      totalTransferCount: totalTransferCount,
      activeFlows: flows.length,
      topRoute: topFlow
        ? { srcChain: topFlow.srcChain, dstChain: topFlow.dstChain }
        : undefined,
      topToken: {
        symbol: 'ETH',
        iconUrl: '/icons/tokens/ether.png',
        volume: 253_700_000,
      },
    },
  }
}
