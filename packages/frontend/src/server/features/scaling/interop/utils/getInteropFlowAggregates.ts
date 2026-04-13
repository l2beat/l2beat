import { getInteropTransferValue, type ProjectId } from '@l2beat/shared-pure'
import type { AggregatedInteropTransferWithTokens } from '../types'

interface FlowData {
  volume: number
  transferCount: number
}

export interface TopTokenEntry {
  id: string
  volume: number
}

export interface InteropFlowAggregate {
  srcChain: string
  dstChain: string
  volume: number
  transferCount: number
}

export interface InteropFlowAggregates {
  flows: InteropFlowAggregate[]
  chainTopTokenEntries: Map<string, TopTokenEntry[]>
  chainPairTopTokenEntries: Map<string, TopTokenEntry[]>
  topTokenEntry: TopTokenEntry | undefined
  tokenIds: string[]
}

export function getInteropFlowAggregates(
  records: AggregatedInteropTransferWithTokens[],
  subgroupProjects: Set<ProjectId>,
): InteropFlowAggregates {
  const flowDataMap = new Map<string, FlowData>()
  const chainTokenVolumeMap = new Map<string, Map<string, number>>()
  const chainPairTokenVolumeMap = new Map<string, Map<string, number>>()
  const tokenVolumeMap = new Map<string, number>()

  for (const record of records) {
    if (subgroupProjects.has(record.id as ProjectId)) continue

    accumulateFlowData(flowDataMap, record)
    accumulateTokenVolumesForKey(
      chainTokenVolumeMap,
      record.srcChain,
      record.tokens,
    )
    accumulateTokenVolumesForKey(
      chainTokenVolumeMap,
      record.dstChain,
      record.tokens,
    )
    accumulateTokenVolumesForKey(
      chainPairTokenVolumeMap,
      chainPairKey(record.srcChain, record.dstChain),
      record.tokens,
    )

    for (const token of record.tokens) {
      tokenVolumeMap.set(
        token.abstractTokenId,
        (tokenVolumeMap.get(token.abstractTokenId) ?? 0) + token.volume,
      )
    }
  }

  const chainTopTokenEntries = pickTopTokensByKey(chainTokenVolumeMap)
  const chainPairTopTokenEntries = pickTopTokensByKey(chainPairTokenVolumeMap)
  const topTokenEntry = pickTopTokens(tokenVolumeMap)[0]

  return {
    flows: toFlows(flowDataMap),
    chainTopTokenEntries,
    chainPairTopTokenEntries,
    topTokenEntry,
    tokenIds: collectTopTokenIds(
      chainTopTokenEntries,
      chainPairTopTokenEntries,
      topTokenEntry,
    ),
  }
}

function accumulateFlowData(
  flowDataMap: Map<string, FlowData>,
  record: AggregatedInteropTransferWithTokens,
) {
  const flowKey = `${record.srcChain}::${record.dstChain}`
  const current = flowDataMap.get(flowKey) ?? { volume: 0, transferCount: 0 }

  current.volume += getInteropTransferValue(record) ?? 0
  current.transferCount += record.transferCount

  flowDataMap.set(flowKey, current)
}

function accumulateTokenVolumesForKey(
  groupedTokenVolumeMap: Map<string, Map<string, number>>,
  key: string,
  tokens: AggregatedInteropTransferWithTokens['tokens'],
) {
  const tokenVolumeMap = groupedTokenVolumeMap.get(key) ?? new Map()
  for (const token of tokens) {
    tokenVolumeMap.set(
      token.abstractTokenId,
      (tokenVolumeMap.get(token.abstractTokenId) ?? 0) + token.volume,
    )
  }
  groupedTokenVolumeMap.set(key, tokenVolumeMap)
}

function pickTopTokensByKey(tokenVolumeMaps: Map<string, Map<string, number>>) {
  const result = new Map<string, TopTokenEntry[]>()

  for (const [key, volumeMap] of tokenVolumeMaps.entries()) {
    result.set(key, pickTopTokens(volumeMap))
  }

  return result
}

function collectTopTokenIds(
  chainTopTokenEntries: Map<string, TopTokenEntry[]>,
  chainPairTopTokenEntries: Map<string, TopTokenEntry[]>,
  topTokenEntry: TopTokenEntry | undefined,
) {
  const ids = new Set<string>()

  for (const entries of chainTopTokenEntries.values()) {
    for (const entry of entries) {
      ids.add(entry.id)
    }
  }

  for (const entries of chainPairTopTokenEntries.values()) {
    for (const entry of entries) {
      ids.add(entry.id)
    }
  }

  if (topTokenEntry) {
    ids.add(topTokenEntry.id)
  }

  return [...ids]
}

function toFlows(flowDataMap: Map<string, FlowData>): InteropFlowAggregate[] {
  const flows: InteropFlowAggregate[] = []

  for (const [key, { volume, transferCount }] of flowDataMap.entries()) {
    if (volume <= 0) continue

    const [srcChain, dstChain] = key.split('::')
    if (!srcChain || !dstChain) continue

    flows.push({ srcChain, dstChain, volume, transferCount })
  }

  return flows
}

function chainPairKey(chainA: string, chainB: string) {
  return chainA < chainB ? `${chainA}::${chainB}` : `${chainB}::${chainA}`
}

function pickTopTokens(volumeMap: Map<string, number>) {
  return Array.from(volumeMap.entries())
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, volume]) => ({ id, volume }))
}
