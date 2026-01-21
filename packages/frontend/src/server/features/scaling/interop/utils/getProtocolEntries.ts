import { INTEROP_CHAINS, type Project } from '@l2beat/config'
import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import { assert, notUndefined } from '@l2beat/shared-pure'
import { getLogger } from '~/server/utils/logger'
import { manifest } from '~/utils/Manifest'

export type TokenData = {
  id: string
  symbol: string
  iconUrl: string
  volume: number
}

export type ChainData = {
  id: string
  name: string
  iconUrl: string
  volume: number
}

export type ProtocolEntry = {
  iconUrl: string
  protocolName: string
  bridgeType: 'nonMinting' | 'lockAndMint' | 'omnichain'
  volume: number
  tokens: TokenData[]
  chains: ChainData[]
  transferCount: number
  averageValue: number
  averageDuration: number
}

export function getProtocolEntries(
  records: AggregatedInteropTransferRecord[],
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>,
  interopProjects: Project<'interopConfig'>[],
): ProtocolEntry[] {
  const logger = getLogger().for('getProtocolsByType')
  const protocolsDataMap = new Map<
    string,
    {
      volume: number
      tokens: Map<string, number>
      chains: Map<string, number>
      transferCount: number
      totalDurationSum: number
    }
  >()

  for (const record of records) {
    const current = protocolsDataMap.get(record.id) ?? {
      volume: 0,
      tokens: new Map<string, number>(),
      chains: new Map<string, number>(),
      transferCount: 0,
      totalDurationSum: 0,
    }

    for (const [tokenId, volume] of Object.entries(record.tokensByVolume)) {
      current.tokens.set(tokenId, (current.tokens.get(tokenId) ?? 0) + volume)
    }

    // Track chains volume (both src and dst contribute)
    if (record.srcChain) {
      const srcValue = record.srcValueUsd ?? 0
      current.chains.set(
        record.srcChain,
        (current.chains.get(record.srcChain) ?? 0) + srcValue,
      )
    }
    if (record.dstChain) {
      const dstValue = record.dstValueUsd ?? 0
      current.chains.set(
        record.dstChain,
        (current.chains.get(record.dstChain) ?? 0) + dstValue,
      )
    }

    protocolsDataMap.set(record.id, {
      volume: current.volume + (record.srcValueUsd ?? record.dstValueUsd ?? 0),
      tokens: current.tokens,
      chains: current.chains,
      transferCount: current.transferCount + (record.transferCount ?? 0),
      totalDurationSum:
        current.totalDurationSum + (record.totalDurationSum ?? 0),
    })
  }

  const protocolsData = Array.from(protocolsDataMap.entries()).sort(
    (a, b) => b[1].volume - a[1].volume,
  )

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
            manifest.getUrl('/images/token-placeholder.png'),
          volume,
        }
      })
      .filter(notUndefined)
      .toSorted((a, b) => b.volume - a.volume)
  }

  const getChainsData = (chains: Map<string, number>): ChainData[] => {
    return Array.from(chains.entries())
      .map(([chainId, volume]) => {
        const chain = INTEROP_CHAINS.find((c) => c.id === chainId)
        if (!chain) {
          logger.warn(`Chain not found: ${chainId}`)
          return undefined
        }

        return {
          id: chainId,
          name: chain.name,
          iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
          volume,
        }
      })
      .filter(notUndefined)
      .toSorted((a, b) => b.volume - a.volume)
  }

  return protocolsData.map(([key, data]) => {
    const project = interopProjects.find((p) => p.id === key)
    assert(project, `Project not found: ${key}`)
    const bridgeType = project.interopConfig.bridgeType

    return {
      iconSlug: project.slug,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      protocolName: project.interopConfig.name ?? project.name,
      bridgeType,
      volume: data.volume,
      tokens: getTokensData(data.tokens),
      chains: getChainsData(data.chains),
      transferCount: data.transferCount,
      averageValue:
        data.transferCount > 0 ? data.volume / data.transferCount : 0,
      averageDuration:
        data.transferCount > 0
          ? Math.floor(data.totalDurationSum / data.transferCount)
          : 0,
    }
  })
}
