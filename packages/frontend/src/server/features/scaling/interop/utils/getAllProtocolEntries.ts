import type { Logger } from '@l2beat/backend-tools'
import type { Project } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { getLogger } from '~/server/utils/logger'
import { manifest } from '~/utils/Manifest'
import type {
  AggregatedInteropTransferWithTokens,
  ByBridgeTypeData,
  DurationSplitMap,
  ProtocolEntry,
} from '../types'
import { buildTransfersTimeModeMap } from './buildTransfersTimeModeMap'
import { buildDurationSplitMap, getAverageDuration } from './getAverageDuration'
import { getChainsData } from './getChainsData'
import {
  getProtocolsDataMap,
  getProtocolsDataMapByBridgeType,
  type ProtocolDataByBridgeType,
} from './getProtocolsDataMap'
import { getTokensData } from './getTokensData'

const logger = getLogger().for('getAllProtocolEntries')

export function getProtocolEntries(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  interopProjects: Project<'interopConfig'>[],
): ProtocolEntry[] {
  const durationSplitMap = buildDurationSplitMap(interopProjects)
  const transfersTimeModeMap = buildTransfersTimeModeMap(interopProjects)

  const protocolsDataMap = getProtocolsDataMap(records, transfersTimeModeMap)
  const protocolsDataByBridgeTypeMap = getProtocolsDataMapByBridgeType(
    records,
    durationSplitMap,
    transfersTimeModeMap,
  )

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

      const record: ProtocolEntry = {
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
        volume: data.volume,
        byBridgeType: getByBridgeTypeData(
          projectId,
          protocolsDataByBridgeTypeMap,
          tokensDetailsMap,
          durationSplitMap,
          logger,
        ),
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
        netMintedValue:
          data.mintedValueUsd !== undefined && data.burnedValueUsd !== undefined
            ? data.mintedValueUsd - data.burnedValueUsd
            : undefined,
      }

      return record
    })
    .sort((a, b) => b.volume - a.volume)
}

function getByBridgeTypeData(
  projectId: string,
  protocolsDataByBridgeTypeMap: Map<string, ProtocolDataByBridgeType>,
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  durationSplitMap: DurationSplitMap | undefined,
  logger: Logger,
): ByBridgeTypeData | undefined {
  const data = protocolsDataByBridgeTypeMap.get(projectId)
  if (!data) return undefined

  return {
    lockAndMint: data.lockAndMint
      ? {
          volume: data.lockAndMint.volume,
          tokens: getTokensData({
            projectId,
            bridgeType: 'lockAndMint',
            tokens: data.lockAndMint.tokens,
            tokensDetailsMap,
            durationSplitMap,
            unknownTransfersCount:
              data.lockAndMint.transferCount -
              data.lockAndMint.identifiedTransferCount,
            logger,
          }),
          averageDuration: getAverageDuration(
            projectId,
            'lockAndMint',
            data.lockAndMint,
            durationSplitMap,
          ),
        }
      : undefined,
    nonMinting: data.nonMinting
      ? {
          volume: data.nonMinting.volume,
          tokens: getTokensData({
            projectId,
            bridgeType: 'nonMinting',
            tokens: data.nonMinting.tokens,
            tokensDetailsMap,
            durationSplitMap,
            unknownTransfersCount:
              data.nonMinting.transferCount -
              data.nonMinting.identifiedTransferCount,
            logger,
          }),
          averageValueInFlight: data.nonMinting.averageValueInFlight,
        }
      : undefined,
    omnichain: data.omnichain
      ? {
          volume: data.omnichain.volume,
          tokens: getTokensData({
            projectId,
            bridgeType: 'omnichain',
            tokens: data.omnichain.tokens,
            tokensDetailsMap,
            durationSplitMap,
            unknownTransfersCount:
              data.omnichain.transferCount -
              data.omnichain.identifiedTransferCount,
            logger,
          }),
        }
      : undefined,
  }
}
