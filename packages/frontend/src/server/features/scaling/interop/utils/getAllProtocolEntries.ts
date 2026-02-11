import type { Logger } from '@l2beat/backend-tools'
import type { Project } from '@l2beat/config'
import {
  type KnownInteropBridgeType,
  notUndefined,
  type ProjectId,
} from '@l2beat/shared-pure'
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
import { getTopItems } from './getTopItems'

const TOP_ITEMS_LIMIT = 3
const logger = getLogger().for('getAllProtocolEntries')

export function getProtocolEntries(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  interopProjects: Project<'interopConfig'>[],
  type: KnownInteropBridgeType | undefined,
): ProtocolEntry[] {
  const durationSplitMap = buildDurationSplitMap(interopProjects)
  const transfersTimeModeMap = buildTransfersTimeModeMap(interopProjects)

  const protocolsDataMap = getProtocolsDataMap(
    records,
    transfersTimeModeMap,
    durationSplitMap,
  )
  const protocolsDataByBridgeTypeMap = getProtocolsDataMapByBridgeType(
    records,
    durationSplitMap,
    transfersTimeModeMap,
  )

  return interopProjects
    .map((project) => {
      const data = protocolsDataMap.get(project.id)

      const subgroupProject = interopProjects.find(
        (p) => p.id === project.interopConfig.subgroupId,
      )

      const byBridgeType = getByBridgeTypeData(
        project.id,
        protocolsDataByBridgeTypeMap,
        tokensDetailsMap,
        durationSplitMap,
        logger,
      )
      const bridgeTypesFromData = Object.entries(byBridgeType ?? {})
        .filter(([_, value]) => value !== undefined)
        .map(([key]) => key) as KnownInteropBridgeType[]

      const bridgeTypesFromPlugins = project.interopConfig.plugins
        .map((p) => p.bridgeType)
        .filter(notUndefined)

      const bridgeTypes = [
        ...new Set([...bridgeTypesFromData, ...bridgeTypesFromPlugins]),
      ]

      // Show zeros for projects that don't have data but have plugins for the given type
      if (!data && (!type || bridgeTypesFromPlugins.includes(type))) {
        return {
          id: project.id,
          iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
          protocolName: project.interopConfig.name ?? project.name,
          bridgeTypes,
          isAggregate: project.interopConfig.isAggregate,
          subgroup: subgroupProject
            ? {
                name: subgroupProject.name,
                iconUrl: manifest.getUrl(`/icons/${subgroupProject.slug}.png`),
              }
            : undefined,
          volume: 0,
          byBridgeType: undefined,
          tokens: { items: [], remainingCount: 0 },
          chains: { items: [], remainingCount: 0 },
          transferCount: 0,
          averageValue: null,
          averageDuration: null,
          averageValueInFlight: undefined,
          netMintedValue: undefined,
        }
      }

      // Skip projects that don't have data and don't have plugins for the given type
      if (!data) return undefined

      const averageDuration =
        project.interopConfig.transfersTimeMode === 'unknown'
          ? { type: 'unknown' as const }
          : bridgeTypes.length === 1
            ? // Show average duration in the All protocols table only if there is only one bridge type
              getAverageDuration(
                project.id,
                // biome-ignore lint/style/noNonNullAssertion: it's there
                bridgeTypes[0]!,
                data,
                durationSplitMap,
              )
            : getAverageDuration(project.id, undefined, data, undefined)

      const tokens = getTokensData({
        projectId: project.id,
        bridgeType: undefined, // No bridge type split for aggregated view
        tokens: data.tokens,
        tokensDetailsMap,
        durationSplitMap: undefined, // No duration split map for aggregated view
        unknownTransfersCount:
          data.transferCount - data.identifiedTransferCount,
        logger,
      })
      const chains = getChainsData({
        projectId: project.id,
        bridgeType: undefined, // No bridge type split for aggregated view
        chains: data.chains,
        durationSplitMap: undefined, // No duration split map for aggregated view
        logger,
      })

      const record: ProtocolEntry = {
        id: project.id,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        protocolName: project.interopConfig.name ?? project.name,
        bridgeTypes,
        isAggregate: project.interopConfig.isAggregate,
        subgroup: subgroupProject
          ? {
              name: subgroupProject.name,
              iconUrl: manifest.getUrl(`/icons/${subgroupProject.slug}.png`),
            }
          : undefined,
        volume: data.volume,
        byBridgeType,
        tokens: getTopItems(tokens, TOP_ITEMS_LIMIT),
        chains: getTopItems(chains, TOP_ITEMS_LIMIT),
        transferCount: data.transferCount,
        averageValue:
          data.identifiedTransferCount > 0
            ? data.volume / data.identifiedTransferCount
            : null,
        averageDuration,
        averageValueInFlight: data.averageValueInFlight,
        netMintedValue:
          data.mintedValueUsd !== undefined && data.burnedValueUsd !== undefined
            ? data.mintedValueUsd - data.burnedValueUsd
            : undefined,
      }

      return record
    })
    .filter(notUndefined)
    .sort((a, b) => b.volume - a.volume)
}

function getByBridgeTypeData(
  projectId: ProjectId,
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
          tokens: getTopItems(
            getTokensData({
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
            TOP_ITEMS_LIMIT,
          ),
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
          tokens: getTopItems(
            getTokensData({
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
            TOP_ITEMS_LIMIT,
          ),
          averageValueInFlight: data.nonMinting.averageValueInFlight,
        }
      : undefined,
    burnAndMint: data.burnAndMint
      ? {
          volume: data.burnAndMint.volume,
          tokens: getTopItems(
            getTokensData({
              projectId,
              bridgeType: 'burnAndMint',
              tokens: data.burnAndMint.tokens,
              tokensDetailsMap,
              durationSplitMap,
              unknownTransfersCount:
                data.burnAndMint.transferCount -
                data.burnAndMint.identifiedTransferCount,
              logger,
            }),
            TOP_ITEMS_LIMIT,
          ),
        }
      : undefined,
  }
}
