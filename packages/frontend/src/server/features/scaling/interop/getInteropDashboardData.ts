import { unique } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import type { InteropDashboardParams, ProtocolEntry } from './types'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getProtocolEntries } from './utils/getAllProtocolEntries'
import { getFlows, type InteropFlowData } from './utils/getFlows'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import {
  getTopProtocols,
  type InteropProtocolData,
} from './utils/getTopProtocols'
import { getTopToken, type InteropTopTokenData } from './utils/getTopToken'
import {
  getTransferSizeChartData,
  type TransferSizeChartData,
} from './utils/getTransferSizeChartData'

export type InteropDashboardData = {
  flows: InteropFlowData[]
  topProtocols: InteropProtocolData[]
  topToken: InteropTopTokenData | undefined
  transferSizeChartData: TransferSizeChartData | undefined
  entries: ProtocolEntry[]
}

export async function getInteropDashboardData(
  params: InteropDashboardParams,
): Promise<InteropDashboardData> {
  if (env.MOCK) {
    return getMockInteropDashboardData()
  }

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  const records = await getLatestAggregatedInteropTransferWithTokens(
    params.first,
    params.second,
    params.type,
  )

  const abstractTokenIds = unique(
    records.flatMap((r) => r.tokens.map((token) => token.abstractTokenId)),
  )
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)

  // Projects that are part of other projects
  const subgroupProjects = new Set(
    interopProjects.filter((p) => p.interopConfig.subgroupId).map((p) => p.id),
  )

  return {
    flows: getFlows(records, subgroupProjects),
    topProtocols: getTopProtocols(records, interopProjects, subgroupProjects),
    topToken: getTopToken({
      records,
      tokensDetailsMap,
      interopProjects,
      subgroupProjects,
    }),
    transferSizeChartData: getTransferSizeChartData(records, interopProjects),
    entries: getProtocolEntries(records, tokensDetailsMap, interopProjects),
  }
}

async function getMockInteropDashboardData(): Promise<InteropDashboardData> {
  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  const flows: InteropFlowData[] = [
    { srcChain: 'ethereum', dstChain: 'optimism', volume: 35_000_000 },
    { srcChain: 'optimism', dstChain: 'ethereum', volume: 30_000_000 },
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
      netMintedValue: undefined,
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
      netMintedValue: undefined,
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
      netMintedValue: undefined,
    },
    {
      id: 'arbitrum',
      name: 'Arbitrum',
      iconUrl: manifest.getUrl('/icons/arbitrum.png'),
      volume: 5_000_000,
      transferCount: 500,
      avgDuration: { type: 'single', duration: 50_000 } as const,
      avgValue: 10_000,
      netMintedValue: undefined,
    },
  ]

  const entries: ProtocolEntry[] = interopProjects.map((project) => ({
    id: project.id,
    protocolName: project.interopConfig.name ?? project.name,
    isAggregate: project.interopConfig.isAggregate,
    subgroup: undefined,
    iconSlug: project.slug,
    iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    bridgeTypes: ['lockAndMint', 'nonMinting', 'burnAndMint'],
    volume: 15_000_000,
    tokens: { items: mockTokens, remainingCount: 2 },
    chains: { items: mockChains, remainingCount: 4 },
    transferCount: 5000,
    averageValue: 3000,
    averageDuration: { type: 'single', duration: 100_000 },
    byBridgeType: undefined,
    averageValueInFlight: undefined,
    netMintedValue: undefined,
  }))

  const topToken: InteropTopTokenData | undefined = mockTokens[0]
    ? {
        symbol: mockTokens[0].symbol,
        iconUrl: mockTokens[0].iconUrl,
        volume: mockTokens[0].volume,
        transferCount: mockTokens[0].transferCount,
        topProtocol: interopProjects[0]
          ? {
              name:
                interopProjects[0].interopConfig.name ??
                interopProjects[0].name,
              iconUrl: manifest.getUrl(`/icons/${interopProjects[0].slug}.png`),
            }
          : undefined,
      }
    : undefined

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

  return {
    flows,
    topProtocols,
    topToken,
    transferSizeChartData,
    entries,
  }
}
