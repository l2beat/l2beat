import { INTEROP_CHAINS } from '@l2beat/config'
import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import type { InteropChain } from '../types'
import {
  getAverageTransferTimeSeconds,
  type ProjectMetadata,
} from './getAverageTransferTime'
import { mergeTransferTypeStats } from './mergeTransferTypeStats'

type CommonInteropData = {
  transferCount: number
  transfersWithDurationCount: number
  totalDurationSum: number
  transferTypeStats: AggregatedInteropTransferRecord['transferTypeStats']
}

type ProtocolBreakdownAccumulator = {
  id: string
  slug: string
  name: string
  volume: number
  transferCount: number
}

type ChainAccumulator = {
  id: string
  name: string
  inflowsUsd: number
  outflowsUsd: number
  protocols: Map<string, ProtocolBreakdownAccumulator>
} & CommonInteropData

const chainMetadata = new Map(
  INTEROP_CHAINS.map((chain) => [chain.id, { id: chain.id, name: chain.name }]),
)

export function getInteropChains(
  records: AggregatedInteropTransferRecord[],
  projects: ProjectMetadata[],
): InteropChain[] {
  const projectsMap = new Map(
    projects.map((project) => [project.id.toString(), project]),
  )
  const subgroupProjects = new Set(
    projects
      .filter((project) => project.interopConfig.subgroupId !== undefined)
      .map((project) => project.id.toString()),
  )
  const chains = new Map<string, ChainAccumulator>()

  for (const record of records) {
    if (subgroupProjects.has(record.id)) {
      continue
    }

    accumulateChain(chains, record.srcChain, 'outflow', record, projectsMap)
    if (record.dstChain !== record.srcChain) {
      accumulateChain(chains, record.dstChain, 'inflow', record, projectsMap)
    }
  }

  return [...chains.values()]
    .map((chain) => ({
      id: chain.id,
      name: chain.name,
      totalVolume: chain.inflowsUsd + chain.outflowsUsd,
      totalTransferCount: chain.transferCount,
      inflowsUsd: chain.inflowsUsd,
      outflowsUsd: chain.outflowsUsd,
      avgTransferTimeSeconds: getAverageTransferTimeSeconds(chain),
      protocolsBreakdown: [...chain.protocols.values()].sort(byVolumeThenName),
    }))
    .sort(
      (a, b) => b.totalVolume - a.totalVolume || a.name.localeCompare(b.name),
    )
}

function accumulateChain(
  chains: Map<string, ChainAccumulator>,
  chainId: string,
  direction: 'inflow' | 'outflow',
  record: AggregatedInteropTransferRecord,
  projectsMap: Map<string, ProjectMetadata>,
) {
  const metadata = chainMetadata.get(chainId)
  const chain = chains.get(chainId) ?? {
    id: chainId,
    name: metadata?.name ?? chainId,
    inflowsUsd: 0,
    outflowsUsd: 0,
    transferCount: 0,
    transfersWithDurationCount: 0,
    totalDurationSum: 0,
    transferTypeStats: undefined,
    protocols: new Map<string, ProtocolBreakdownAccumulator>(),
  }

  if (direction === 'inflow') {
    chain.inflowsUsd += record.dstValueUsd ?? 0
  } else {
    chain.outflowsUsd += record.srcValueUsd ?? 0
  }

  accumulateCommon(chain, record)

  const project = projectsMap.get(record.id)
  const protocol = chain.protocols.get(record.id) ?? {
    id: record.id,
    slug: project?.slug ?? record.id,
    name: project?.interopConfig.name ?? project?.name ?? record.id,
    volume: 0,
    transferCount: 0,
  }

  protocol.volume +=
    direction === 'inflow'
      ? (record.dstValueUsd ?? 0)
      : (record.srcValueUsd ?? 0)
  protocol.transferCount += record.transferCount
  chain.protocols.set(record.id, protocol)
  chains.set(chainId, chain)
}

function accumulateCommon(
  accumulator: CommonInteropData,
  record: AggregatedInteropTransferRecord,
) {
  accumulator.transferCount += record.transferCount
  accumulator.transfersWithDurationCount += record.transfersWithDurationCount
  accumulator.totalDurationSum += record.totalDurationSum
  accumulator.transferTypeStats = mergeTransferTypeStats(
    accumulator.transferTypeStats,
    record.transferTypeStats,
  )
}

function byVolumeThenName<T extends { name: string; volume: number }>(
  a: T,
  b: T,
) {
  return b.volume - a.volume || a.name.localeCompare(b.name)
}
