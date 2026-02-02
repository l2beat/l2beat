import type { Project } from '@l2beat/config'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'
import type { AggregatedInteropTransferWithTokens } from '../types'

type TokenDetails = {
  symbol: string
  iconUrl: string | null
  issuer?: string | null
}

export type InteropTopTokenData = {
  token: {
    id: string
    name: string
    symbol: string
    iconUrl: string
  }
  volume: number
  transferCount: number
  volumeChange: number
  transferCountChange: number
  topProtocol:
    | {
        id: string
        name: string
        iconUrl: string
      }
    | undefined
  topPath:
    | {
        srcChain: string
        dstChain: string
      }
    | undefined
}

export function getTokenTotals(
  records: AggregatedInteropTransferWithTokens[],
  tokenId: string,
  subgroupProjects: Set<ProjectId>,
): { volume: number; transferCount: number } {
  let volume = 0
  let transferCount = 0

  for (const record of records) {
    if (subgroupProjects.has(record.id as ProjectId)) continue

    for (const token of record.tokens) {
      if (token.abstractTokenId !== tokenId) continue
      volume += token.volume ?? 0
      transferCount += token.transferCount ?? 0
    }
  }

  return { volume, transferCount }
}

export function getTopTokenWidgetData(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: Map<string, TokenDetails>,
  interopProjects: Project<'interopConfig'>[],
  subgroupProjects: Set<ProjectId>,
): InteropTopTokenData | undefined {
  const tokenTotals = new Map<string, { volume: number; transferCount: number }>()
  const tokenProtocolVolumes = new Map<string, Map<string, number>>()
  const tokenPathVolumes = new Map<string, Map<string, number>>()

  for (const record of records) {
    if (subgroupProjects.has(record.id as ProjectId)) continue

    for (const token of record.tokens) {
      const tokenId = token.abstractTokenId
      const volume = token.volume ?? 0
      const transferCount = token.transferCount ?? 0

      const current = tokenTotals.get(tokenId) ?? { volume: 0, transferCount: 0 }
      tokenTotals.set(tokenId, {
        volume: current.volume + volume,
        transferCount: current.transferCount + transferCount,
      })

      const protocolMap = tokenProtocolVolumes.get(tokenId) ?? new Map()
      protocolMap.set(record.id, (protocolMap.get(record.id) ?? 0) + volume)
      tokenProtocolVolumes.set(tokenId, protocolMap)

      const pathKey = `${record.srcChain}::${record.dstChain}`
      const pathMap = tokenPathVolumes.get(tokenId) ?? new Map()
      pathMap.set(pathKey, (pathMap.get(pathKey) ?? 0) + volume)
      tokenPathVolumes.set(tokenId, pathMap)
    }
  }

  let topTokenId: string | undefined
  let topTotals: { volume: number; transferCount: number } | undefined
  for (const [tokenId, totals] of tokenTotals.entries()) {
    if (!topTotals || totals.volume > topTotals.volume) {
      topTokenId = tokenId
      topTotals = totals
    }
  }

  if (!topTokenId || !topTotals) return undefined

  const tokenDetails = tokensDetailsMap.get(topTokenId)
  const topProtocolId = getLargestKey(tokenProtocolVolumes.get(topTokenId))
  const topPathKey = getLargestKey(tokenPathVolumes.get(topTokenId))

  const topProtocol = topProtocolId
    ? (() => {
        const project = interopProjects.find((p) => p.id === topProtocolId)
        assert(project, `Project not found: ${topProtocolId}`)

        return {
          id: project.id,
          name: project.interopConfig.name ?? project.name,
          iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        }
      })()
    : undefined

  const topPath = topPathKey
    ? (() => {
        const [srcChain, dstChain] = topPathKey.split('::')
        assert(srcChain && dstChain)
        return { srcChain, dstChain }
      })()
    : undefined

  return {
    token: {
      id: topTokenId,
      name: tokenDetails?.issuer ?? tokenDetails?.symbol ?? 'Unknown',
      symbol: tokenDetails?.symbol ?? 'Unknown',
      iconUrl:
        tokenDetails?.iconUrl ??
        manifest.getUrl('/images/token-placeholder.png'),
    },
    volume: topTotals.volume,
    transferCount: topTotals.transferCount,
    volumeChange: Number.NaN,
    transferCountChange: Number.NaN,
    topProtocol,
    topPath,
  }
}

function getLargestKey(map: Map<string, number> | undefined): string | undefined {
  if (!map || map.size === 0) return undefined

  let topKey: string | undefined
  let topValue = -Infinity

  for (const [key, value] of map.entries()) {
    if (value > topValue) {
      topValue = value
      topKey = key
    }
  }

  return topKey
}
