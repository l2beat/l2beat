import type { Project } from '@l2beat/config'
import {
  getInteropTransferValue,
  type InteropBridgeType,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
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
import { getInteropChains } from './utils/getInteropChains'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import {
  getProtocolsDataMap,
  type ProtocolData,
} from './utils/getProtocolsDataMap'
import {
  getTransferSizeChartData,
  type TransferSizeDataPoint,
} from './utils/getTransferSizeChartData'
import {
  TOKEN_FRAMEWORKS,
  type TokenFrameworkDefinition,
} from './utils/tokenFrameworksList'

const TOP_TOKENS_LIMIT = 5

export type FrameworkDominanceEntry = {
  id: string
  volume: number
  transferCount: number
  previousVolume: number | null
  previousTransferCount: number | null
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

export type FrameworkTransferSizeDataPoint = TransferSizeDataPoint & {
  frameworkLabel: string | undefined
}

export type FrameworkChainPathItem = {
  src: { id: string; iconUrl: string | undefined }
  dst: { id: string; iconUrl: string | undefined }
  volume: number
  transferCount: number
}

export type FrameworkBridgingTypeItem = {
  type: InteropBridgeType
  volume: number
  transferCount: number
}

export type FrameworkTableEntry = {
  id: string
  tokens: TopTokenItem[]
  chainPaths: FrameworkChainPathItem[]
  bridgingTypeBreakdown: FrameworkBridgingTypeItem[]
}

export type TokenFrameworksData = {
  frameworkDominance: {
    transfers: FrameworkDominanceMetric
    volume: FrameworkDominanceMetric
  }
  topTokens: Record<string, TopTokenItem[]>
  frameworkTable: FrameworkTableEntry[]
  transferSizeChartData: FrameworkTransferSizeDataPoint[] | undefined
}

export async function getTokenFrameworksData(
  params: InteropSelectionInput,
): Promise<TokenFrameworksData> {
  if (env.MOCK) {
    return getMockTokenFrameworksData()
  }

  const frameworkProjectIds = TOKEN_FRAMEWORKS.map((f) => f.projectId)

  const [interopProjects, { records: rawRecords, snapshotTimestamp }] =
    await Promise.all([
      ps.getProjects({ select: ['interopConfig'] }),
      getLatestAggregatedInteropTransferWithTokens(
        params,
        ['lockAndMint', 'burnAndMint'],
        frameworkProjectIds,
      ),
    ])

  const records = keepFrameworkTokenInLockAndMint(rawRecords)

  const previousProtocolData = await getPreviousProtocolData(
    snapshotTimestamp,
    params,
    frameworkProjectIds,
  )

  const protocolsDataMap = getProtocolsDataMap(records)
  const projectsById = new Map(interopProjects.map((p) => [p.id, p]))

  const entries: FrameworkDominanceEntry[] = TOKEN_FRAMEWORKS.map((framework) =>
    buildFrameworkEntry(
      framework,
      protocolsDataMap.get(framework.projectId),
      projectsById.get(framework.projectId),
      previousProtocolData.get(framework.projectId),
    ),
  )

  const abstractTokenIds = unique(
    records.flatMap((record) =>
      record.tokens.map((token) => token.abstractTokenId),
    ),
  )
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)

  const topTokens: Record<string, TopTokenItem[]> = {
    all: buildTopTokens(records, tokensDetailsMap, TOP_TOKENS_LIMIT),
  }
  const recordsByFramework = groupBy(records, (record) => record.id)
  const frameworkTable: FrameworkTableEntry[] = []
  for (const framework of TOKEN_FRAMEWORKS) {
    const frameworkRecords = recordsByFramework[framework.projectId] || []
    topTokens[framework.id] = buildTopTokens(
      frameworkRecords,
      tokensDetailsMap,
      TOP_TOKENS_LIMIT,
    )
    frameworkTable.push({
      id: framework.id,
      tokens: buildTopTokens(frameworkRecords, tokensDetailsMap),
      chainPaths: buildChainPaths(frameworkRecords),
      bridgingTypeBreakdown: buildBridgingTypeBreakdown(frameworkRecords),
    })
  }

  const projectNameToFrameworkLabel = new Map<string, string>()
  for (const framework of TOKEN_FRAMEWORKS) {
    const project = projectsById.get(framework.projectId)
    if (!project) continue
    const name = project.interopConfig.name ?? project.name
    projectNameToFrameworkLabel.set(name, framework.label)
  }
  const transferSizeChartData = getTransferSizeChartData(
    records,
    interopProjects,
  )?.map((entry) => ({
    ...entry,
    frameworkLabel: projectNameToFrameworkLabel.get(entry.name),
  }))

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
    frameworkTable,
    transferSizeChartData,
  }
}

// In a lockAndMint record both the canonical underlying token (e.g. USDT) and
// the framework-issued token (e.g. USDT0 for OFT, the wrapped token for CCT /
// NTT / Warp / ITS) show up as separate entries in `record.tokens`. For the
// token-frameworks page we only want the framework-issued side counted in top
// tokens and per-framework tables — otherwise the underlying canonical token
// appears alongside its wrapped counterpart and inflates the ranking.
//
// The framework-issued side is the one that is minted (forward direction) or
// burned (reverse direction), so it always has mintedValueUsd > 0 or
// burnedValueUsd > 0. The canonical side is only locked/unlocked and has both
// at 0.
function keepFrameworkTokenInLockAndMint(
  records: AggregatedInteropTransferWithTokens[],
): AggregatedInteropTransferWithTokens[] {
  return records.map((record) => {
    if (record.bridgeType !== 'lockAndMint') {
      return record
    }
    const frameworkTokens = record.tokens.filter(
      (token) =>
        (token.mintedValueUsd ?? 0) > 0 || (token.burnedValueUsd ?? 0) > 0,
    )
    return { ...record, tokens: frameworkTokens }
  })
}

function buildFrameworkEntry(
  framework: TokenFrameworkDefinition,
  data: ProtocolData | undefined,
  project: Project<'interopConfig'> | undefined,
  previous: { volume: number; transferCount: number } | undefined,
): FrameworkDominanceEntry {
  if (!data) {
    return {
      id: framework.id,
      volume: 0,
      transferCount: 0,
      previousVolume: previous?.volume ?? null,
      previousTransferCount: previous?.transferCount ?? null,
      averageDurationSeconds: null,
      averageValue: null,
    }
  }

  return {
    id: framework.id,
    volume: data.volume,
    transferCount: data.transferCount,
    previousVolume: previous?.volume ?? null,
    previousTransferCount: previous?.transferCount ?? null,
    averageDurationSeconds: getSingleAverageDurationSeconds(data, project),
    averageValue:
      data.identifiedTransferCount > 0
        ? data.volume / data.identifiedTransferCount
        : null,
  }
}

async function getPreviousProtocolData(
  snapshotTimestamp: UnixTime | undefined,
  params: InteropSelectionInput,
  frameworkProjectIds: string[],
): Promise<Map<string, { volume: number; transferCount: number }>> {
  const result = new Map<string, { volume: number; transferCount: number }>()
  if (!snapshotTimestamp) return result
  const db = getDb()

  const previousTimestamp = snapshotTimestamp - UnixTime.DAY
  const previousRecords =
    await db.aggregatedInteropTransfer.getByChainsAndTimestamp(
      previousTimestamp,
      params.from,
      params.to,
      ['lockAndMint', 'burnAndMint'],
      frameworkProjectIds,
    )

  for (const record of previousRecords) {
    const current = result.get(record.id) ?? { volume: 0, transferCount: 0 }
    current.volume += getInteropTransferValue(record) ?? 0
    current.transferCount += record.transferCount ?? 0
    result.set(record.id, current)
  }
  return result
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
  limit?: number,
): TopTokenItem[] {
  const tokenDataMap = buildTokensDataMap(records)
  const ranked = [...tokenDataMap.entries()].sort(
    ([, a], [, b]) => b.volume - a.volume,
  )
  const sliced = limit !== undefined ? ranked.slice(0, limit) : ranked

  const items: TopTokenItem[] = []
  for (const [abstractTokenId, data] of sliced) {
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

const chainIconMap = new Map(
  getInteropChains().map((chain) => [
    chain.id,
    manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
  ]),
)

function buildChainPaths(
  records: AggregatedInteropTransferWithTokens[],
): FrameworkChainPathItem[] {
  const map = new Map<string, FrameworkChainPathItem>()
  for (const record of records) {
    const key = `${record.srcChain}->${record.dstChain}`
    const volume = getInteropTransferValue(record) ?? 0
    const current = map.get(key)
    if (current) {
      current.volume += volume
      current.transferCount += record.transferCount ?? 0
    } else {
      map.set(key, {
        src: {
          id: record.srcChain,
          iconUrl: chainIconMap.get(record.srcChain),
        },
        dst: {
          id: record.dstChain,
          iconUrl: chainIconMap.get(record.dstChain),
        },
        volume,
        transferCount: record.transferCount ?? 0,
      })
    }
  }
  return [...map.values()].sort((a, b) => b.volume - a.volume)
}

function buildBridgingTypeBreakdown(
  records: AggregatedInteropTransferWithTokens[],
): FrameworkBridgingTypeItem[] {
  const map = new Map<InteropBridgeType, FrameworkBridgingTypeItem>()
  for (const record of records) {
    const volume = getInteropTransferValue(record) ?? 0
    const current = map.get(record.bridgeType)
    if (current) {
      current.volume += volume
      current.transferCount += record.transferCount ?? 0
    } else {
      map.set(record.bridgeType, {
        type: record.bridgeType,
        volume,
        transferCount: record.transferCount ?? 0,
      })
    }
  }
  return [...map.values()].sort((a, b) => b.volume - a.volume)
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
      previousVolume: 18_000_000 - i * 2_500_000,
      previousTransferCount: 4500 - i * 750,
      averageDurationSeconds: 100_000 - i * 10_000,
      averageValue: 4000 - i * 500,
    }),
  )

  const transferSizeChartData: FrameworkTransferSizeDataPoint[] =
    TOKEN_FRAMEWORKS.map((framework, i) => ({
      name: framework.projectId.toString(),
      frameworkLabel: framework.label,
      iconUrl: `/icons/${framework.projectId.toString()}.png`,
      countUnder100: 50 - i * 5,
      percentageUnder100: 50 - i * 5,
      count100To1K: 25,
      percentage100To1K: 25,
      count1KTo10K: 15,
      percentage1KTo10K: 15,
      count10KTo100K: 8,
      percentage10KTo100K: 8,
      countOver100K: 2 + i,
      percentageOver100K: 2 + i,
      minTransferValueUsd: 50,
      maxTransferValueUsd: 250_000,
      averageTransferSizeUsd: 12_500,
    }))

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

  const extendedTokens: TopTokenItem[] = []
  for (let i = 0; i < 14; i++) {
    const base = mockTokens[i % mockTokens.length]
    if (!base) continue
    extendedTokens.push({
      ...base,
      id: `${base.id}-extra-${i}`,
      volume: base.volume * (1 - i * 0.05),
      transferCount: Math.max(
        1,
        Math.floor(base.transferCount * (1 - i * 0.07)),
      ),
    })
  }

  const mockChainPaths: FrameworkChainPathItem[] = [
    {
      src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
      dst: { id: 'arbitrum', iconUrl: '/icons/arbitrum.png' },
      volume: 45_000_000,
      transferCount: 820,
    },
    {
      src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
      dst: { id: 'base', iconUrl: '/icons/base.png' },
      volume: 28_000_000,
      transferCount: 540,
    },
    {
      src: { id: 'arbitrum', iconUrl: '/icons/arbitrum.png' },
      dst: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
      volume: 22_000_000,
      transferCount: 410,
    },
    {
      src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
      dst: { id: 'optimism', iconUrl: '/icons/optimism.png' },
      volume: 17_500_000,
      transferCount: 320,
    },
    {
      src: { id: 'base', iconUrl: '/icons/base.png' },
      dst: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
      volume: 12_000_000,
      transferCount: 220,
    },
    {
      src: { id: 'optimism', iconUrl: '/icons/optimism.png' },
      dst: { id: 'base', iconUrl: '/icons/base.png' },
      volume: 8_500_000,
      transferCount: 150,
    },
    {
      src: { id: 'polygon', iconUrl: '/icons/polygon.png' },
      dst: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
      volume: 4_300_000,
      transferCount: 80,
    },
  ]

  const mockBridgingTypeBreakdown: FrameworkBridgingTypeItem[] = [
    { type: 'lockAndMint', volume: 60_000_000, transferCount: 1200 },
    { type: 'burnAndMint', volume: 35_000_000, transferCount: 800 },
    { type: 'nonMinting', volume: 18_000_000, transferCount: 400 },
  ]

  const frameworkTable: FrameworkTableEntry[] = TOKEN_FRAMEWORKS.map(
    (framework) => ({
      id: framework.id,
      tokens: [...mockTokens, ...extendedTokens],
      chainPaths: mockChainPaths,
      bridgingTypeBreakdown: mockBridgingTypeBreakdown,
    }),
  )

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
    frameworkTable,
    transferSizeChartData,
  }
}
