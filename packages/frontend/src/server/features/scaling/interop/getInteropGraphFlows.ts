import { getInteropTransferValue, type ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { getDb } from '~/server/database'
import { getAggregatedInteropSnapshotTimestamp } from './utils/getAggregatedInteropTimestamp'
import { getInteropChains } from './utils/getInteropChains'

export type InteropGraphFlowsData = {
  flows: { srcChain: string; dstChain: string; volume: number }[]
  chainVolumes: { chainId: string; totalVolume: number; netFlow: number }[]
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

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })
  const subgroupProjects = new Set(
    interopProjects
      .filter((p) => p.interopConfig.subgroupId)
      .map((p) => p.id),
  )

  // Aggregate volumes by srcChain::dstChain
  const flowMap = new Map<string, number>()
  for (const record of transfers) {
    if (subgroupProjects.has(record.id as ProjectId)) continue
    const key = `${record.srcChain}::${record.dstChain}`
    const current = flowMap.get(key) ?? 0
    flowMap.set(key, current + (getInteropTransferValue(record) ?? 0))
  }

  const flows: InteropGraphFlowsData['flows'] = []
  for (const [key, volume] of flowMap) {
    if (volume <= 0) continue
    const [srcChain, dstChain] = key.split('::')
    if (srcChain && dstChain) {
      flows.push({ srcChain, dstChain, volume })
    }
  }

  // Compute per-chain volumes
  const inflows = new Map<string, number>()
  const outflows = new Map<string, number>()
  for (const flow of flows) {
    outflows.set(flow.srcChain, (outflows.get(flow.srcChain) ?? 0) + flow.volume)
    inflows.set(flow.dstChain, (inflows.get(flow.dstChain) ?? 0) + flow.volume)
  }

  const chainVolumes: InteropGraphFlowsData['chainVolumes'] = chainIds.map(
    (chainId) => {
      const inflow = inflows.get(chainId) ?? 0
      const outflow = outflows.get(chainId) ?? 0
      return {
        chainId,
        totalVolume: inflow + outflow,
        netFlow: inflow - outflow,
      }
    },
  )

  return { flows, chainVolumes }
}

function getMockInteropGraphFlows(): InteropGraphFlowsData {
  const chains = getInteropChains()
  const chainIds = chains.map((c) => c.id)

  const flows: InteropGraphFlowsData['flows'] = []
  for (let i = 0; i < chainIds.length; i++) {
    for (let j = 0; j < chainIds.length; j++) {
      if (i === j) continue
      const src = chainIds[i]!
      const dst = chainIds[j]!
      // Generate varied mock volumes
      const baseVolume = (((i + 1) * (j + 2) * 7_123_456) % 50_000_000) + 500_000
      flows.push({ srcChain: src, dstChain: dst, volume: baseVolume })
    }
  }

  const inflows = new Map<string, number>()
  const outflows = new Map<string, number>()
  for (const flow of flows) {
    outflows.set(flow.srcChain, (outflows.get(flow.srcChain) ?? 0) + flow.volume)
    inflows.set(flow.dstChain, (inflows.get(flow.dstChain) ?? 0) + flow.volume)
  }

  const chainVolumes: InteropGraphFlowsData['chainVolumes'] = chainIds.map(
    (chainId) => {
      const inflow = inflows.get(chainId) ?? 0
      const outflow = outflows.get(chainId) ?? 0
      return {
        chainId,
        totalVolume: inflow + outflow,
        netFlow: inflow - outflow,
      }
    },
  )

  return { flows, chainVolumes }
}
