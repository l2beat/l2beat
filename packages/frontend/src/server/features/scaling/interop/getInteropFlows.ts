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
}

interface ChainVolume {
  chainId: string
  totalVolume: number
  netFlow: number
}

interface FlowsStats {
  totalVolume: number
  numberOfTransactions: number
  activeFlows: number
  topRoute: { srcChain: string; dstChain: string } | undefined
}

export type InteropFlowsData = {
  flows: Flow[]
  chainVolumes: ChainVolume[]
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
      chainVolumes: [],
      stats: {
        totalVolume: 0,
        numberOfTransactions: 0,
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

  // Skip subgroup projects to avoid double-counting (same pattern as getInteropDashboardData)
  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })
  const subgroupProjects = new Set(
    interopProjects.filter((p) => p.interopConfig.subgroupId).map((p) => p.id),
  )

  // Aggregate transfer volumes and counts by srcChain::dstChain pair
  const flowMap = new Map<string, number>()
  let totalTransferCount = 0
  for (const record of transfers) {
    if (subgroupProjects.has(record.id as ProjectId)) continue
    totalTransferCount += record.transferCount
    const key = `${record.srcChain}::${record.dstChain}`
    flowMap.set(
      key,
      (flowMap.get(key) ?? 0) + (getInteropTransferValue(record) ?? 0),
    )
  }

  const flows: Flow[] = []
  for (const [key, volume] of flowMap) {
    if (volume <= 0) continue
    const [srcChain, dstChain] = key.split('::')
    if (srcChain && dstChain) {
      flows.push({ srcChain, dstChain, volume })
    }
  }

  const totalVolume = flows.reduce((sum, f) => sum + f.volume, 0)
  const topFlow = flows.reduce<Flow | undefined>(
    (max, f) => (!max || f.volume > max.volume ? f : max),
    undefined,
  )

  return {
    flows,
    chainVolumes: computeChainVolumes(flows, params.chains),
    stats: {
      totalVolume,
      numberOfTransactions: totalTransferCount,
      activeFlows: flows.length,
      topRoute: topFlow
        ? { srcChain: topFlow.srcChain, dstChain: topFlow.dstChain }
        : undefined,
    },
  }
}

function computeChainVolumes(flows: Flow[], chainIds: string[]): ChainVolume[] {
  const inflows = new Map<string, number>()
  const outflows = new Map<string, number>()
  for (const flow of flows) {
    outflows.set(
      flow.srcChain,
      (outflows.get(flow.srcChain) ?? 0) + flow.volume,
    )
    inflows.set(flow.dstChain, (inflows.get(flow.dstChain) ?? 0) + flow.volume)
  }

  return chainIds.map((chainId) => {
    const inflow = inflows.get(chainId) ?? 0
    const outflow = outflows.get(chainId) ?? 0
    return {
      chainId,
      totalVolume: inflow + outflow,
      netFlow: inflow - outflow,
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
      const srcChain = chainIds[i]
      const dstChain = chainIds[j]
      if (srcChain && dstChain) flows.push({ srcChain, dstChain, volume })
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
    chainVolumes: computeChainVolumes(flows, chainIds),
    stats: {
      totalVolume,
      numberOfTransactions: totalTransferCount,
      activeFlows: flows.length,
      topRoute: topFlow
        ? { srcChain: topFlow.srcChain, dstChain: topFlow.dstChain }
        : undefined,
    },
  }
}
