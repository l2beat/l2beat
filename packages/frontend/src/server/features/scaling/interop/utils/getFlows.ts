import { assert, type ProjectId } from '@l2beat/shared-pure'
import type { AggregatedInteropTransferWithTokens } from '../types'

export type InteropFlowData = {
  srcChain: string
  dstChain: string
  volume: number
}

export function getFlows(
  records: AggregatedInteropTransferWithTokens[],
  subgroupProjects: Set<ProjectId>,
): InteropFlowData[] {
  const map = new Map<string, number>()

  for (const record of records) {
    // Skip projects that are part of other projects to not double count
    if (subgroupProjects.has(record.id as ProjectId)) continue

    const key = `${record.srcChain}::${record.dstChain}`
    const current = map.get(key) ?? 0
    map.set(key, current + (record.srcValueUsd ?? record.dstValueUsd ?? 0))
  }

  return Array.from(map.entries())
    .toSorted((a, b) => b[1] - a[1])
    .map(([key, volume]): InteropFlowData => {
      const [srcChain, dstChain] = key.split('::')
      assert(srcChain && dstChain)

      return { srcChain, dstChain, volume }
    })
}
