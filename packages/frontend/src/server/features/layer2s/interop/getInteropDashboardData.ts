import { assert, unique } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import type {
  InteropDashboardParams,
  ProtocolDisplayable,
  ProtocolEntry,
  TokenData,
} from './types'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getFlows } from './utils/getFlows'
import { getInteropChains } from './utils/getInteropChains'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getProtocolEntries } from './utils/getProtocolEntries'
import { getSummaryTokensData } from './utils/getSummaryTokensData'
import { getTopItems, type TopItems } from './utils/getTopItems'
import {
  getTopProtocols,
  type InteropProtocolData,
} from './utils/getTopProtocols'
import { getTopToken, type InteropTopTokenData } from './utils/getTopToken'
import {
  getTransferSizeChartData,
  type TransferSizeDataPoint,
} from './utils/getTransferSizeChartData'
import { pickTopProtocolEntries } from './utils/pickTopProtocolEntries'

export type InteropDashboardFlowChain = {
  id: string
  name: string
  iconUrl: string
}

export type InteropDashboardFlow = {
  srcChain: InteropDashboardFlowChain
  dstChain: InteropDashboardFlowChain
  volume: number
  transferCount: number | undefined
}

export type InteropDashboardData = {
  flows: InteropDashboardFlow[]
  topProtocols: InteropProtocolData[]
  topToken: InteropTopTokenData | undefined
  tokenCount: number
  topTokens: TopItems<TokenData>
  transferSizeChartData: TransferSizeDataPoint[] | undefined
  entries: ProtocolEntry[]
  zeroTransferProtocols: ProtocolDisplayable[]
}

export async function getInteropDashboardData(
  params: InteropDashboardParams,
): Promise<InteropDashboardData | null> {
  if (env.MOCK) {
    return getMockInteropDashboardData()
  }

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  const { records, snapshotTimestamp } =
    await getLatestAggregatedInteropTransferWithTokens({
      selection: params,
      types: params.type ? [params.type] : undefined,
    })

  if (records.length === 0) {
    return null
  }

  const identifiedTransferCount = records.reduce(
    (acc, record) => acc + record.identifiedCount,
    0,
  )
  if (identifiedTransferCount === 0) {
    return null
  }

  const abstractTokenIds = unique(
    records.flatMap((r) => r.tokens.map((token) => token.abstractTokenId)),
  )
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)
  const summaryTokens = getSummaryTokensData(
    records,
    tokensDetailsMap,
    interopProjects,
  )

  // Projects that are part of other projects
  const subgroupProjects = new Set(
    interopProjects.filter((p) => p.interopConfig.subgroupId).map((p) => p.id),
  )

  const rawFlows = getFlows(records, params, subgroupProjects).slice(0, 3)
  const interopChains = getInteropChains()
  const flows: InteropDashboardFlow[] = rawFlows.map((flow) => ({
    srcChain: withIconUrl(flow.srcChain, interopChains),
    dstChain: withIconUrl(flow.dstChain, interopChains),
    volume: flow.volume,
    transferCount: flow.transferCount,
  }))

  const data: InteropDashboardData = {
    flows,
    topProtocols: getTopProtocols(records, interopProjects, subgroupProjects),
    topToken: getTopToken({
      records,
      tokensDetailsMap,
      interopProjects,
      subgroupProjects,
    }),
    tokenCount: summaryTokens.length,
    topTokens: getTopItems(summaryTokens, 5),
    transferSizeChartData: getTransferSizeChartData(records, interopProjects),
    ...getProtocolEntries(
      records,
      tokensDetailsMap,
      interopProjects,
      params.type,
      snapshotTimestamp,
      params,
    ),
  }

  // The entries carry heavy nested token/chain data, so callers that only
  // need the top of the table (e.g. the home page card) can cap them.
  if (params.limit !== undefined) {
    data.entries = pickTopProtocolEntries(data, params.limit)
  }

  return data
}

async function getMockInteropDashboardData(): Promise<InteropDashboardData> {
  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  const interopChains = getInteropChains()
  const flows: InteropDashboardFlow[] = [
    {
      srcChain: withIconUrl('ethereum', interopChains),
      dstChain: withIconUrl('optimism', interopChains),
      volume: 35_000_000,
      transferCount: 5400,
    },
    {
      srcChain: withIconUrl('optimism', interopChains),
      dstChain: withIconUrl('ethereum', interopChains),
      volume: 30_000_000,
      transferCount: 4800,
    },
    {
      srcChain: withIconUrl('arbitrum', interopChains),
      dstChain: withIconUrl('base', interopChains),
      volume: 18_000_000,
      transferCount: 2100,
    },
  ]

  const topProtocols: InteropProtocolData[] = interopProjects
    .slice(0, 5)
    .map((project, i) => ({
      name: project.interopConfig.name ?? project.name,
      slug: project.slug,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      volume: { value: 20_000_000 - i * 3_000_000, share: 20 - i * 3 },
      transfers: { value: 5000 - i * 800, share: 20 - i * 3 },
    }))

  const mockTokens: TokenData[] = [
    {
      id: 'eth001',
      symbol: 'ETH',
      issuer: 'ethereum',
      iconUrl:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
      topProtocol: undefined,
      volume: 10_000_000,
      transferCount: 1000,
      avgDuration: { type: 'single', duration: 100_000 } as const,
      avgValue: 10_000,
      minTransferValueUsd: 8_500,
      maxTransferValueUsd: 12_000,
      netMintedValue: undefined,
      flows: [],
    },
    {
      id: 'usdc01',
      symbol: 'USDC',
      issuer: 'circle',
      iconUrl:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      topProtocol: undefined,
      volume: 5_000_000,
      transferCount: 500,
      avgDuration: { type: 'single', duration: 50_000 } as const,
      avgValue: 10_000,
      minTransferValueUsd: 9_500,
      maxTransferValueUsd: 10_500,
      netMintedValue: undefined,
      flows: [],
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
      minTransferValueUsd: 6_000,
      maxTransferValueUsd: 12_000,
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
      minTransferValueUsd: 7_500,
      maxTransferValueUsd: 14_000,
      netMintedValue: undefined,
    },
  ]

  const entries: ProtocolEntry[] = interopProjects.map((project) => ({
    id: project.id,
    slug: project.slug,
    name: project.interopConfig.name ?? project.name,
    shortName: project.interopConfig.shortName,
    description: project.interopConfig.description,
    type: project.interopConfig.type,
    isAggregate: project.interopConfig.isAggregate,
    subgroup: undefined,
    iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    bridgeTypes: ['lockAndMint', 'nonMinting', 'burnAndMint'],
    volume: 15_000_000,
    tokens: { items: mockTokens, remainingCount: 2 },
    chains: { items: mockChains, remainingCount: 4 },
    transferCount: 5000,
    averageValue: 3000,
    minTransferValueUsd: 100,
    maxTransferValueUsd: 100_000,
    averageDuration: { type: 'single', duration: 100_000 },
    byBridgeType: undefined,
    averageValueInFlight: undefined,
    netMintedValue: undefined,
    topRoute: undefined,
    snapshotTimestamp: undefined,
    filterable: [],
  }))

  const firstMockToken = mockTokens[0]
  const topToken: InteropTopTokenData | undefined = firstMockToken
    ? {
        id: firstMockToken.id,
        symbol: firstMockToken.symbol,
        issuer: firstMockToken.issuer,
        iconUrl: firstMockToken.iconUrl,
        volume: firstMockToken.volume ?? 0,
        transferCount: firstMockToken.transferCount,
        topProtocol: interopProjects[0]
          ? {
              name:
                interopProjects[0].interopConfig.name ??
                interopProjects[0].shortName ??
                interopProjects[0].name,
              slug: interopProjects[0].slug,
              iconUrl: manifest.getUrl(`/icons/${interopProjects[0].slug}.png`),
            }
          : undefined,
      }
    : undefined

  const transferSizeChartData: TransferSizeDataPoint[] = [
    {
      name: 'Arbitrum Canonical',
      iconUrl: manifest.getUrl('/icons/arbitrum.png'),
      countUnder100: 10,
      percentageUnder100: 10,
      count100To1K: 12,
      percentage100To1K: 12,
      count1KTo10K: 50,
      percentage1KTo10K: 50,
      count10KTo100K: 35,
      percentage10KTo100K: 35,
      countOver100K: 1,
      percentageOver100K: 1,
      minTransferValueUsd: 50,
      maxTransferValueUsd: 250_000,
      averageTransferSizeUsd: 12_500,
    },
    {
      name: 'Optimism Canonical',
      iconUrl: manifest.getUrl('/icons/optimism.png'),
      countUnder100: 5,
      percentageUnder100: 5,
      count100To1K: 8,
      percentage100To1K: 8,
      count1KTo10K: 10,
      percentage1KTo10K: 10,
      count10KTo100K: 4,
      percentage10KTo100K: 4,
      countOver100K: 0,
      percentageOver100K: 0,
      minTransferValueUsd: 75,
      maxTransferValueUsd: 90_000,
      averageTransferSizeUsd: 6_700,
    },
    {
      name: 'Base Canonical',
      iconUrl: manifest.getUrl('/icons/base.png'),
      countUnder100: 5,
      percentageUnder100: 5,
      count100To1K: 8,
      percentage100To1K: 8,
      count1KTo10K: 10,
      percentage1KTo10K: 10,
      count10KTo100K: 4,
      percentage10KTo100K: 4,
      countOver100K: 0,
      percentageOver100K: 0,
      minTransferValueUsd: 120,
      maxTransferValueUsd: 80_000,
      averageTransferSizeUsd: 5_900,
    },
  ]

  return {
    flows,
    topProtocols,
    topToken,
    tokenCount: mockTokens.length,
    topTokens: getTopItems(mockTokens, 5),
    transferSizeChartData,
    entries,
    zeroTransferProtocols: [
      {
        name: 'Base Canonical',
        slug: 'base',
        iconUrl: manifest.getUrl('/icons/base.png'),
      },
    ],
  }
}

function withIconUrl(
  chainId: string,
  interopChains: ReturnType<typeof getInteropChains>,
): InteropDashboardFlowChain {
  const chain = interopChains.find((c) => c.id === chainId)
  assert(chain, `Chain not found: ${chainId}`)
  return {
    id: chain.id,
    name: chain.name,
    iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
  }
}
