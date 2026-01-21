import type { Project } from '@l2beat/config'
import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'

export type TokenData = {
  id: string
  symbol: string
  iconUrl: string | null
  volume: number
}

type CommonProtocolEntry = {
  iconSlug: string
  iconUrl: string
  protocolName: string
}

export type NonMintingProtocolEntry = CommonProtocolEntry & {
  volume: number
}

export type LockAndMintProtocolEntry = CommonProtocolEntry & {
  volume: number
  tokens: TokenData[]
  averageDuration: number
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
  const protocolsDataMap = new Map<
    string,
    {
      volume: number
      tokens: Map<string, number>
      transferCount: number
      totalDurationSum: number
    }
  >()

  for (const record of records) {
    const current = protocolsDataMap.get(record.id) ?? {
      volume: 0,
      tokens: new Map<string, number>(),
      transferCount: 0,
      totalDurationSum: 0,
    }

    for (const [tokenId, volume] of Object.entries(record.tokensByVolume)) {
      current.tokens.set(tokenId, (current.tokens.get(tokenId) ?? 0) + volume)
    }

    protocolsDataMap.set(record.id, {
      volume: current.volume + (record.srcValueUsd ?? record.dstValueUsd ?? 0),
      tokens: current.tokens,
      transferCount: current.transferCount + (record.transferCount ?? 0),
      totalDurationSum:
        current.totalDurationSum + (record.totalDurationSum ?? 0),
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
      iconUrl: getProjectIcon(project.slug),
    }
  }

  const getTokensData = (tokens: Map<string, number>) => {
    return Array.from(tokens.entries())
      .map(([tokenId, volume]) => {
        const tokenDetails = tokensDetailsMap.get(tokenId)
        assert(tokenDetails, `Token details not found for token id: ${tokenId}`)
        return {
          id: tokenId,
          symbol: tokenDetails.symbol,
          iconUrl: tokenDetails.iconUrl,
          volume,
        }
      })
      .toSorted((a, b) => b.volume - a.volume)
  }

  return {
    nonMinting: nonMintingData.map(([key, { volume }]) => {
      return {
        ...getProjectCommon(key),
        volume,
      }
    }),
    lockAndMint: lockAndMintData.map(
      ([key, { volume, tokens, transferCount, totalDurationSum }]) => {
        return {
          ...getProjectCommon(key),
          volume,
          tokens: getTokensData(tokens),
          averageDuration: Math.floor(totalDurationSum / transferCount),
        }
      },
    ),
    omniChain: omniChainData.map(([key, { volume, tokens }]) => {
      return {
        ...getProjectCommon(key),
        volume,
        tokens: getTokensData(tokens),
      }
    }),
  }
}
