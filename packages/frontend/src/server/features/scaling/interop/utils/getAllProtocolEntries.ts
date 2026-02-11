import type { Logger } from '@l2beat/backend-tools'
import type { Project } from '@l2beat/config'
import { assert, type KnownInteropBridgeType } from '@l2beat/shared-pure'
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

      const byBridgeType = getByBridgeTypeData(
        projectId,
        protocolsDataByBridgeTypeMap,
        tokensDetailsMap,
        durationSplitMap,
        logger,
      )

      const bridgeTypes = Object.entries(byBridgeType ?? {})
        .filter(([_, value]) => value !== undefined)
        .map(([key]) => key) as KnownInteropBridgeType[]

      const averageDuration =
        project.interopConfig.transfersTimeMode === 'unknown'
          ? { type: 'unknown' as const }
          : bridgeTypes.length === 1
            ? // Show average duration in the All protocols table only if there is only one bridge type
              getAverageDuration(
                projectId,
                // biome-ignore lint/style/noNonNullAssertion: it's there
                bridgeTypes[0]!,
                data,
                durationSplitMap,
              )
            : getAverageDuration(projectId, undefined, data, undefined)

      const tokens = getTokensData({
        projectId,
        bridgeType: undefined, // No bridge type split for aggregated view
        tokens: data.tokens,
        tokensDetailsMap,
        durationSplitMap: undefined, // No duration split map for aggregated view
        unknownTransfersCount:
          data.transferCount - data.identifiedTransferCount,
        logger,
      })
      const chains = getChainsData({
        projectId,
        bridgeType: undefined, // No bridge type split for aggregated view
        chains: data.chains,
        durationSplitMap: undefined, // No duration split map for aggregated view
        logger,
      })

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
        byBridgeType,
        tokens: getTopItems(tokens, TOP_ITEMS_LIMIT),
        chains: getTopItems(chains, TOP_ITEMS_LIMIT),
        transferCount: data.transferCount,
        averageValue:
          data.identifiedTransferCount > 0
            ? data.volume / data.identifiedTransferCount
            : 0,
        averageDuration,
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
