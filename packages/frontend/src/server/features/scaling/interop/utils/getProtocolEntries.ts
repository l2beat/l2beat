import type { Project } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { getLogger } from '~/server/utils/logger'
import { manifest } from '~/utils/Manifest'
import type {
  AggregatedInteropTransferWithTokens,
  ProtocolEntry,
} from '../types'
import { buildTransfersTimeModeMap } from './buildTransfersTimeModeMap'
import { buildDurationSplitMap, getAverageDuration } from './getAverageDuration'
import { getChainsData } from './getChainsData'
import { getProtocolsDataMapByBridgeType } from './getProtocolsDataMap'
import { getTokensData } from './getTokensData'

const logger = getLogger().for('getProtocolEntries')

export function getProtocolEntries(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  interopProjects: Project<'interopConfig'>[],
): ProtocolEntry[] {
  const durationSplitMap = buildDurationSplitMap(interopProjects)
  const transfersTimeModeMap = buildTransfersTimeModeMap(interopProjects)

  const protocolsDataMap = getProtocolsDataMapByBridgeType(
    records,
    durationSplitMap,
    transfersTimeModeMap,
  )

  // Flatten the two-level map into a sorted array of entries
  const entries: ProtocolEntry[] = []

  for (const [projectId, bridgeTypeMap] of protocolsDataMap) {
    const project = interopProjects.find((p) => p.id === projectId)
    assert(project, `Project not found: ${projectId}`)

    const subgroupProject = interopProjects.find(
      (p) => p.id === project.interopConfig.subgroupId,
    )

    for (const [bridgeType, data] of bridgeTypeMap) {
      entries.push({
        id: project.id,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        protocolName: project.interopConfig.name ?? project.name,
        isAggregate: project.interopConfig.isAggregate,
        subgroup: subgroupProject
          ? {
              name: subgroupProject.name,
              iconUrl: manifest.getUrl(`/icons/${subgroupProject.slug}.png`),
            }
          : undefined,
        bridgeTypes: [bridgeType],
        volume: data.volume,
        tokens: getTokensData({
          projectId,
          bridgeType,
          tokens: data.tokens,
          tokensDetailsMap,
          durationSplitMap,
          unknownTransfersCount:
            data.transferCount - data.identifiedTransferCount,
          logger,
        }),
        chains: getChainsData({
          projectId,
          bridgeType,
          chains: data.chains,
          durationSplitMap,
          logger,
        }),
        transferCount: data.transferCount,
        averageValue:
          data.identifiedTransferCount > 0
            ? data.volume / data.identifiedTransferCount
            : 0,
        averageDuration:
          project.interopConfig.transfersTimeMode === 'unknown'
            ? { type: 'unknown' as const }
            : getAverageDuration(projectId, bridgeType, data, durationSplitMap),
        averageValueInFlight: data.averageValueInFlight,
      })
    }
  }

  return entries.sort((a, b) => b.volume - a.volume)
}
