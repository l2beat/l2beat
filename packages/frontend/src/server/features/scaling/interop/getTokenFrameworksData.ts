import type { Project } from '@l2beat/config'
import { unique } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'
import { env } from '~/env'
import { ps } from '~/server/projects'
import type {
  AggregatedInteropTransferWithTokens,
  InteropSelectionInput,
  TokenFlowData,
} from './types'
import {
  buildTokensDataMap,
  type TokenInteropData,
} from './utils/buildTokensDataMap'
import {
  buildTokensDetailsMap,
  type TokensDetailsMap,
} from './utils/buildTokensDetailsMap'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import {
  getProtocolsDataMap,
  type ProtocolData,
} from './utils/getProtocolsDataMap'
import {
  TOKEN_FRAMEWORKS,
  type TokenFrameworkDefinition,
} from './utils/tokenFrameworksList'

const TOP_TOKENS_LIMIT = 5

export type FrameworkDominanceEntry = {
  id: string
  volume: number
  transferCount: number
  averageDurationSeconds: number | null
  averageValue: number | null
}

export type FrameworkDominanceMetric = {
  total: number
  entries: FrameworkDominanceEntry[]
}

export type TopTokenChainRoute = {
  src: { id: string; iconUrl: string | undefined }
  dst: { id: string; iconUrl: string | undefined }
}

export type TopTokenItem = {
  id: string
  symbol: string
  iconUrl: string
  volume: number
  transferCount: number
  topRoute: TopTokenChainRoute | undefined
}

export type TokenFrameworksData = {
  frameworkDominance: {
    transfers: FrameworkDominanceMetric
    volume: FrameworkDominanceMetric
  }
  topTokens: Record<string, TopTokenItem[]>
}

export async function getTokenFrameworksData(
  params: InteropSelectionInput,
): Promise<TokenFrameworksData> {
  if (env.MOCK) {
    return getMockTokenFrameworksData()
  }

  const frameworkProjectIds = TOKEN_FRAMEWORKS.map((f) => f.projectId)

  const [interopProjects, { records }] = await Promise.all([
    ps.getProjects({ select: ['interopConfig'] }),
    getLatestAggregatedInteropTransferWithTokens(
      params,
      undefined,
      frameworkProjectIds,
    ),
  ])

  const protocolsDataMap = getProtocolsDataMap(records)
  const projectsById = new Map(interopProjects.map((p) => [p.id, p]))

  const entries: FrameworkDominanceEntry[] = TOKEN_FRAMEWORKS.map((framework) =>
    buildFrameworkEntry(
      framework,
      protocolsDataMap.get(framework.projectId),
      projectsById.get(framework.projectId),
    ),
  )

  const abstractTokenIds = unique(
    records.flatMap((record) =>
      record.tokens.map((token) => token.abstractTokenId),
    ),
  )
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)

  const topTokens: Record<string, TopTokenItem[]> = {
    all: buildTopTokens(records, tokensDetailsMap),
  }
  const recordsByFramework = groupBy(records, (record) => record.id)
  for (const framework of TOKEN_FRAMEWORKS) {
    const frameworkRecords = recordsByFramework[framework.projectId] || []
    topTokens[framework.id] = buildTopTokens(frameworkRecords, tokensDetailsMap)
  }

  return {
    frameworkDominance: {
      transfers: {
        total: sumBy(entries, (e) => e.transferCount),
        entries: [...entries].sort((a, b) => b.transferCount - a.transferCount),
      },
      volume: {
        total: sumBy(entries, (e) => e.volume),
        entries: [...entries].sort((a, b) => b.volume - a.volume),
      },
    },
    topTokens,
  }
}

function buildFrameworkEntry(
  framework: TokenFrameworkDefinition,
  data: ProtocolData | undefined,
  project: Project<'interopConfig'> | undefined,
): FrameworkDominanceEntry {
  if (!data) {
    return {
      id: framework.id,
      volume: 0,
      transferCount: 0,
      averageDurationSeconds: null,
      averageValue: null,
    }
  }

  return {
    id: framework.id,
    volume: data.volume,
    transferCount: data.transferCount,
    averageDurationSeconds: getSingleAverageDurationSeconds(data, project),
    averageValue:
      data.identifiedTransferCount > 0
        ? data.volume / data.identifiedTransferCount
        : null,
  }
}

function getSingleAverageDurationSeconds(
  data: ProtocolData,
  project: Project<'interopConfig'> | undefined,
): number | null {
  if (project?.interopConfig.transfersTimeMode === 'unknown') return null
  if (data.transfersWithDurationCount <= 0) return null
  return Math.floor(data.totalDurationSum / data.transfersWithDurationCount)
}

function buildTopTokens(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: TokensDetailsMap,
): TopTokenItem[] {
  const tokenDataMap = buildTokensDataMap(records)
  const ranked = [...tokenDataMap.entries()]
    .sort(([, a], [, b]) => b.volume - a.volume)
    .slice(0, TOP_TOKENS_LIMIT)

  const items: TopTokenItem[] = []
  for (const [abstractTokenId, data] of ranked) {
    const details = tokensDetailsMap.get(abstractTokenId)
    if (!details) continue
    items.push({
      id: abstractTokenId,
      symbol: details.symbol,
      iconUrl: details.iconUrl,
      volume: data.volume,
      transferCount: data.transferCount,
      topRoute: getTopRoute(data),
    })
  }
  return items
}

function getTopRoute(data: TokenInteropData): TopTokenChainRoute | undefined {
  let topFlow: TokenFlowData | undefined
  for (const flow of data.flows.values()) {
    if (!topFlow || flow.volume > topFlow.volume) {
      topFlow = flow
    }
  }
  if (!topFlow) return undefined
  return {
    src: topFlow.srcChain,
    dst: topFlow.dstChain,
  }
}

function getMockTokenFrameworksData(): TokenFrameworksData {
  const entries: FrameworkDominanceEntry[] = TOKEN_FRAMEWORKS.map(
    (framework, i) => ({
      id: framework.id,
      volume: 20_000_000 - i * 3_000_000,
      transferCount: 5000 - i * 800,
      averageDurationSeconds: 100_000 - i * 10_000,
      averageValue: 4000 - i * 500,
    }),
  )

  const mockTokens: TopTokenItem[] = [
    {
      id: 'usdt0',
      symbol: 'USDT0',
      iconUrl:
        'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
      volume: 110_110_000,
      transferCount: 930,
      topRoute: {
        src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
        dst: { id: 'arbitrum', iconUrl: '/icons/arbitrum.png' },
      },
    },
    {
      id: 'usdt',
      symbol: 'USDT',
      iconUrl:
        'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
      volume: 46_670_000,
      transferCount: 131,
      topRoute: {
        src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
        dst: { id: 'optimism', iconUrl: '/icons/optimism.png' },
      },
    },
    {
      id: 'susde',
      symbol: 'sUSDe',
      iconUrl:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      volume: 38_100_000,
      transferCount: 99,
      topRoute: {
        src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
        dst: { id: 'base', iconUrl: '/icons/base.png' },
      },
    },
    {
      id: 'usdt0-2',
      symbol: 'USDT0',
      iconUrl:
        'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
      volume: 30_500_000,
      transferCount: 23,
      topRoute: {
        src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
        dst: { id: 'arbitrum', iconUrl: '/icons/arbitrum.png' },
      },
    },
    {
      id: 'usde',
      symbol: 'USDe',
      iconUrl:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      volume: 10_130_000,
      transferCount: 2,
      topRoute: {
        src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
        dst: { id: 'optimism', iconUrl: '/icons/optimism.png' },
      },
    },
  ]

  const topTokens: Record<string, TopTokenItem[]> = { all: mockTokens }
  for (const framework of TOKEN_FRAMEWORKS) {
    topTokens[framework.id] = mockTokens
  }

  return {
    frameworkDominance: {
      transfers: {
        total: sumBy(entries, (e) => e.transferCount),
        entries: [...entries].sort((a, b) => b.transferCount - a.transferCount),
      },
      volume: {
        total: sumBy(entries, (e) => e.volume),
        entries: [...entries].sort((a, b) => b.volume - a.volume),
      },
    },
    topTokens,
  }
}
