import { getInteropTransferValue, type ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { getDb } from '~/server/database'
import { getAggregatedInteropSnapshotTimestamp } from './utils/getAggregatedInteropTimestamp'
import { getInteropChains } from './utils/getInteropChains'

interface Flow {
  srcChain: string
  dstChain: string
  volume: number
}

interface ChainVolume {
  chainId: string
  /** Sum of all inflows + outflows for this chain */
  totalVolume: number
  /** Inflows minus outflows — positive means net receiver */
  netFlow: number
}

export type InteropGraphFlowsData = {
  flows: Flow[]
  chainVolumes: ChainVolume[]
}

export async function getInteropGraphFlows(): Promise<InteropGraphFlowsData> {
  if (env.MOCK) {
    return getMockInteropGraphFlows()
  }

  const interopChains = getInteropChains()
  const chainIds = interopChains.map((c) => c.id)

  const snapshotTimestamp = await getAggregatedInteropSnapshotTimestamp()
  if (!snapshotTimestamp || chainIds.length === 0) {
    return { flows: [], chainVolumes: [] }
  }

  const db = getDb()
  const transfers = await db.aggregatedInteropTransfer.getByChainsAndTimestamp(
    snapshotTimestamp,
    chainIds,
    chainIds,
  )

  // Skip subgroup projects to avoid double-counting (same pattern as getInteropDashboardData)
  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })
  const subgroupProjects = new Set(
    interopProjects
      .filter((p) => p.interopConfig.subgroupId)
      .map((p) => p.id),
  )

  // Aggregate transfer volumes by srcChain::dstChain pair
  const flowMap = new Map<string, number>()
  for (const record of transfers) {
    if (subgroupProjects.has(record.id as ProjectId)) continue
    const key = `${record.srcChain}::${record.dstChain}`
    flowMap.set(key, (flowMap.get(key) ?? 0) + (getInteropTransferValue(record) ?? 0))
  }

  const flows: Flow[] = []
  for (const [key, volume] of flowMap) {
    if (volume <= 0) continue
    const [srcChain, dstChain] = key.split('::')
    if (srcChain && dstChain) {
      flows.push({ srcChain, dstChain, volume })
    }
  }

  return { flows, chainVolumes: computeChainVolumes(flows, chainIds) }
}

/** Derives per-chain totalVolume and netFlow from the list of directional flows. */
function computeChainVolumes(flows: Flow[], chainIds: string[]): ChainVolume[] {
  const inflows = new Map<string, number>()
  const outflows = new Map<string, number>()
  for (const flow of flows) {
    outflows.set(flow.srcChain, (outflows.get(flow.srcChain) ?? 0) + flow.volume)
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

function getMockInteropGraphFlows(): InteropGraphFlowsData {
  const chainIds = getInteropChains().map((c) => c.id)

  // Generate a deterministic mock volume for every chain pair
  const flows: Flow[] = []
  for (let i = 0; i < chainIds.length; i++) {
    for (let j = 0; j < chainIds.length; j++) {
      if (i === j) continue
      const volume = (((i + 1) * (j + 2) * 7_123_456) % 50_000_000) + 500_000
      flows.push({ srcChain: chainIds[i]!, dstChain: chainIds[j]!, volume })
    }
  }

  return { flows, chainVolumes: computeChainVolumes(flows, chainIds) }
}
