import { INTEROP_CHAINS } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { manifest } from '~/utils/Manifest'
import type {
  ChainCoverageData,
  ChainInfo,
  ChainPair,
  FrameworkOverview,
  PathSpeedStats,
  TopToken,
  TransferSpeedStats,
} from './getFrameworkComparisonData'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import type { TransferSizeDataPoint } from './utils/getTransferSizeChartData'

const BRIDGE_IDS = [
  'relay',
  'across',
  'stargate-v2',
  'mayan-swift',
  'cbridge',
] as const

export type BridgeId = (typeof BRIDGE_IDS)[number]

const TYPE_PATTERNS: Record<BridgeId, string[]> = {
  relay: ['relay.%'],
  across: ['across.%'],
  'stargate-v2': ['stargate-v2-taxi.%', 'stargate-v2-bus.%'],
  'mayan-swift': ['mayan-swift.%'],
  cbridge: ['celer.%'],
}

const SLUGS: Record<BridgeId, string> = {
  relay: 'relay',
  across: 'across',
  'stargate-v2': 'stargate',
  'mayan-swift': 'mayan',
  cbridge: 'cbridge',
}

export interface BridgeComparisonData {
  generatedAt: string
  frameworks: FrameworkOverview[]
  transferSpeed: (Omit<TransferSpeedStats, 'frameworkId'> & {
    frameworkId: BridgeId
  })[]
  pathSpeed: (Omit<PathSpeedStats, 'frameworkId'> & {
    frameworkId: BridgeId
  })[]
  chainCoverage: (Omit<ChainCoverageData, 'frameworkId'> & {
    frameworkId: BridgeId
  })[]
  topTokens: (Omit<TopToken, 'frameworkId'> & { frameworkId: BridgeId })[]
  chainPairs: (Omit<ChainPair, 'frameworkId'> & { frameworkId: BridgeId })[]
  transferSizeChartData: TransferSizeDataPoint[]
  chainMap: Record<string, ChainInfo>
  allTrackedChains: ChainInfo[]
}

function getBridgeLabel(id: BridgeId): { name: string; shortName: string } {
  const labels: Record<BridgeId, { name: string; shortName: string }> = {
    relay: { name: 'Relay', shortName: 'Relay' },
    across: { name: 'Across', shortName: 'Across' },
    'stargate-v2': { name: 'Stargate V2', shortName: 'Stargate' },
    'mayan-swift': { name: 'Mayan Swift', shortName: 'Mayan' },
    cbridge: { name: 'Celer cBridge', shortName: 'cBridge' },
  }
  return labels[id]
}

export async function getBridgeComparisonData(): Promise<BridgeComparisonData> {
  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  const db = getDb()
  const allTypePatterns = Object.values(TYPE_PATTERNS).flat()
  const allAggregatedIds = Object.values(SLUGS)
  const since = UnixTime.now() - UnixTime.DAY
  const filter = 'onlyLiquidityBased' as const

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
    db.aggregatedInteropTransfer.getSevenDayAggregatedByFramework(
      allAggregatedIds,
    ),
    Promise.all(
      BRIDGE_IDS.map((id) =>
        db.aggregatedInteropTransfer.getDailySeriesById(SLUGS[id]),
      ),
    ),
    db.interopTransfer.getTransferSpeedStats(allTypePatterns, since, filter),
    db.interopTransfer.getPathSpeedStats(allTypePatterns, since, filter),
    db.interopTransfer.getChainCoverage(allTypePatterns, since, filter),
    db.interopTransfer.getTopTokens(allTypePatterns, since, filter),
    db.interopTransfer.getChainPairs(allTypePatterns, since, filter),
    db.interopTransfer.getTransferSizeDistribution(
      allTypePatterns,
      since,
      filter,
    ),
    db.interopPluginSyncedRange.getSyncedChains(),
  ])

  const seriesByBridge = Object.fromEntries(
    BRIDGE_IDS.map((id, i) => [id, dailySeries[i]]),
  )

  function typeToBridgeId(type: string): BridgeId | undefined {
    for (const [id, patterns] of Object.entries(TYPE_PATTERNS)) {
      for (const pattern of patterns) {
        const prefix = pattern.replace('%', '')
        if (type.startsWith(prefix)) return id as BridgeId
      }
    }
    return undefined
  }

  const frameworks: FrameworkOverview[] = BRIDGE_IDS.map((id) => {
    const label = getBridgeLabel(id)
    const slug = SLUGS[id]
    const project = interopProjects.find((p) => p.slug === slug)
    const aggId = SLUGS[id]

    const fwRows = aggregated.filter(
      (r) => r.id === aggId && r.bridgeType === 'nonMinting',
    )
    const volume = fwRows.reduce((s, r) => s + r.volumeUsd, 0)
    const transfers = fwRows.reduce((s, r) => s + r.transferCount, 0)
    const totalDuration = fwRows.reduce(
      (s, r) => s + r.avgDurationSec * r.transferCount,
      0,
    )

    const series = seriesByBridge[id] ?? []
    const recent7d = series.slice(-7)
    const prev7d = series.slice(-14, -7)
    const recent7dVolume = recent7d.reduce((s, d) => s + d.totalSrcValueUsd, 0)
    const prev7dVolume = prev7d.reduce((s, d) => s + d.totalSrcValueUsd, 0)

    return {
      id: id as FrameworkOverview['id'],
      name: project?.interopConfig.name ?? project?.name ?? label.name,
      shortName: label.shortName,
      provider: '',
      iconUrl: project
        ? manifest.getUrl(`/icons/${project.slug}.png`)
        : manifest.getUrl(`/icons/${slug}.png`),
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

  const transferSpeed = speedStats
    .map((s) => ({
      frameworkId: typeToBridgeId(s.type),
      count: s.count,
      volumeUsd: s.volumeUsd,
      p50Sec: s.p50Sec,
      p95Sec: s.p95Sec,
      minSec: s.minSec,
      maxSec: s.maxSec,
      srcChainCount: s.srcChainCount,
      dstChainCount: s.dstChainCount,
    }))
    .filter(
      (s): s is typeof s & { frameworkId: BridgeId } =>
        s.frameworkId !== undefined,
    )

  const mergedSpeed = new Map<BridgeId, (typeof transferSpeed)[number]>()
  for (const s of transferSpeed) {
    const existing = mergedSpeed.get(s.frameworkId)
    if (!existing) {
      mergedSpeed.set(s.frameworkId, { ...s })
    } else {
      existing.count += s.count
      existing.volumeUsd += s.volumeUsd
      existing.p50Sec = Math.round(
        (existing.p50Sec * (existing.count - s.count) + s.p50Sec * s.count) /
          existing.count,
      )
    }
  }

  const pathSpeedByBridge = new Map<
    string,
    {
      frameworkId: BridgeId
      srcChain: string
      dstChain: string
      count: number
      totalP50: number
    }
  >()
  for (const p of pathSpeedRaw) {
    const bridgeId = typeToBridgeId(p.type)
    if (!bridgeId) continue
    const key = `${bridgeId}:${p.srcChain}:${p.dstChain}`
    const existing = pathSpeedByBridge.get(key)
    if (!existing) {
      pathSpeedByBridge.set(key, {
        frameworkId: bridgeId,
        srcChain: p.srcChain,
        dstChain: p.dstChain,
        count: p.count,
        totalP50: p.p50Sec * p.count,
      })
    } else {
      existing.count += p.count
      existing.totalP50 += p.p50Sec * p.count
    }
  }

  const pathSpeed = [...pathSpeedByBridge.values()].map((p) => ({
    frameworkId: p.frameworkId,
    srcChain: p.srcChain,
    dstChain: p.dstChain,
    count: p.count,
    p50Sec: Math.round(p.totalP50 / p.count),
  }))

  const chainCoverage = chainCoverageRaw
    .map((c) => ({
      frameworkId: typeToBridgeId(c.type),
      chains: c.chains,
    }))
    .filter(
      (c): c is typeof c & { frameworkId: BridgeId } =>
        c.frameworkId !== undefined,
    )

  const mergedCoverage = new Map<BridgeId, Set<string>>()
  for (const c of chainCoverage) {
    const existing = mergedCoverage.get(c.frameworkId) ?? new Set()
    for (const chain of c.chains) existing.add(chain)
    mergedCoverage.set(c.frameworkId, existing)
  }

  const abstractTokenIds = topTokensRaw
    .map((t) => t.abstractTokenId)
    .filter((id): id is string => id !== undefined)
  const tokensDetailsMap =
    abstractTokenIds.length > 0
      ? await buildTokensDetailsMap(abstractTokenIds)
      : new Map()

  const topTokensByBridge = new Map<
    string,
    {
      frameworkId: BridgeId
      symbol: string
      count: number
      volumeUsd: number
      iconUrl: string | undefined
    }
  >()
  for (const t of topTokensRaw) {
    const bridgeId = typeToBridgeId(t.type)
    if (!bridgeId) continue
    const details = t.abstractTokenId
      ? tokensDetailsMap.get(t.abstractTokenId)
      : undefined
    const key = `${bridgeId}:${t.symbol}`
    const existing = topTokensByBridge.get(key)
    if (!existing) {
      topTokensByBridge.set(key, {
        frameworkId: bridgeId,
        symbol: t.symbol,
        count: t.count,
        volumeUsd: t.volumeUsd,
        iconUrl: details?.iconUrl,
      })
    } else {
      existing.count += t.count
      existing.volumeUsd += t.volumeUsd
    }
  }

  const chainPairsByBridge = new Map<
    string,
    {
      frameworkId: BridgeId
      srcChain: string
      dstChain: string
      count: number
      volumeUsd: number
    }
  >()
  for (const p of chainPairsRaw) {
    const bridgeId = typeToBridgeId(p.type)
    if (!bridgeId) continue
    const key = `${bridgeId}:${p.srcChain}:${p.dstChain}`
    const existing = chainPairsByBridge.get(key)
    if (!existing) {
      chainPairsByBridge.set(key, {
        frameworkId: bridgeId,
        srcChain: p.srcChain,
        dstChain: p.dstChain,
        count: p.count,
        volumeUsd: p.volumeUsd,
      })
    } else {
      existing.count += p.count
      existing.volumeUsd += p.volumeUsd
    }
  }

  const sizeDistByBridge = new Map<
    BridgeId,
    {
      under100: number
      from100To1K: number
      from1KTo10K: number
      from10KTo100K: number
      over100K: number
    }
  >()
  for (const s of sizeDistRaw) {
    const bridgeId = typeToBridgeId(s.type)
    if (!bridgeId) continue
    const existing = sizeDistByBridge.get(bridgeId)
    if (!existing) {
      sizeDistByBridge.set(bridgeId, { ...s })
    } else {
      existing.under100 += s.under100
      existing.from100To1K += s.from100To1K
      existing.from1KTo10K += s.from1KTo10K
      existing.from10KTo100K += s.from10KTo100K
      existing.over100K += s.over100K
    }
  }

  function round(value: number, decimals: number): number {
    return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`)
  }

  const transferSizeChartData: TransferSizeDataPoint[] = [
    ...sizeDistByBridge.entries(),
  ]
    .map(([bridgeId, s]) => {
      const label = getBridgeLabel(bridgeId)
      const fw = frameworks.find((f) => (f.id as string) === bridgeId)
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
  for (const [, chains] of mergedCoverage) {
    for (const chain of chains) allChainIds.add(chain)
  }
  for (const p of chainPairsByBridge.values()) {
    allChainIds.add(p.srcChain)
    allChainIds.add(p.dstChain)
  }
  for (const p of pathSpeedByBridge.values()) {
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
    transferSpeed: [...mergedSpeed.values()],
    pathSpeed,
    chainCoverage: [...mergedCoverage.entries()].map(([id, chains]) => ({
      frameworkId: id,
      chains: [...chains],
    })),
    topTokens: [...topTokensByBridge.values()],
    chainPairs: [...chainPairsByBridge.values()],
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
