import type { Project } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'

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
  records: {
    id: string
    srcChain: string
    dstChain: string
    srcValueUsd: number | null
    dstValueUsd: number | null
    transferCount: number
  }[],
  from: string[],
  to: string[],
  interopProjects: Project<'interopConfig'>[],
): InteropProtocolData[] {
  const map = new Map<string, { volume: number; transfers: number }>()

  for (const record of records) {
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
      protocolName: project?.interopConfig.name ?? project.name,
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
