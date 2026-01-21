import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getTokenDb } from '~/server/tokenDb'
import { manifest } from '~/utils/Manifest'
import type { InteropDashboardParams } from './types'
import {
  getProtocolsByType,
  type ProtocolsByType,
} from './utils/getProtocolsByType'
import { getTopPaths, type InteropPathData } from './utils/getTopPaths'
import {
  getTopProtocols,
  type InteropProtocolData,
} from './utils/getTopProtocols'

export type InteropDashboardData = {
  top3Paths: InteropPathData[]
  topProtocols: InteropProtocolData[]
  protocolsByType: ProtocolsByType
}

export async function getInteropDashboardData(
  params: InteropDashboardParams,
): Promise<InteropDashboardData> {
  if (env.MOCK) {
    return getMockInteropDashboardData()
  }
  const tokenDb = getTokenDb()
  const db = getDb()
  const records =
    await db.aggregatedInteropTransfer.getByChainsAndLatestTimestamp(
      params.from,
      params.to,
    )

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  const tokensDetailsData = await tokenDb.abstractToken.getByIds(
    records.flatMap((r) => Object.keys(r.tokensByVolume)),
  )
  const tokensDetailsDataMap = new Map<
    string,
    { symbol: string; iconUrl: string | null }
  >(tokensDetailsData.map((t) => [t.id, t]))

  return {
    top3Paths: getTopPaths(records),
    topProtocols: getTopProtocols(records, interopProjects),
    protocolsByType: getProtocolsByType(
      records,
      tokensDetailsDataMap,
      interopProjects,
    ),
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
    },
    {
      id: 'usdc01',
      symbol: 'USDC',
      iconUrl:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      volume: 5_000_000,
    },
  ]

  const protocolsByTypeMap = {
    nonMinting: [] as ProtocolsByType['nonMinting'],
    lockAndMint: [] as ProtocolsByType['lockAndMint'],
    omniChain: [] as ProtocolsByType['omniChain'],
  }

  for (const project of interopProjects) {
    const data = {
      protocolName: project.interopConfig.name ?? project.name,
      iconSlug: project.slug,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      volume: 15_000_000,
      tokens: mockTokens,
    }

    if (project.interopConfig.bridgeType === 'nonMinting') {
      protocolsByTypeMap.nonMinting.push(data)
    } else if (project.interopConfig.bridgeType === 'lockAndMint') {
      protocolsByTypeMap.lockAndMint.push({ ...data, averageDuration: 100_000 })
    } else if (project.interopConfig.bridgeType === 'omnichain') {
      protocolsByTypeMap.omniChain.push(data)
    }
  }

  return {
    top3Paths,
    topProtocols,
    protocolsByType: protocolsByTypeMap,
  }
}
