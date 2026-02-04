import { env } from '~/env'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import type { InteropDashboardParams } from './types'
import {
  type AllProtocolsEntry,
  getAllProtocolEntries,
} from './utils/getAllProtocolEntries'
import {
  getProtocolEntries,
  type ProtocolEntry,
} from './utils/getProtocolEntries'
import { getTopPaths, type InteropPathData } from './utils/getTopPaths'
import {
  getTopProtocols,
  type InteropProtocolData,
} from './utils/getTopProtocols'
import {
  getTransferSizeChartData,
  type TransferSizeChartData,
} from './utils/getTransferSizeChartData'
import {
  type GroupedInteropEntries,
  groupByInteropBridgeType,
} from './utils/groupByInteropBridgeType'
import { prepareInteropData } from './utils/prepareInteropData'

export type InteropDashboardData = {
  top3Paths: InteropPathData[]
  topProtocols: InteropProtocolData[]
  transferSizeChartData: TransferSizeChartData | undefined
  top5Cards: GroupedInteropEntries<ProtocolEntry>
  allProtocolsEntries: AllProtocolsEntry[]
}

export async function getInteropDashboardData(
  params: InteropDashboardParams,
): Promise<InteropDashboardData> {
  if (env.MOCK) {
    return getMockInteropDashboardData()
  }

  const { records, tokensDetailsMap, interopProjects, subgroupProjects } =
    await prepareInteropData(params.from, params.to)

  const groupedEntries = groupByInteropBridgeType(
    getProtocolEntries(records, tokensDetailsMap, interopProjects),
  )

  return {
    top3Paths: getTopPaths(records, subgroupProjects),
    topProtocols: getTopProtocols(records, interopProjects, subgroupProjects),
    transferSizeChartData: getTransferSizeChartData(records, interopProjects),
    top5Cards: {
      lockAndMint: groupedEntries.lockAndMint.slice(0, 5),
      nonMinting: groupedEntries.nonMinting.slice(0, 5),
      omnichain: groupedEntries.omnichain.slice(0, 5),
    },
    allProtocolsEntries: getAllProtocolEntries(
      records,
      tokensDetailsMap,
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
      transferCount: 1000,
      avgDuration: { type: 'single', duration: 100_000 } as const,
      avgValue: 10_000,
    },
    {
      id: 'usdc01',
      symbol: 'USDC',
      iconUrl:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      volume: 5_000_000,
      transferCount: 500,
      avgDuration: { type: 'single', duration: 50_000 } as const,
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
      avgDuration: { type: 'single', duration: 100_000 } as const,
      avgValue: 8_000,
    },
    {
      id: 'arbitrum',
      name: 'Arbitrum',
      iconUrl: manifest.getUrl('/icons/arbitrum.png'),
      volume: 5_000_000,
      transferCount: 500,
      avgDuration: { type: 'single', duration: 50_000 } as const,
      avgValue: 10_000,
    },
  ]

  const protocolEntries: ProtocolEntry[] = interopProjects.map((project) => ({
    id: project.id,
    protocolName: project.interopConfig.name ?? project.name,
    isAggregate: project.interopConfig.isAggregate,
    iconSlug: project.slug,
    iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    bridgeType: 'lockAndMint',
    volume: 15_000_000,
    tokens: mockTokens,
    chains: mockChains,
    transferCount: 5000,
    averageValue: 3000,
    averageDuration: { type: 'single', duration: 100_000 },
  }))

  const allProtocolEntries: AllProtocolsEntry[] = interopProjects.map(
    (project) => ({
      id: project.id,
      protocolName: project.interopConfig.name ?? project.name,
      isAggregate: project.interopConfig.isAggregate,
      iconSlug: project.slug,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      bridgeTypes: ['lockAndMint', 'nonMinting', 'omnichain'],
      volume: 15_000_000,
      tokens: mockTokens,
      chains: mockChains,
      transferCount: 5000,
      averageValue: 3000,
      averageDuration: { type: 'single', duration: 100_000 },
    }),
  )

  const transferSizeChartData: TransferSizeChartData = {
    arbitrum: {
      name: 'Arbitrum Canonical',
      iconUrl: manifest.getUrl('/icons/arbitrum.png'),
      countUnder100: 10,
      count100To1K: 12,
      count1KTo10K: 50,
      count10KTo100K: 35,
      countOver100K: 1,
    },
    optimism: {
      name: 'Optimism Canonical',
      iconUrl: manifest.getUrl('/icons/optimism.png'),
      countUnder100: 5,
      count100To1K: 8,
      count1KTo10K: 10,
      count10KTo100K: 4,
      countOver100K: 0,
    },
    base: {
      name: 'Base Canonical',
      iconUrl: manifest.getUrl('/icons/base.png'),
      countUnder100: 5,
      count100To1K: 8,
      count1KTo10K: 10,
      count10KTo100K: 4,
      countOver100K: 0,
    },
  }

  const grouped = groupByInteropBridgeType(protocolEntries)

  return {
    top3Paths,
    topProtocols,
    transferSizeChartData,
    top5Cards: {
      lockAndMint: grouped.lockAndMint.slice(0, 5),
      nonMinting: grouped.nonMinting.slice(0, 5),
      omnichain: grouped.omnichain.slice(0, 5),
    },
    allProtocolsEntries: allProtocolEntries,
  }
}
