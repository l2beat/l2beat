import type { Logger } from '@l2beat/backend-tools'
import type { InteropConfig, Project } from '@l2beat/config'
import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import { assert, notUndefined } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { getStaticAsset } from '~/server/features/utils/getProjectIcon'
import { getLogger } from '~/server/utils/logger'
import { getProtocolsDataMap } from './getProtocolsDataMap'

export type TokenData = {
  id: string
  symbol: string
  iconUrl: string
  volume: number
}

type CommonProtocolEntry = {
  iconSlug: string
  protocolName: string
}

export type NonMintingProtocolEntry = CommonProtocolEntry & {
  volume: number
  tokens: TokenData[]
}

export type DurationSplit = {
  type: 'split'
  in: {
    label: string
    duration: number | null
  }
  out: {
    label: string
    duration: number | null
  }
}

export type LockAndMintProtocolEntry = CommonProtocolEntry & {
  volume: number
  tokens: TokenData[]
  averageDuration: { type: 'single'; duration: number } | DurationSplit
}

export type OmniChainProtocolEntry = CommonProtocolEntry & {
  volume: number
  tokens: TokenData[]
}

export type ProtocolsByType = {
  nonMinting: NonMintingProtocolEntry[]
  lockAndMint: LockAndMintProtocolEntry[]
  omniChain: OmniChainProtocolEntry[]
}

export function getProtocolsByType(
  records: AggregatedInteropTransferRecord[],
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  interopProjects: Project<'interopConfig'>[],
): ProtocolsByType {
  const logger = getLogger().for('getProtocolsByType')

  const durationSplitMap = new Map<
    string,
    NonNullable<InteropConfig['durationSplit']>
  >()
  for (const project of interopProjects) {
    if (project.interopConfig.durationSplit) {
      durationSplitMap.set(project.id, project.interopConfig.durationSplit)
    }
  }

  const protocolsDataMap = getProtocolsDataMap(records, durationSplitMap)

  const protocolsByType = groupBy(
    interopProjects,
    (p) => p.interopConfig.bridgeType,
  )

  const protocolsData = Array.from(protocolsDataMap.entries()).sort(
    (a, b) => b[1].volume - a[1].volume,
  )

  const nonMintingData = protocolsData.filter(([key]) =>
    protocolsByType.nonMinting?.some((p) => p.id === key),
  )
  const lockAndMintData = protocolsData.filter(([key]) =>
    protocolsByType.lockAndMint?.some((p) => p.id === key),
  )
  const omniChainData = protocolsData.filter(([key]) =>
    protocolsByType.omnichain?.some((p) => p.id === key),
  )

  const getProjectCommon = (key: string): CommonProtocolEntry => {
    const project = interopProjects.find((p) => p.id === key)
    assert(project, `Project not found: ${key}`)
    return {
      protocolName: project?.interopConfig.name ?? project.name,
      iconSlug: project?.slug,
    }
  }

  return {
    nonMinting: nonMintingData.map(([key, { volume, tokens }]) => {
      return {
        ...getProjectCommon(key),
        volume,
        tokens: getTokensData(tokens, tokensDetailsMap, logger),
      }
    }),
    lockAndMint: lockAndMintData.map(([key, data]) => {
      return {
        ...getProjectCommon(key),
        volume: data.volume,
        tokens: getTokensData(data.tokens, tokensDetailsMap, logger),
        averageDuration: getAverageDuration(key, data, durationSplitMap),
      }
    }),
    omniChain: omniChainData.map(([key, { volume, tokens }]) => {
      return {
        ...getProjectCommon(key),
        volume,
        tokens: getTokensData(tokens, tokensDetailsMap, logger),
      }
    }),
  }
}

function getTokensData(
  tokens: Map<string, number>,
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  logger: Logger,
) {
  return Array.from(tokens.entries())
    .map(([tokenId, volume]) => {
      const tokenDetails = tokensDetailsMap.get(tokenId)

      if (!tokenDetails) {
        logger.warn(`Token not found: ${tokenId}`)
        return undefined
      }

      return {
        id: tokenId,
        symbol: tokenDetails.symbol,
        iconUrl:
          tokenDetails.iconUrl ??
          getStaticAsset('/images/token-placeholder.png'),
        volume,
      }
    })
    .filter(notUndefined)
    .toSorted((a, b) => b.volume - a.volume)
}

function getAverageDuration(
  key: string,
  data: {
    transferCount: number
    totalDurationSum: number
    inTransferCount: number
    inDurationSum: number
    outTransferCount: number
    outDurationSum: number
  },
  durationSplitMap: Map<string, NonNullable<InteropConfig['durationSplit']>>,
): LockAndMintProtocolEntry['averageDuration'] {
  const durationSplit = durationSplitMap.get(key)

  if (durationSplit) {
    return {
      type: 'split',
      in: {
        label: durationSplit.in.label,
        duration:
          data.inTransferCount > 0
            ? Math.floor(data.inDurationSum / data.inTransferCount)
            : null,
      },
      out: {
        label: durationSplit.out.label,
        duration:
          data.outTransferCount > 0
            ? Math.floor(data.outDurationSum / data.outTransferCount)
            : null,
      },
    }
  }

  return {
    type: 'single',
    duration:
      data.transferCount > 0
        ? Math.floor(data.totalDurationSum / data.transferCount)
        : 0,
  }
}
