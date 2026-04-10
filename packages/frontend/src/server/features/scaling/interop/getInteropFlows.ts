import { getInteropTransferValue, type ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import type { InteropFlowsParams } from './types'
import { getAggregatedInteropSnapshotTimestamp } from './utils/getAggregatedInteropTimestamp'
import { getInteropChains } from './utils/getInteropChains'

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
}

interface FlowsStats {
  totalVolume: number
  totalTransferCount: number
  activeFlows: number
  topRoute: { srcChain: string; dstChain: string } | undefined
}

export type InteropFlowsData = {
  flows: Flow[]
  chainData: ChainData[]
  stats: FlowsStats
}

export async function getInteropFlows(
  params: InteropFlowsParams,
): Promise<InteropFlowsData> {
  if (env.MOCK) {
    return getMockInteropFlows()
  }

  const snapshotTimestamp = await getAggregatedInteropSnapshotTimestamp()
  if (!snapshotTimestamp || params.chains.length === 0) {
    return {
      flows: [],
      chainData: [],
      stats: {
        totalVolume: 0,
        totalTransferCount: 0,
        activeFlows: 0,
        topRoute: undefined,
      },
    }
  }

  const db = getDb()
  const transfers = await db.aggregatedInteropTransfer.getByChainsAndTimestamp(
    snapshotTimestamp,
    params.chains,
    params.chains,
  )

  // Skip subgroup projects to avoid double-counting
  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })
  const subgroupProjects = new Set(
    interopProjects.filter((p) => p.interopConfig.subgroupId).map((p) => p.id),
  )

  // Aggregate transfer volumes and counts by srcChain::dstChain pair
  const flowDataMap = new Map<
    string,
    { volume: number; transferCount: number }
  >()
  for (const record of transfers) {
    if (subgroupProjects.has(record.id as ProjectId)) continue
    const key = `${record.srcChain}::${record.dstChain}`
    const current = flowDataMap.get(key) ?? { volume: 0, transferCount: 0 }
    flowDataMap.set(key, {
      volume: current.volume + (getInteropTransferValue(record) ?? 0),
      transferCount: current.transferCount + record.transferCount,
    })
  }

  const flows: Flow[] = []
  for (const [key, { volume, transferCount }] of flowDataMap.entries()) {
    if (volume <= 0) continue
    const [srcChain, dstChain] = key.split('::')
    if (srcChain && dstChain) {
      flows.push({
        srcChain,
        dstChain,
        volume,
        transferCount,
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

  return {
    flows,
    chainData: computeChainsData(flows, params.chains),
    stats: {
      totalVolume,
      totalTransferCount,
      activeFlows: flows.length,
      topRoute: topFlow
        ? { srcChain: topFlow.srcChain, dstChain: topFlow.dstChain }
        : undefined,
    },
  }
}

function computeChainsData(flows: Flow[], chainIds: string[]): ChainData[] {
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
    }
  })
}

function getMockInteropFlows(): InteropFlowsData {
  const chainIds = getInteropChains().map((c) => c.id)

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

  return {
    flows,
    chainData: computeChainsData(flows, chainIds),
    stats: {
      totalVolume,
      totalTransferCount: totalTransferCount,
      activeFlows: flows.length,
      topRoute: topFlow
        ? { srcChain: topFlow.srcChain, dstChain: topFlow.dstChain }
        : undefined,
    },
  }
}
