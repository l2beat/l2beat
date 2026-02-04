import type { Project } from '@l2beat/config'
import { assert, type InteropBridgeType } from '@l2beat/shared-pure'
import { getLogger } from '~/server/utils/logger'
import { manifest } from '~/utils/Manifest'
import type { AggregatedInteropTransferWithTokens } from '../types'
import { buildTransfersTimeModeMap } from './buildTransfersTimeModeMap'
import { getAverageDuration } from './getAverageDuration'
import { getChainsData } from './getChainsData'
import { getProtocolsDataMap } from './getProtocolsDataMap'
import { getTokensData } from './getTokensData'
import type { AverageDuration, ChainData, TokenData } from './types'

export type AllProtocolsEntry = {
  id: string
  iconUrl: string
  protocolName: string
  isAggregate?: boolean
  subgroup?: {
    name: string
    iconUrl: string
  }
  bridgeTypes: InteropBridgeType[]
  volume: number
  tokens: TokenData[]
  chains: ChainData[]
  transferCount: number
  averageValue: number
  averageDuration: AverageDuration
  averageValueInFlight?: number
}

const logger = getLogger().for('getAllProtocolEntries')

export function getAllProtocolEntries(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  interopProjects: Project<'interopConfig'>[],
): AllProtocolsEntry[] {
  const transfersTimeModeMap = buildTransfersTimeModeMap(interopProjects)

  const protocolsDataMap = getProtocolsDataMap(records, transfersTimeModeMap)

  const protocolsData = Array.from(protocolsDataMap.entries()).sort(
    (a, b) => b[1].volume - a[1].volume,
  )

  return protocolsData
    .map(([projectId, data]) => {
      const project = interopProjects.find((p) => p.id === projectId)
      assert(project, `Project not found: ${projectId}`)

      const subgroupProject = interopProjects.find(
        (p) => p.id === project.interopConfig.subgroupId,
      )

      return {
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
        bridgeTypes: data.bridgeTypes,
        volume: data.volume,
        tokens: getTokensData({
          projectId,
          bridgeType: undefined, // No bridge type split for aggregated view
          tokens: data.tokens,
          tokensDetailsMap,
          durationSplitMap: undefined, // No duration split map for aggregated view
          unknownTransfersCount:
            data.transferCount - data.identifiedTransferCount,
          logger,
        }),
        chains: getChainsData({
          projectId,
          bridgeType: undefined, // No bridge type split for aggregated view
          chains: data.chains,
          durationSplitMap: undefined, // No duration split map for aggregated view
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
            : getAverageDuration(projectId, undefined, data, undefined),
        averageValueInFlight: data.averageValueInFlight,
      }
    })
    .sort((a, b) => b.volume - a.volume)
}
