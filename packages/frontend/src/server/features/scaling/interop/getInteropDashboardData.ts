import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getTokenDb } from '~/server/tokenDb'
import { manifest } from '~/utils/Manifest'
import type { InteropDashboardParams } from './types'
import {
  getProtocolEntries,
  type ProtocolEntry,
} from './utils/getProtocolEntries'
import { getTopPaths, type InteropPathData } from './utils/getTopPaths'
import {
  getTopProtocols,
  type InteropProtocolData,
} from './utils/getTopProtocols'

export type InteropDashboardData = {
  top3Paths: InteropPathData[]
  topProtocols: InteropProtocolData[]
  entries: ProtocolEntry[]
}

export async function getInteropDashboardData(
  params: InteropDashboardParams,
): Promise<InteropDashboardData> {
  if (env.MOCK) {
    return getMockInteropDashboardData()
  }
  const tokenDb = getTokenDb()

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  const filteredProjects = params.type
    ? interopProjects.filter((p) => p.interopConfig?.bridgeType === params.type)
    : undefined

  const db = getDb()
  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()
  if (!latestTimestamp) {
    return {
      top3Paths: [],
      topProtocols: [],
      entries: [],
    }
  }

  const [transfers, tokens] = await Promise.all([
    db.aggregatedInteropTransfer.getByChainsTimestampAndId(
      latestTimestamp,
      params.from,
      params.to,
      filteredProjects?.map((p) => p.id),
    ),
    db.aggregatedInteropToken.getByChainsTimestampAndId(
      latestTimestamp,
      params.from,
      params.to,
      filteredProjects?.map((p) => p.id),
    ),
  ])

  const records = transfers.map((transfer) => ({
    ...transfer,
    tokens: tokens
      .filter(
        (token) =>
          token.id === transfer.id &&
          token.srcChain === transfer.srcChain &&
          token.dstChain === transfer.dstChain,
      )
      .map((token) => ({
        abstractTokenId: token.abstractTokenId,
        transferCount: token.transferCount,
        totalDurationSum: token.totalDurationSum,
        volume: token.volume,
      })),
  }))

  if (records.length === 0) {
    return {
      top3Paths: [],
      topProtocols: [],
      entries: [],
    }
  }

  const tokensDetailsData = await tokenDb.abstractToken.getByIds(
    records.flatMap((r) => r.tokens.map((token) => token.abstractTokenId)),
  )
  const tokensDetailsDataMap = new Map<
    string,
    { symbol: string; iconUrl: string | null }
  >(tokensDetailsData.map((t) => [t.id, t]))

  return {
    top3Paths: getTopPaths(records),
    topProtocols: getTopProtocols(records, interopProjects),
    entries: getProtocolEntries(records, tokensDetailsDataMap, interopProjects),
  }
}

async function getMockInteropDashboardData(): Promise<InteropDashboardData> {
  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  const top3Paths: InteropPathData[] = [
    { srcChain: 'ethereum', dstChain: 'optimism', volume: 35_000_000 },
    { srcChain: 'ethereum', dstChain: 'arbitrum', volume: 30_000_000 },
    { srcChain: 'ethereum', dstChain: 'base', volume: 22_000_000 },
  ]

  const topProtocols: InteropProtocolData[] = interopProjects
    .slice(0, 5)
    .map((project, i) => ({
      protocolName: project.interopConfig.name ?? project.name,
      volume: { value: 20_000_000 - i * 3_000_000, share: 20 - i * 3 },
      transfers: { value: 5000 - i * 800, share: 20 - i * 3 },
    }))

  const mockTokens = [
    {
      id: 'eth001',
      symbol: 'ETH',
      iconUrl:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
      volume: 10_000_000,
      transferCount: 1000,
      avgDuration: 100_000,
      avgValue: 10_000,
    },
    {
      id: 'usdc01',
      symbol: 'USDC',
      iconUrl:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      volume: 5_000_000,
      transferCount: 500,
      avgDuration: 50_000,
      avgValue: 10_000,
    },
  ]

  const mockChains = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      iconUrl: manifest.getUrl('/icons/ethereum.png'),
      volume: 8_000_000,
      transferCount: 1000,
      avgDuration: 100_000,
      avgValue: 8_000,
    },
    {
      id: 'arbitrum',
      name: 'Arbitrum',
      iconUrl: manifest.getUrl('/icons/arbitrum.png'),
      volume: 5_000_000,
      transferCount: 500,
      avgDuration: 50_000,
      avgValue: 10_000,
    },
  ]

  const allProtocols: ProtocolEntry[] = interopProjects.map((project) => ({
    protocolName: project.interopConfig.name ?? project.name,
    iconSlug: project.slug,
    iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    bridgeType: project.interopConfig.bridgeType,
    volume: 15_000_000,
    tokens: mockTokens,
    chains: mockChains,
    transferCount: 5000,
    averageValue: 3000,
    averageDuration: { type: 'single', duration: 100_000 },
  }))

  return {
    top3Paths,
    topProtocols,
    entries: allProtocols,
  }
}
