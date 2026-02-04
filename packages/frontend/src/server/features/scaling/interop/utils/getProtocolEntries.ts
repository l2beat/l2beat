import type { InteropDurationSplit, Project } from '@l2beat/config'
import { assert, type InteropBridgeType } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'
import type { AggregatedInteropTransferWithTokens } from '../types'
import { getProtocolsDataMap } from './getProtocolsDataMap'
import {
  type ChainData,
  type DurationSplit,
  getAverageDuration,
  getChainsData,
  getTokensData,
  type TokenData,
} from './interopEntriesCommon'
import {
  makeProtocolEntriesKey,
  parseProtocolEntriesKey,
} from './protocolEntriesKey'

export type ProtocolEntry = {
  id: string
  iconUrl: string
  protocolName: string
  isAggregate?: boolean
  subgroup?: {
    name: string
    iconUrl: string
  }
  bridgeType: InteropBridgeType
  volume: number
  tokens: TokenData[]
  chains: ChainData[]
  transferCount: number
  averageValue: number
  averageDuration: { type: 'single'; duration: number } | DurationSplit
  averageValueInFlight?: number
}

export function getProtocolEntries(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  interopProjects: Project<'interopConfig'>[],
): ProtocolEntry[] {
  const durationSplitMap = new Map<string, InteropDurationSplit>()
  for (const project of interopProjects) {
    for (const [bridgeType, durationSplit] of Object.entries(
      project.interopConfig.durationSplit ?? {},
    )) {
      durationSplitMap.set(
        makeProtocolEntriesKey(project.id, bridgeType as InteropBridgeType),
        durationSplit,
      )
    }
  }

  const protocolsDataMap = getProtocolsDataMap(
    records,
    durationSplitMap,
    (record) => makeProtocolEntriesKey(record.id, record.bridgeType),
  )

  const protocolsData = Array.from(protocolsDataMap.entries()).sort(
    (a, b) => b[1].volume - a[1].volume,
  )

  return protocolsData
    .map(([key, data]) => {
      const { id, bridgeType } = parseProtocolEntriesKey(key)
      const project = interopProjects.find((p) => p.id === id)
      assert(project, `Project not found: ${id}`)

      const subgroupProject = interopProjects.find(
        (p) => p.id === project.interopConfig.subgroupId,
      )

      return {
        id: project.id,
        iconSlug: project.slug,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        protocolName: project.interopConfig.name ?? project.name,
        isAggregate: project.interopConfig.isAggregate,
        subgroup: subgroupProject
          ? {
              name: subgroupProject.name,
              iconUrl: manifest.getUrl(`/icons/${subgroupProject.slug}.png`),
            }
          : undefined,
        bridgeType,
        volume: data.volume,
        tokens: getTokensData(
          key,
          data.tokens,
          tokensDetailsMap,
          durationSplitMap,
          data.transferCount - data.identifiedTransferCount,
        ),
        chains: getChainsData(key, data.chains, durationSplitMap),
        transferCount: data.transferCount,
        averageValue:
          data.identifiedTransferCount > 0
            ? data.volume / data.identifiedTransferCount
            : 0,
        averageDuration: getAverageDuration(key, data, durationSplitMap),
        averageValueInFlight: data.averageValueInFlight,
      }
    })
    .sort((a, b) => b.volume - a.volume)
}
