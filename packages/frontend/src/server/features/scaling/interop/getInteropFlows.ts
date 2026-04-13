import { notUndefined } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import type { InteropFlowsParams } from './types'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getInteropChains } from './utils/getInteropChains'
import { getInteropFlowAggregates } from './utils/getInteropFlowAggregates'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'

export interface FlowToken {
  symbol: string
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
}

export interface ChainPairData {
  chains: [string, string]
  topTokens: FlowToken[]
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
    chainTopTokenEntries,
    chainPairTopTokenEntries,
    topTokenEntry,
    tokenIds,
  } = getInteropFlowAggregates(records, subgroupProjects)

  const detailsMap = await buildTokensDetailsMap(tokenIds)

  const toFlowToken = (entry: { id: string; volume: number }) => {
    const details = detailsMap.get(entry.id)
    if (!details) return undefined

    return {
      symbol: details.symbol,
      iconUrl: details.iconUrl,
      volume: entry.volume,
    }
  }

  const chainPairData: ChainPairData[] = []
  for (const [pairKey, entries] of chainPairTopTokenEntries.entries()) {
    const [chainA, chainB] = pairKey.split('::')
    if (chainA && chainB) {
      chainPairData.push({
        chains: [chainA, chainB],
        topTokens: entries.map(toFlowToken).filter(notUndefined),
      })
    }
  }

  const { totalVolume, totalTransferCount } = flows.reduce(
    (sum, f) => {
      sum.totalVolume += f.volume
      sum.totalTransferCount += f.transferCount
      return sum
    },
    { totalVolume: 0, totalTransferCount: 0 },
  )
  const topFlow = flows.reduce<Flow | undefined>(
    (max, f) => (!max || f.volume > max.volume ? f : max),
    undefined,
  )

  const topToken = topTokenEntry ? toFlowToken(topTokenEntry) : undefined

  return {
    flows,
    chainData: computeChainsData(
      flows,
      params.chains,
      (chainId) =>
        chainTopTokenEntries
          .get(chainId)
          ?.map(toFlowToken)
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
): ChainData[] {
  const inflows = new Map<string, number>()
  const outflows = new Map<string, number>()
  const transfersIn = new Map<string, number>()
  const transfersOut = new Map<string, number>()

  for (const flow of flows) {
    outflows.set(
      flow.srcChain,
      (outflows.get(flow.srcChain) ?? 0) + flow.volume,
    )
    inflows.set(flow.dstChain, (inflows.get(flow.dstChain) ?? 0) + flow.volume)
    transfersOut.set(
      flow.srcChain,
      (transfersOut.get(flow.srcChain) ?? 0) + flow.transferCount,
    )
    transfersIn.set(
      flow.dstChain,
      (transfersIn.get(flow.dstChain) ?? 0) + flow.transferCount,
    )
  }

  // Count connected chains
  const connected = new Map<string, Set<string>>()
  for (const flow of flows) {
    if (!connected.has(flow.srcChain)) connected.set(flow.srcChain, new Set())
    if (!connected.has(flow.dstChain)) connected.set(flow.dstChain, new Set())
    connected.get(flow.srcChain)?.add(flow.dstChain)
    connected.get(flow.dstChain)?.add(flow.srcChain)
  }

  return chainIds.map((chainId) => {
    const inflow = inflows.get(chainId) ?? 0
    const outflow = outflows.get(chainId) ?? 0
    return {
      chainId,
      totalVolume: inflow + outflow,
      netFlow: inflow - outflow,
      inflow: inflows.get(chainId) ?? 0,
      outflow,
      transfersIn: transfersIn.get(chainId) ?? 0,
      transfersOut: transfersOut.get(chainId) ?? 0,
      connectedChains: connected.get(chainId)?.size ?? 0,
      topTokens: getChainTopTokens(chainId),
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
    })
  }

  return {
    flows,
    chainData: computeChainsData(flows, chainIds, (chainId) => {
      const chainVolume = flows
        .filter((f) => f.srcChain === chainId || f.dstChain === chainId)
        .reduce((sum, f) => sum + f.volume, 0)
      return buildMockTopTokens(chainVolume, chainIds.indexOf(chainId))
    }),
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
