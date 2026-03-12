import { getInteropTransferValue, type ProjectId } from '@l2beat/shared-pure'
import type {
  AggregatedInteropTransferWithTokens,
  InteropSelectionInput,
} from '../types'

export type InteropFlowData = {
  srcChain: string
  dstChain: string
  volume: number
}

export function getFlows(
  records: AggregatedInteropTransferWithTokens[],
  selection: InteropSelectionInput,
  subgroupProjects?: Set<ProjectId>,
): InteropFlowData[] {
  const map = new Map<string, number>()

  for (const record of records) {
    // Skip projects that are part of other projects to not double count
    if (subgroupProjects?.has(record.id as ProjectId)) continue

    const key = `${record.srcChain}::${record.dstChain}`
    const current = map.get(key) ?? 0
    map.set(key, current + (getInteropTransferValue(record) ?? 0))
  }

  const sortedFlows = flowsMapToSorted(map, selection)

  if (sortedFlows.every((flow) => flow.volume === 0)) {
    return []
  }

  return sortedFlows
}

export function flowsMapToSorted(
  flows: Map<string, number>,
  selection: InteropSelectionInput,
): InteropFlowData[] {
  const selectedPairs = getSelectedFlowPairs(selection)
  return selectedPairs
    .map(({ srcChain, dstChain }) => {
      const volume = flows.get(toFlowKey(srcChain, dstChain)) ?? 0
      return { srcChain, dstChain, volume }
    })
    .toSorted((a, b) => b.volume - a.volume)
}

function getSelectedFlowPairs(
  selection: InteropSelectionInput | undefined,
): Pick<InteropFlowData, 'srcChain' | 'dstChain'>[] {
  if (!selection) {
    return []
  }

  const seen = new Set<string>()
  const pairs: Pick<InteropFlowData, 'srcChain' | 'dstChain'>[] = []

  for (const srcChain of selection.from) {
    for (const dstChain of selection.to) {
      if (srcChain === dstChain) {
        continue
      }

      const key = toFlowKey(srcChain, dstChain)
      if (seen.has(key)) {
        continue
      }

      seen.add(key)
      pairs.push({ srcChain, dstChain })
    }
  }

  return pairs
}

function toFlowKey(srcChain: string, dstChain: string) {
  return `${srcChain}::${dstChain}`
}
