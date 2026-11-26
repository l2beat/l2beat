import type { Project } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { InteropTransferWithTokens } from '../types'
import {
  getInteropProtocolDisplay,
  type InteropProtocolDisplay,
} from './getInteropProtocolDisplay'
import { getInteropTransferRecordValue } from './getInteropTransferRecordValue'

export type InteropProtocolData = InteropProtocolDisplay & {
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
  records: InteropTransferWithTokens[],
  interopProjects: Project<'interopConfig'>[],
  subgroupProjects: Set<ProjectId>,
): InteropProtocolData[] {
  const map = new Map<string, { volume: number; transfers: number }>()

  for (const record of records) {
    // Skip projects that are part of other projects to not double count
    if (subgroupProjects.has(record.id as ProjectId)) continue

    const currentVolume = map.get(record.id) ?? { volume: 0, transfers: 0 }
    map.set(record.id, {
      volume:
        currentVolume.volume + (getInteropTransferRecordValue(record) ?? 0),
      transfers: currentVolume.transfers + (record.transferCount ?? 0),
    })
  }

  const totalVolume = Array.from(map.values()).reduce((a, b) => a + b.volume, 0)
  const totalTransfers = Array.from(map.values()).reduce(
    (a, b) => a + b.transfers,
    0,
  )

  return Array.from(map.entries()).map(([key, data]): InteropProtocolData => {
    return {
      ...getInteropProtocolDisplay(key, interopProjects),
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
