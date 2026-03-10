import { INTEROP_CHAINS } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import round from 'lodash/round'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { manifest } from '~/utils/Manifest'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import type { TransferSizeDataPoint } from './utils/getTransferSizeChartData'

const FRAMEWORK_IDS = [
  'layerzero',
  'axelar-its',
  'wormhole-ntt',
  'hyperlane-hwr',
  'ccip',
] as const

export type FrameworkId = (typeof FRAMEWORK_IDS)[number]

const TYPE_PATTERNS: Record<FrameworkId, string> = {
  layerzero: 'oftv2.%',
  'axelar-its': 'axelar-its.%',
  'wormhole-ntt': 'wormhole-ntt.%',
  'hyperlane-hwr': 'hyperlane%',
  ccip: 'ccip.%',
}

export interface FrameworkOverview {
  id: FrameworkId
  name: string
  shortName: string
  provider: string
  iconUrl: string
  volume: number
  transfers: number
  avgDurationSec: number | null
  bridgeTypes: { type: string; count: number; volume: number }[]
  volumeChange7d: number
  volumeSeries: { timestamp: number; volume: number; transfers: number }[]
}

export interface TransferSpeedStats {
  frameworkId: FrameworkId
  count: number
  volumeUsd: number
  p50Sec: number
  p95Sec: number
  minSec: number
  maxSec: number
  srcChainCount: number
  dstChainCount: number
}

export interface ChainInfo {
  id: string
  name: string
  iconUrl: string
}

export interface ChainCoverageData {
  frameworkId: FrameworkId
  chains: string[]
}

export interface TopToken {
  frameworkId: FrameworkId
  symbol: string
  count: number
  volumeUsd: number
  iconUrl: string | undefined
}

export interface ChainPair {
  frameworkId: FrameworkId
  srcChain: string
  dstChain: string
  count: number
  volumeUsd: number
}

export interface PathSpeedStats {
  frameworkId: FrameworkId
  srcChain: string
  dstChain: string
  count: number
  p50Sec: number
}

export interface FrameworkComparisonData {
  generatedAt: string
  frameworks: FrameworkOverview[]
  transferSpeed: TransferSpeedStats[]
  pathSpeed: PathSpeedStats[]
  chainCoverage: ChainCoverageData[]
  topTokens: TopToken[]
  chainPairs: ChainPair[]
  transferSizeChartData: TransferSizeDataPoint[]
  chainMap: Record<string, ChainInfo>
  allTrackedChains: ChainInfo[]
}

export async function getFrameworkComparisonData(): Promise<FrameworkComparisonData> {
  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  const frameworkProjects = interopProjects.filter((p) =>
    (FRAMEWORK_IDS as readonly string[]).includes(p.id),
  )

  const db = getDb()
  const allTypePatterns = Object.values(TYPE_PATTERNS)
  const since = UnixTime.now() - UnixTime.DAY

  const [
    aggregated,
    dailySeries,
    speedStats,
    pathSpeedRaw,
    chainCoverageRaw,
    topTokensRaw,
    chainPairsRaw,
    sizeDistRaw,
    syncedChainIds,
  ] = await Promise.all([
    db.aggregatedInteropTransfer.getSevenDayAggregatedByFramework([
      ...FRAMEWORK_IDS,
    ]),
    Promise.all(
      FRAMEWORK_IDS.map((id) =>
        db.aggregatedInteropTransfer.getDailySeriesById(id),
      ),
    ),
    db.interopTransfer.getTransferSpeedStats(allTypePatterns, since),
    db.interopTransfer.getPathSpeedStats(allTypePatterns, since),
    db.interopTransfer.getChainCoverage(allTypePatterns, since),
    db.interopTransfer.getTopTokens(allTypePatterns, since),
    db.interopTransfer.getChainPairs(allTypePatterns, since),
    db.aggregatedInteropTransfer.getSevenDaySizeDistribution([
      ...FRAMEWORK_IDS,
    ]),
    db.interopPluginSyncedRange.getSyncedChains(),
  ])

  const seriesByFw = Object.fromEntries(
    FRAMEWORK_IDS.map((id, i) => [id, dailySeries[i]]),
  )

  const frameworks: FrameworkOverview[] = FRAMEWORK_IDS.map((id) => {
    const project = frameworkProjects.find((p) => p.id === id)
    const fwRows = aggregated.filter(
      (r) => r.id === id && r.bridgeType !== 'nonMinting',
    )

    const volume = fwRows.reduce((s, r) => s + r.volumeUsd, 0)
    const transfers = fwRows.reduce((s, r) => s + r.transferCount, 0)
    const totalDuration = fwRows.reduce(
      (s, r) => s + r.avgDurationSec * r.transferCount,
      0,
    )

    const label = getFrameworkLabel(id)
    const series = seriesByFw[id] ?? []

    const recent7d = series.slice(-7)
    const prev7d = series.slice(-14, -7)
    const recent7dVolume = recent7d.reduce((s, d) => s + d.totalSrcValueUsd, 0)
    const prev7dVolume = prev7d.reduce((s, d) => s + d.totalSrcValueUsd, 0)

    return {
      id,
      name: project?.interopConfig.name ?? project?.name ?? label.name,
      shortName: label.shortName,
      provider: label.provider,
      iconUrl: project
        ? manifest.getUrl(`/icons/${project.slug}.png`)
        : manifest.getUrl('/icons/default.png'),
      volume,
      transfers,
      avgDurationSec:
        transfers > 0 ? Math.round(totalDuration / transfers) : null,
      bridgeTypes: fwRows.map((r) => ({
        type: r.bridgeType,
        count: r.transferCount,
        volume: r.volumeUsd,
      })),
      volumeChange7d: calculatePercentageChange(recent7dVolume, prev7dVolume),
      volumeSeries: series.map((s) => ({
        timestamp: Number(s.timestamp),
        volume: s.totalSrcValueUsd,
        transfers: s.transferCount,
      })),
    }
  }).sort((a, b) => b.volume - a.volume)

  const transferSpeed: TransferSpeedStats[] = speedStats
    .map((s) => ({
      frameworkId: typeToFrameworkId(s.type),
      count: s.count,
      volumeUsd: s.volumeUsd,
      p50Sec: s.p50Sec,
      p95Sec: s.p95Sec,
      minSec: s.minSec,
      maxSec: s.maxSec,
      srcChainCount: s.srcChainCount,
      dstChainCount: s.dstChainCount,
    }))
    .filter((s): s is TransferSpeedStats => s.frameworkId !== undefined)

  const pathSpeed: PathSpeedStats[] = pathSpeedRaw
    .map((p) => ({
      frameworkId: typeToFrameworkId(p.type),
      srcChain: p.srcChain,
      dstChain: p.dstChain,
      count: p.count,
      p50Sec: p.p50Sec,
    }))
    .filter((p): p is PathSpeedStats => p.frameworkId !== undefined)

  const chainCoverage: ChainCoverageData[] = chainCoverageRaw
    .map((c) => ({
      frameworkId: typeToFrameworkId(c.type),
      chains: c.chains,
    }))
    .filter((c): c is ChainCoverageData => c.frameworkId !== undefined)

  const abstractTokenIds = topTokensRaw
    .map((t) => t.abstractTokenId)
    .filter((id): id is string => id !== undefined)
  const tokensDetailsMap =
    abstractTokenIds.length > 0
      ? await buildTokensDetailsMap(abstractTokenIds)
      : new Map()

  const topTokens: TopToken[] = topTokensRaw
    .map((t) => {
      const details = t.abstractTokenId
        ? tokensDetailsMap.get(t.abstractTokenId)
        : undefined
      return {
        frameworkId: typeToFrameworkId(t.type),
        symbol: t.symbol,
        count: t.count,
        volumeUsd: t.volumeUsd,
        iconUrl: details?.iconUrl,
      }
    })
    .filter((t): t is TopToken => t.frameworkId !== undefined)

  const chainPairs: ChainPair[] = chainPairsRaw
    .map((p) => ({
      frameworkId: typeToFrameworkId(p.type),
      srcChain: p.srcChain,
      dstChain: p.dstChain,
      count: p.count,
      volumeUsd: p.volumeUsd,
    }))
    .filter((p): p is ChainPair => p.frameworkId !== undefined)

  const transferSizeChartData: TransferSizeDataPoint[] = sizeDistRaw
    .filter((s) => FRAMEWORK_IDS.includes(s.id as FrameworkId))
    .map((s) => {
      const fwId = s.id as FrameworkId
      const label = getFrameworkLabel(fwId)
      const fw = frameworks.find((f) => f.id === fwId)
      const total =
        s.under100 +
        s.from100To1K +
        s.from1KTo10K +
        s.from10KTo100K +
        s.over100K
      return {
        name: label.shortName,
        iconUrl: fw?.iconUrl ?? manifest.getUrl('/icons/default.png'),
        countUnder100: s.under100,
        percentageUnder100:
          total > 0 ? round((s.under100 / total) * 100, 2) : 0,
        count100To1K: s.from100To1K,
        percentage100To1K:
          total > 0 ? round((s.from100To1K / total) * 100, 2) : 0,
        count1KTo10K: s.from1KTo10K,
        percentage1KTo10K:
          total > 0 ? round((s.from1KTo10K / total) * 100, 2) : 0,
        count10KTo100K: s.from10KTo100K,
        percentage10KTo100K:
          total > 0 ? round((s.from10KTo100K / total) * 100, 2) : 0,
        countOver100K: s.over100K,
        percentageOver100K:
          total > 0 ? round((s.over100K / total) * 100, 2) : 0,
        minTransferValueUsd: undefined,
        maxTransferValueUsd: undefined,
        averageTransferSizeUsd:
          fw && fw.transfers > 0 ? fw.volume / fw.transfers : undefined,
      }
    })
    .sort((a, b) => a.percentageUnder100 - b.percentageUnder100)

  const allChainIds = new Set<string>()
  for (const c of chainCoverage) {
    for (const chain of c.chains) allChainIds.add(chain)
  }
  for (const p of chainPairs) {
    allChainIds.add(p.srcChain)
    allChainIds.add(p.dstChain)
  }
  for (const p of pathSpeed) {
    allChainIds.add(p.srcChain)
    allChainIds.add(p.dstChain)
  }

  const interopChainMap = Object.fromEntries(
    INTEROP_CHAINS.map((c) => [c.id, c]),
  )

  const chainMap: Record<string, ChainInfo> = {}
  for (const id of allChainIds) {
    const known = interopChainMap[id]
    chainMap[id] = {
      id,
      name: known?.name ?? id.charAt(0).toUpperCase() + id.slice(1),
      iconUrl: manifest.getUrl(`/icons/${known?.iconSlug ?? id}.png`),
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    frameworks,
    transferSpeed,
    pathSpeed,
    chainCoverage,
    topTokens,
    chainPairs,
    transferSizeChartData,
    chainMap,
    allTrackedChains: syncedChainIds.map((id) => {
      const known = interopChainMap[id]
      return {
        id,
        name: known?.name ?? id.charAt(0).toUpperCase() + id.slice(1),
        iconUrl: manifest.getUrl(`/icons/${known?.iconSlug ?? id}.png`),
      }
    }),
  }
}

function typeToFrameworkId(type: string): FrameworkId | undefined {
  for (const [id, pattern] of Object.entries(TYPE_PATTERNS)) {
    const prefix = pattern.replace('%', '')
    if (type.startsWith(prefix)) return id as FrameworkId
  }
  return undefined
}

function getFrameworkLabel(id: FrameworkId) {
  const labels: Record<
    FrameworkId,
    { name: string; shortName: string; provider: string }
  > = {
    layerzero: {
      name: 'Omnichain Fungible Token',
      shortName: 'OFT',
      provider: 'LayerZero',
    },
    'axelar-its': {
      name: 'Interchain Token Service',
      shortName: 'ITS',
      provider: 'Axelar',
    },
    'wormhole-ntt': {
      name: 'Native Token Transfers',
      shortName: 'NTT',
      provider: 'Wormhole',
    },
    'hyperlane-hwr': {
      name: 'Warp Routes',
      shortName: 'Warp',
      provider: 'Hyperlane',
    },
    ccip: {
      name: 'Cross-Chain Token',
      shortName: 'CCT',
      provider: 'Chainlink',
    },
  }
  return labels[id]
}
