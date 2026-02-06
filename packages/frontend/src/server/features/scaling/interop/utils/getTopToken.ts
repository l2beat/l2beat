import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'
import type { AggregatedInteropTransferWithTokens } from '../types'
import type { TokensDetailsMap } from './buildTokensDetailsMap'

export interface InteropTopTokenData {
  symbol: string
  iconUrl: string
  volume: number
  transferCount: number
  topProtocol?: {
    name: string
    iconUrl: string
  }
}

export interface GetTopTokenParams {
  records: AggregatedInteropTransferWithTokens[]
  tokensDetailsMap: TokensDetailsMap
  interopProjects: Project<'interopConfig'>[]
  subgroupProjects: Set<ProjectId>
}

export function getTopToken({
  records,
  tokensDetailsMap,
  interopProjects,
  subgroupProjects,
}: GetTopTokenParams): InteropTopTokenData | undefined {
  const projectsById = new Map(
    interopProjects.map((project) => [project.id, project]),
  )

  const tokenVolumes = new Map<
    string,
    {
      symbol: string
      iconUrl: string
      volume: number
      transferCount: number
      protocols: Map<string, number>
    }
  >()

  for (const record of records) {
    // Skip projects that are part of other projects to not double count
    if (subgroupProjects.has(record.id as ProjectId)) continue

    for (const token of record.tokens) {
      const tokenDetails = tokensDetailsMap.get(token.abstractTokenId)
      if (!tokenDetails) continue

      const current = tokenVolumes.get(token.abstractTokenId) ?? {
        symbol: tokenDetails.symbol,
        iconUrl: tokenDetails.iconUrl,
        volume: 0,
        transferCount: 0,
        protocols: new Map(),
      }

      current.volume += token.volume
      current.transferCount += token.transferCount

      const protocolVolume = current.protocols.get(record.id) ?? 0
      current.protocols.set(record.id, protocolVolume + token.volume)

      tokenVolumes.set(token.abstractTokenId, current)
    }
  }

  const topToken = Array.from(tokenVolumes.values()).toSorted(
    (a, b) => b.volume - a.volume,
  )[0]

  if (!topToken) return undefined

  const topProtocolId = Array.from(topToken.protocols.entries())
    .toSorted((a, b) => b[1] - a[1])
    .map(([key]) => key)[0]

  const protocolProject = topProtocolId
    ? projectsById.get(ProjectId(topProtocolId))
    : undefined
  const topProtocol = protocolProject
    ? {
        name: protocolProject.interopConfig.name ?? protocolProject.name,
        iconUrl: manifest.getUrl(`/icons/${protocolProject.slug}.png`),
      }
    : undefined

  return {
    symbol: topToken.symbol,
    iconUrl: topToken.iconUrl,
    volume: topToken.volume,
    transferCount: topToken.transferCount,
    topProtocol,
  }
}
