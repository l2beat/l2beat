import type { InteropConfig, Project } from '@l2beat/config'
import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import { assert, notUndefined } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { getStaticAsset } from '~/server/features/utils/getProjectIcon'
import { getLogger } from '~/server/utils/logger'

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

  const protocolsDataMap = new Map<
    string,
    {
      volume: number
      tokens: Map<string, number>
      transferCount: number
      totalDurationSum: number
      // Split duration tracking (only used when durationSplit is configured)
      inTransferCount: number
      inDurationSum: number
      outTransferCount: number
      outDurationSum: number
    }
  >()

  for (const record of records) {
    const current = protocolsDataMap.get(record.id) ?? {
      volume: 0,
      tokens: new Map<string, number>(),
      transferCount: 0,
      totalDurationSum: 0,
      inTransferCount: 0,
      inDurationSum: 0,
      outTransferCount: 0,
      outDurationSum: 0,
    }

    for (const [tokenId, volume] of Object.entries(record.tokensByVolume)) {
      current.tokens.set(tokenId, (current.tokens.get(tokenId) ?? 0) + volume)
    }

    // Check if this record matches a durationSplit direction
    const durationSplit = durationSplitMap.get(record.id)
    let inTransferCount = current.inTransferCount
    let inDurationSum = current.inDurationSum
    let outTransferCount = current.outTransferCount
    let outDurationSum = current.outDurationSum

    if (durationSplit) {
      const isInDirection =
        record.srcChain === durationSplit.in.from &&
        record.dstChain === durationSplit.in.to
      const isOutDirection =
        record.srcChain === durationSplit.out.from &&
        record.dstChain === durationSplit.out.to

      if (isInDirection) {
        inTransferCount += record.transferCount ?? 0
        inDurationSum += record.totalDurationSum ?? 0
      } else if (isOutDirection) {
        outTransferCount += record.transferCount ?? 0
        outDurationSum += record.totalDurationSum ?? 0
      }
    }

    protocolsDataMap.set(record.id, {
      volume: current.volume + (record.srcValueUsd ?? record.dstValueUsd ?? 0),
      tokens: current.tokens,
      transferCount: current.transferCount + (record.transferCount ?? 0),
      totalDurationSum:
        current.totalDurationSum + (record.totalDurationSum ?? 0),
      inTransferCount,
      inDurationSum,
      outTransferCount,
      outDurationSum,
    })
  }

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

  const getTokensData = (tokens: Map<string, number>) => {
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

  const getAverageDuration = (
    key: string,
    data: {
      transferCount: number
      totalDurationSum: number
      inTransferCount: number
      inDurationSum: number
      outTransferCount: number
      outDurationSum: number
    },
  ): LockAndMintProtocolEntry['averageDuration'] => {
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

  return {
    nonMinting: nonMintingData.map(([key, { volume, tokens }]) => {
      return {
        ...getProjectCommon(key),
        volume,
        tokens: getTokensData(tokens),
      }
    }),
    lockAndMint: lockAndMintData.map(([key, data]) => {
      return {
        ...getProjectCommon(key),
        volume: data.volume,
        tokens: getTokensData(data.tokens),
        averageDuration: getAverageDuration(key, data),
      }
    }),
    omniChain: omniChainData.map(([key, { volume, tokens }]) => {
      return {
        ...getProjectCommon(key),
        volume,
        tokens: getTokensData(tokens),
      }
    }),
  }
}
