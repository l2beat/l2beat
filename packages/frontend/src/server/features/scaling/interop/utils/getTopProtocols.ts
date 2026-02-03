import type { Project } from '@l2beat/config'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import type { AggregatedInteropTransferWithTokens } from '../types'

export type InteropProtocolData = {
  protocolName: string
  volume: {
    value: number
    share: number
  }
  transfers: {
    value: number
    share: number
  }
}

export function getTopProtocols(
  records: AggregatedInteropTransferWithTokens[],
  interopProjects: Project<'interop'>[],
  subgroupProjects: Set<ProjectId>,
): InteropProtocolData[] {
  const map = new Map<string, { volume: number; transfers: number }>()

  for (const record of records) {
    // Skip projects that are part of other projects to not double count
    if (subgroupProjects.has(record.id as ProjectId)) continue

    const currentVolume = map.get(record.id) ?? { volume: 0, transfers: 0 }
    map.set(record.id, {
      volume:
        currentVolume.volume + (record.srcValueUsd ?? record.dstValueUsd ?? 0),
      transfers: currentVolume.transfers + (record.transferCount ?? 0),
    })
  }

  const totalVolume = Array.from(map.values()).reduce((a, b) => a + b.volume, 0)
  const totalTransfers = Array.from(map.values()).reduce(
    (a, b) => a + b.transfers,
    0,
  )

  return Array.from(map.entries()).map(([key, data]): InteropProtocolData => {
    const project = interopProjects.find((p) => p.id === key)
    assert(project, `Project not found: ${key}`)

    return {
      protocolName: project.interop.name ?? project.name,
      volume: {
        value: data.volume,
        share: totalVolume > 0 ? (data.volume / totalVolume) * 100 : 0,
      },
      transfers: {
        value: data.transfers,
        share: totalTransfers > 0 ? (data.transfers / totalTransfers) * 100 : 0,
      },
    }
  })
}
