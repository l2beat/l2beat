import { getInteropTransferValue, type ProjectId } from '@l2beat/shared-pure'
import { INTEROP_PAIR_SEPARATOR } from '../consts'
import type { AggregatedInteropTransferWithTokens } from '../types'

export interface TopEntry {
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
  chainTopTokens: Map<string, TopEntry[]>
  chainPairTopTokens: Map<string, TopEntry[]>
  chainTopProtocols: Map<string, TopEntry[]>
  chainPairTopProtocols: Map<string, TopEntry[]>
  topToken: TopEntry | undefined
  tokenIds: string[]
}

export function getInteropFlowAggregates(
  records: AggregatedInteropTransferWithTokens[],
  subgroupProjects: Set<ProjectId>,
): InteropFlowAggregates {
  const flowMap = new Map<string, { volume: number; transferCount: number }>()
  const chainTokens = new GroupedVolumes()
  const pairTokens = new GroupedVolumes()
  const globalTokens = new Map<string, number>()
  const chainProtocols = new GroupedVolumes()
  const pairProtocols = new GroupedVolumes()

  for (const record of records) {
    if (subgroupProjects.has(record.id as ProjectId)) continue

    const volume = getInteropTransferValue(record) ?? 0
    const pairKey = chainPairKey(record.srcChain, record.dstChain)
    const flowKey = `${record.srcChain}${INTEROP_PAIR_SEPARATOR}${record.dstChain}`

    // Flows
    const flow = flowMap.get(flowKey) ?? { volume: 0, transferCount: 0 }
    flow.volume += volume
    flow.transferCount += record.transferCount
    flowMap.set(flowKey, flow)

    // Token volumes: by chain, by pair, and global
    for (const token of record.tokens) {
      chainTokens.add(record.srcChain, token.abstractTokenId, token.volume)
      chainTokens.add(record.dstChain, token.abstractTokenId, token.volume)
      pairTokens.add(pairKey, token.abstractTokenId, token.volume)
      globalTokens.set(
        token.abstractTokenId,
        (globalTokens.get(token.abstractTokenId) ?? 0) + token.volume,
      )
    }

    // Protocol volumes: by chain and by pair
    chainProtocols.add(record.srcChain, record.id, volume)
    chainProtocols.add(record.dstChain, record.id, volume)
    pairProtocols.add(pairKey, record.id, volume)
  }

  const chainTopTokens = chainTokens.topByGroup(3)
  const chainPairTopTokens = pairTokens.topByGroup(3)
  const topToken = topEntries(globalTokens, 3)[0]

  return {
    flows: toFlows(flowMap),
    chainTopTokens,
    chainPairTopTokens,
    chainTopProtocols: chainProtocols.topByGroup(3),
    chainPairTopProtocols: pairProtocols.topByGroup(3),
    topToken,
    tokenIds: collectTopTokenIds(chainTopTokens, chainPairTopTokens, topToken),
  }
}

/** Tracks volumes keyed by (group, entryId) — e.g. (chainId, tokenId) → volume */
class GroupedVolumes {
  private groups = new Map<string, Map<string, number>>()

  add(group: string, entryId: string, volume: number) {
    let map = this.groups.get(group)
    if (!map) {
      map = new Map()
      this.groups.set(group, map)
    }
    map.set(entryId, (map.get(entryId) ?? 0) + volume)
  }

  topByGroup(n: number): Map<string, TopEntry[]> {
    const result = new Map<string, TopEntry[]>()
    for (const [group, volumes] of this.groups) {
      result.set(group, topEntries(volumes, n))
    }
    return result
  }
}

function topEntries(volumeMap: Map<string, number>, n: number): TopEntry[] {
  return Array.from(volumeMap.entries())
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id, volume]) => ({ id, volume }))
}

function toFlows(
  flowMap: Map<string, { volume: number; transferCount: number }>,
): InteropFlowAggregate[] {
  const flows: InteropFlowAggregate[] = []
  for (const [key, { volume, transferCount }] of flowMap) {
    if (volume <= 0) continue
    const [srcChain, dstChain] = key.split(INTEROP_PAIR_SEPARATOR)
    if (srcChain && dstChain)
      flows.push({ srcChain, dstChain, volume, transferCount })
  }
  return flows
}

function chainPairKey(chainA: string, chainB: string) {
  return chainA < chainB
    ? `${chainA}${INTEROP_PAIR_SEPARATOR}${chainB}`
    : `${chainB}${INTEROP_PAIR_SEPARATOR}${chainA}`
}

function collectTopTokenIds(
  chainTopTokens: Map<string, TopEntry[]>,
  pairTopTokens: Map<string, TopEntry[]>,
  topToken: TopEntry | undefined,
): string[] {
  const ids = new Set<string>()
  for (const entries of chainTopTokens.values()) {
    for (const e of entries) ids.add(e.id)
  }
  for (const entries of pairTopTokens.values()) {
    for (const e of entries) ids.add(e.id)
  }
  if (topToken) ids.add(topToken.id)
  return [...ids]
}
