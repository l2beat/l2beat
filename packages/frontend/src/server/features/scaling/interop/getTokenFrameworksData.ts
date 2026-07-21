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
import { ps } from '~/server/projects'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'
import { manifest } from '~/utils/Manifest'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
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
import { getAverageDurationSeconds } from './utils/getAverageDuration'
import { getInteropChains } from './utils/getInteropChains'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getPreviousProtocolData } from './utils/getPreviousProtocolData'
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
  issuer: string | null
  iconUrl: string
  volume: number
  transferCount: number
  topRoute: TopTokenChainRoute | undefined
  frameworkId: string | undefined
  isUnknown?: boolean
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
  topTokens: TopTokenItem[]
  frameworkTable: FrameworkTableEntry[]
  transferSizeChartData: TransferSizeDataPoint[] | undefined
  snapshotTimestamp: number | undefined
  changePeriod: PercentageChangePeriod
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
      getLatestAggregatedInteropTransferWithTokens({
        selection: params,
        types: ['lockAndMint', 'burnAndMint'],
        protocolIds: frameworkProjectIds,
      }),
    ])

  const records = dropCanonicalSideInLockAndMint(rawRecords)
  const unknownItemsByFrameworkId = getUnknownTokenItemsByFramework(rawRecords)

  const previousProtocolData = await getPreviousProtocolData(
    snapshotTimestamp,
    params,
    frameworkProjectIds,
    ['lockAndMint', 'burnAndMint'],
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

  const topTokens = buildTopTokens(records, tokensDetailsMap, TOP_TOKENS_LIMIT)

  const recordsByFramework = groupBy(records, (record) => record.id)
  const frameworkTable: FrameworkTableEntry[] = []
  for (const framework of TOKEN_FRAMEWORKS) {
    const frameworkRecords = recordsByFramework[framework.projectId] || []
    const tokens = buildTopTokens(frameworkRecords, tokensDetailsMap)
    const unknown = unknownItemsByFrameworkId.get(framework.id)
    frameworkTable.push({
      id: framework.id,
      tokens: unknown ? [...tokens, unknown] : tokens,
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
    name: projectNameToFrameworkLabel.get(entry.name) ?? entry.name,
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
    snapshotTimestamp,
    changePeriod: 'last24h',
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
export function dropCanonicalSideInLockAndMint(
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

// One-sided lockAndMint records are those where we observed only the lock
// side: every token has mintedValueUsd === 0 and burnedValueUsd === 0. The
// framework-issued (minted) counterpart is unknown to us, so the record
// otherwise drops out of the per-token aggregation done in `buildTopTokens`.
// We surface these as a synthetic "Unknown" entry per framework instead.
export function getUnknownTokenItemsByFramework(
  records: AggregatedInteropTransferWithTokens[],
): Map<string, TopTokenItem> {
  const result = new Map<string, TopTokenItem>()
  for (const record of records) {
    if (record.bridgeType !== 'lockAndMint') continue
    const hasFrameworkSide = record.tokens.some(
      (token) =>
        (token.mintedValueUsd ?? 0) > 0 || (token.burnedValueUsd ?? 0) > 0,
    )
    if (hasFrameworkSide) continue
    const frameworkId = frameworkIdByProjectId.get(record.id)
    if (!frameworkId) continue
    const volume = getInteropTransferValue(record) ?? 0
    const transferCount = record.transferCount ?? 0
    if (volume === 0 && transferCount === 0) continue
    const current = result.get(frameworkId) ?? {
      id: `unknown-${frameworkId}`,
      symbol: 'Unknown',
      issuer: null,
      iconUrl: TOKEN_PLACEHOLDER_ICON_URL,
      volume: 0,
      transferCount: 0,
      topRoute: undefined,
      frameworkId,
      isUnknown: true,
    }
    result.set(frameworkId, {
      ...current,
      volume: current.volume + volume,
      transferCount: current.transferCount + transferCount,
    })
  }
  return result
}

export function buildFrameworkEntry(
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
    averageDurationSeconds: getAverageDurationSeconds(data, project),
    averageValue:
      data.identifiedTransferCount > 0
        ? data.volume / data.identifiedTransferCount
        : null,
  }
}

const frameworkIdByProjectId = new Map(
  TOKEN_FRAMEWORKS.map((f) => [f.projectId.toString(), f.id]),
)

export function buildTopTokens(
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
    const [protocolId] = data.protocols.keys()
    items.push({
      id: abstractTokenId,
      symbol: details.symbol,
      issuer: details.issuer,
      iconUrl: details.iconUrl,
      volume: data.volume,
      transferCount: data.transferCount,
      topRoute: getTopRoute(data),
      frameworkId: protocolId
        ? frameworkIdByProjectId.get(protocolId)
        : undefined,
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

export function buildChainPaths(
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

export function buildBridgingTypeBreakdown(
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

  const transferSizeChartData: TransferSizeDataPoint[] = TOKEN_FRAMEWORKS.map(
    (framework, i) => ({
      name: framework.label,
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
    }),
  )

  const mockTokens: TopTokenItem[] = [
    {
      id: 'usdt0',
      symbol: 'USDT0',
      issuer: 'tether',
      iconUrl:
        'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
      volume: 110_110_000,
      transferCount: 930,
      topRoute: {
        src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
        dst: { id: 'arbitrum', iconUrl: '/icons/arbitrum.png' },
      },
      frameworkId: 'oft',
    },
    {
      id: 'usdt',
      symbol: 'USDT',
      issuer: 'tether',
      iconUrl:
        'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
      volume: 46_670_000,
      transferCount: 131,
      topRoute: {
        src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
        dst: { id: 'optimism', iconUrl: '/icons/optimism.png' },
      },
      frameworkId: 'cct',
    },
    {
      id: 'susde',
      symbol: 'sUSDe',
      issuer: 'ethena',
      iconUrl:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      volume: 38_100_000,
      transferCount: 99,
      topRoute: {
        src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
        dst: { id: 'base', iconUrl: '/icons/base.png' },
      },
      frameworkId: 'warp',
    },
    {
      id: 'usdt0-2',
      symbol: 'USDT0',
      issuer: 'tether',
      iconUrl:
        'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
      volume: 30_500_000,
      transferCount: 23,
      topRoute: {
        src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
        dst: { id: 'arbitrum', iconUrl: '/icons/arbitrum.png' },
      },
      frameworkId: 'ntt',
    },
    {
      id: 'usde',
      symbol: 'USDe',
      issuer: 'ethena',
      iconUrl:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      volume: 10_130_000,
      transferCount: 2,
      topRoute: {
        src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
        dst: { id: 'optimism', iconUrl: '/icons/optimism.png' },
      },
      frameworkId: 'its',
    },
  ]

  const topTokens: TopTokenItem[] = mockTokens

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
    snapshotTimestamp: UnixTime.now(),
    changePeriod: 'last24h',
  }
}
