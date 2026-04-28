import type { Logger } from '@l2beat/backend-tools'
import type { Project } from '@l2beat/config'
import type { KnownInteropBridgeType, UnixTime } from '@l2beat/shared-pure'
import { getLogger } from '~/server/utils/logger'
import { manifest } from '~/utils/Manifest'
import type {
  AggregatedInteropTransferWithTokens,
  ByBridgeTypeData,
  InteropSelectionInput,
  ProtocolEntry,
} from '../types'
import type { TokensDetailsMap } from './buildTokensDetailsMap'
import { getAverageDuration, getDurationSplit } from './getAverageDuration'
import { getChainsData } from './getChainsData'
import { flowsMapToSorted } from './getFlows'
import { getNetMintedValueUsd } from './getNetMintedValueUsd'
import {
  getProtocolsDataMap,
  getProtocolsDataMapByBridgeType,
  type ProtocolDataByBridgeType,
} from './getProtocolsDataMap'
import { getRelevantBridgeTypes } from './getRelevantBridgeTypes'
import { getTokensData } from './getTokensData'
import { getTopItems } from './getTopItems'

const TOP_ITEMS_LIMIT = 3
const logger = getLogger().for('getAllProtocolEntries')

export function getProtocolEntries(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: TokensDetailsMap,
  interopProjects: Project<'interopConfig'>[],
  type: KnownInteropBridgeType | undefined,
  snapshotTimestamp: UnixTime | undefined,
  selection: InteropSelectionInput,
): {
  entries: ProtocolEntry[]
  zeroTransferProtocols: { name: string; iconUrl: string }[]
} {
  const protocolsDataMap = getProtocolsDataMap(records)
  const protocolsDataByBridgeTypeMap = getProtocolsDataMapByBridgeType(records)

  const entries: ProtocolEntry[] = []
  const zeroTransferProtocols: { name: string; iconUrl: string }[] = []

  for (const project of interopProjects) {
    const data = protocolsDataMap.get(project.id)

    const subgroupProject = interopProjects.find(
      (p) => p.id === project.interopConfig.subgroupId,
    )

    const byBridgeType = getByBridgeTypeData(
      project,
      protocolsDataByBridgeTypeMap,
      tokensDetailsMap,
      logger,
      selection,
    )

    const bridgeTypes = getRelevantBridgeTypes(project, undefined).sort(
      sortBridgeTypesFn,
    )

    // Show zeros for projects that don't have data but have plugins for the given type
    if (!data && (!type || bridgeTypes.includes(type))) {
      zeroTransferProtocols.push({
        name: project.interopConfig.name ?? project.name,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      })
      continue
    }

    // Skip projects that don't have data and don't have plugins for the given type
    if (!data) continue

    const relevantBridgeTypes = getRelevantBridgeTypes(project, type)
    const durationSplitForProtocol = getDurationSplit(
      project,
      relevantBridgeTypes,
    )
    const averageDuration =
      project.interopConfig.transfersTimeMode === 'unknown'
        ? { type: 'unknown' as const }
        : getAverageDuration(data, durationSplitForProtocol)

    const tokens = getTokensData({
      tokens: data.tokens,
      tokensDetailsMap,
      interopProjects,
      unknownTransfersCount: data.transferCount - data.identifiedTransferCount,
      // No duration split map for aggregated view
      durationSplit: undefined,
      logger,
    })
    const chains = getChainsData({
      chains: data.chains,
      // No duration split map for aggregated view
      durationSplit: undefined,
      logger,
    })

    entries.push({
      id: project.id,
      slug: project.slug,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      name: project.interopConfig.name ?? project.name,
      shortName: project.interopConfig.shortName,
      description: project.interopConfig.description,
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
      minTransferValueUsd: data.minTransferValueUsd,
      maxTransferValueUsd: data.maxTransferValueUsd,
      averageDuration,
      averageValueInFlight: data.averageValueInFlight,
      netMintedValue: getNetMintedValueUsd(data),
      snapshotTimestamp,
    })
  }

  return {
    entries: entries.sort((a, b) => b.volume - a.volume),
    zeroTransferProtocols,
  }
}

function getByBridgeTypeData(
  project: Project<'interopConfig'>,
  protocolsDataByBridgeTypeMap: Map<string, ProtocolDataByBridgeType>,
  tokensDetailsMap: TokensDetailsMap,
  logger: Logger,
  selection: InteropSelectionInput,
): ByBridgeTypeData | undefined {
  const data = protocolsDataByBridgeTypeMap.get(project.id)
  if (!data) return undefined

  return {
    lockAndMint: data.lockAndMint
      ? {
          volume: data.lockAndMint.volume,
          transferCount: data.lockAndMint.transferCount,
          averageValue:
            data.lockAndMint.identifiedTransferCount > 0
              ? data.lockAndMint.volume /
                data.lockAndMint.identifiedTransferCount
              : null,
          tokens: getTopItems(
            getTokensData({
              tokens: data.lockAndMint.tokens,
              tokensDetailsMap,
              interopProjects: [project],
              durationSplit: getDurationSplit(project, ['lockAndMint']),
              unknownTransfersCount:
                data.lockAndMint.transferCount -
                data.lockAndMint.identifiedTransferCount,
              logger,
            }),
            TOP_ITEMS_LIMIT,
          ),
          flows: flowsMapToSorted(data.lockAndMint.flows, selection),
          netMintedValue: getNetMintedValueUsd(data.lockAndMint),
        }
      : undefined,
    nonMinting: data.nonMinting
      ? {
          volume: data.nonMinting.volume,
          transferCount: data.nonMinting.transferCount,
          averageValue:
            data.nonMinting.identifiedTransferCount > 0
              ? data.nonMinting.volume / data.nonMinting.identifiedTransferCount
              : null,
          tokens: getTopItems(
            getTokensData({
              tokens: data.nonMinting.tokens,
              tokensDetailsMap,
              interopProjects: [project],
              durationSplit: getDurationSplit(project, ['nonMinting']),
              unknownTransfersCount:
                data.nonMinting.transferCount -
                data.nonMinting.identifiedTransferCount,
              logger,
            }),
            TOP_ITEMS_LIMIT,
          ),
          flows: flowsMapToSorted(data.nonMinting.flows, selection),
          averageValueInFlight: data.nonMinting.averageValueInFlight,
        }
      : undefined,
    burnAndMint: data.burnAndMint
      ? {
          volume: data.burnAndMint.volume,
          transferCount: data.burnAndMint.transferCount,
          averageValue:
            data.burnAndMint.identifiedTransferCount > 0
              ? data.burnAndMint.volume /
                data.burnAndMint.identifiedTransferCount
              : null,
          tokens: getTopItems(
            getTokensData({
              tokens: data.burnAndMint.tokens,
              tokensDetailsMap,
              interopProjects: [project],
              durationSplit: getDurationSplit(project, ['burnAndMint']),
              unknownTransfersCount:
                data.burnAndMint.transferCount -
                data.burnAndMint.identifiedTransferCount,
              logger,
            }),
            TOP_ITEMS_LIMIT,
          ),
          flows: flowsMapToSorted(data.burnAndMint.flows, selection),
        }
      : undefined,
    unknown: data.unknown
      ? {
          volume: data.unknown.volume,
          transferCount: data.unknown.transferCount,
          averageValue:
            data.unknown.identifiedTransferCount > 0
              ? data.unknown.volume / data.unknown.identifiedTransferCount
              : null,
          tokens: getTopItems(
            getTokensData({
              tokens: data.unknown.tokens,
              tokensDetailsMap,
              interopProjects: [project],
              durationSplit: undefined,
              unknownTransfersCount:
                data.unknown.transferCount -
                data.unknown.identifiedTransferCount,
              logger,
            }),
            TOP_ITEMS_LIMIT,
          ),
          flows: flowsMapToSorted(data.unknown.flows, selection),
        }
      : undefined,
  }
}

const bridgeTypesOrder = ['nonMinting', 'lockAndMint', 'burnAndMint']

function sortBridgeTypesFn(
  a: KnownInteropBridgeType,
  b: KnownInteropBridgeType,
): number {
  return bridgeTypesOrder.indexOf(a) - bridgeTypesOrder.indexOf(b)
}
