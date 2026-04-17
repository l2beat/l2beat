import { INTEROP_CHAINS } from '@l2beat/config'
import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import { getInteropTransferValue } from '@l2beat/shared-pure'
import type { InteropProtocol } from '../types'
import {
  getAverageTransferTimeSeconds,
  getProtocolAverageTransferTime,
  hasUnknownTransferTime,
  type ProjectMetadata,
} from './getAverageTransferTime'
import { mergeTransferTypeStats } from './mergeTransferTypeStats'

type CommonInteropData = {
  transferCount: number
  transfersWithDurationCount: number
  totalDurationSum: number
  transferTypeStats: AggregatedInteropTransferRecord['transferTypeStats']
}

type ChainBreakdownAccumulator = {
  id: string
  name: string
  volume: number
} & CommonInteropData

type ProtocolAccumulator = {
  metadata: {
    id: string
    slug: string
    name: string
  }
  project: ProjectMetadata | undefined
  totalVolume: number
  chains: Map<string, ChainBreakdownAccumulator>
} & CommonInteropData

const chainMetadata = new Map(
  INTEROP_CHAINS.map((chain) => [chain.id, { id: chain.id, name: chain.name }]),
)

export function getInteropProtocols(
  records: AggregatedInteropTransferRecord[],
  projects: ProjectMetadata[],
): InteropProtocol[] {
  const projectsMap = new Map(
    projects.map((project) => [project.id.toString(), project]),
  )
  const protocols = new Map<string, ProtocolAccumulator>()

  for (const record of records) {
    const volume = getInteropTransferValue(record) ?? 0
    const protocol =
      protocols.get(record.id) ??
      createProtocolAccumulator(record.id, projectsMap.get(record.id))

    protocol.totalVolume += volume
    accumulateCommon(protocol, record)

    accumulateChain(
      protocol.chains,
      record.srcChain,
      record.srcValueUsd,
      record,
    )
    if (record.dstChain !== record.srcChain) {
      accumulateChain(
        protocol.chains,
        record.dstChain,
        record.dstValueUsd,
        record,
      )
    }

    protocols.set(record.id, protocol)
  }

  return [...protocols.values()]
    .map((protocol) => ({
      id: protocol.metadata.id,
      slug: protocol.metadata.slug,
      name: protocol.metadata.name,
      totalVolume: protocol.totalVolume,
      totalTransferCount: protocol.transferCount,
      avgTransferTime: getProtocolAverageTransferTime(protocol),
      chainsBreakdown: [...protocol.chains.values()]
        .map((chain) => ({
          id: chain.id,
          name: chain.name,
          volume: chain.volume,
          transferCount: chain.transferCount,
          avgTransferTimeSeconds: hasUnknownTransferTime(protocol.project)
            ? null
            : getAverageTransferTimeSeconds(chain),
        }))
        .sort(byVolumeThenName),
    }))
    .sort(
      (a, b) => b.totalVolume - a.totalVolume || a.name.localeCompare(b.name),
    )
}

function createProtocolAccumulator(
  id: string,
  project: ProjectMetadata | undefined,
): ProtocolAccumulator {
  return {
    metadata: {
      id,
      slug: project?.slug ?? id,
      name: project?.interopConfig.name ?? project?.name ?? id,
    },
    project,
    totalVolume: 0,
    transferCount: 0,
    transfersWithDurationCount: 0,
    totalDurationSum: 0,
    transferTypeStats: undefined,
    chains: new Map(),
  }
}

function accumulateChain(
  chains: Map<string, ChainBreakdownAccumulator>,
  chainId: string,
  volume: number | undefined,
  record: AggregatedInteropTransferRecord,
) {
  const chain = chains.get(chainId) ?? createChainAccumulator(chainId)
  chain.volume += volume ?? 0
  accumulateCommon(chain, record)
  chains.set(chainId, chain)
}

function createChainAccumulator(chainId: string): ChainBreakdownAccumulator {
  const metadata = chainMetadata.get(chainId)
  return {
    id: chainId,
    name: metadata?.name ?? chainId,
    volume: 0,
    transferCount: 0,
    transfersWithDurationCount: 0,
    totalDurationSum: 0,
    transferTypeStats: undefined,
  }
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
