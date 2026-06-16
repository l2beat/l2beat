import type { ProjectId } from '@l2beat/shared-pure'
import { INTEROP_PAIR_SEPARATOR } from '../consts'
import type { InteropSelectionInput, InteropTransferWithTokens } from '../types'
import { getInteropTransferRecordValue } from './getInteropTransferRecordValue'

export type InteropFlowData = {
  srcChain: string
  dstChain: string
  volume: number
  transferCount?: number
}

export function getFlows(
  records: InteropTransferWithTokens[],
  selection: InteropSelectionInput,
  subgroupProjects?: Set<ProjectId>,
): InteropFlowData[] {
  const volumeMap = new Map<string, number>()
  const transferMap = new Map<string, number>()

  for (const record of records) {
    // Skip projects that are part of other projects to not double count
    if (subgroupProjects?.has(record.id as ProjectId)) continue

    const key = `${record.srcChain}${INTEROP_PAIR_SEPARATOR}${record.dstChain}`
    volumeMap.set(
      key,
      (volumeMap.get(key) ?? 0) + (getInteropTransferRecordValue(record) ?? 0),
    )
    transferMap.set(key, (transferMap.get(key) ?? 0) + record.transferCount)
  }

  const sortedFlows = flowsMapToSorted(volumeMap, selection)

  if (sortedFlows.every((flow) => flow.volume === 0)) {
    return []
  }

  return sortedFlows.map((flow) => ({
    ...flow,
    transferCount: transferMap.get(toFlowKey(flow.srcChain, flow.dstChain)),
  }))
}

export function flowsMapToSorted(
  volumes: Map<string, number>,
  selection: InteropSelectionInput,
): InteropFlowData[] {
  const selectedPairs = getSelectedFlowPairs(selection)
  return selectedPairs
    .map(({ srcChain, dstChain }) => {
      const key = toFlowKey(srcChain, dstChain)
      return {
        srcChain,
        dstChain,
        volume: volumes.get(key) ?? 0,
      }
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
  return `${srcChain}${INTEROP_PAIR_SEPARATOR}${dstChain}`
}
