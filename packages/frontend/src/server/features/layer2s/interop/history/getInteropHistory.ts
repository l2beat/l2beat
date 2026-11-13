import type { AggregatedInteropHistoryFilter } from '@l2beat/database'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { manifest } from '~/utils/Manifest'
import { buildHistoryPoints } from './buildHistoryPoints'
import { getInteropHistoryCandidates } from './getInteropHistoryCandidates'
import { getMockInteropHistory } from './getMockInteropHistory'
import type {
  InteropHistoryChainSeries,
  InteropHistoryData,
  InteropHistoryParams,
  InteropHistoryPoint,
  InteropHistoryProtocol,
  InteropHistoryProtocolSeries,
} from './types'

const cache = new FrontendInMemoryCache('getInteropHistory')

export async function getInteropHistory(
  params: InteropHistoryParams,
): Promise<InteropHistoryData> {
  if (env.MOCK) return getMockInteropHistory(params)

  return await cache.get(
    {
      key: [
        'interop-history',
        params.resolution,
        [...params.from].sort().join(','),
        [...params.to].sort().join(','),
        params.protocolIds ? [...params.protocolIds].sort().join(',') : 'all',
      ],
      ttl: 10 * 60,
      staleWhileRevalidate: 20 * 60,
    },
    () => buildInteropHistory(params),
  )
}

async function buildInteropHistory(
  params: InteropHistoryParams,
): Promise<InteropHistoryData> {
  const db = getDb()
  const [timestamps, blocked] = await Promise.all([
    db.aggregatedInteropTransfer.getTimestamps(),
    db.interopAggregateStatus.getBlockedTimestamps(),
  ])
  const pointSnapshots = buildHistoryPoints(timestamps, params.resolution)
  const pointBySnapshot = new Map<number, number>()
  pointSnapshots.forEach((point, i) => {
    if (point.snapshot !== undefined) pointBySnapshot.set(point.snapshot, i)
  })

  const filter: AggregatedInteropHistoryFilter = {
    timestamps: pointSnapshots.flatMap((point) => point.snapshot ?? []),
    sourceChains: params.from,
    destinationChains: params.to,
    protocolIds: params.protocolIds,
  }
  const [volumes, chainVolumes, stats, candidates, projects] =
    await Promise.all([
      db.aggregatedInteropToken.getHistoryVolumeByProtocol(filter),
      db.aggregatedInteropToken.getHistoryVolumeByChain(filter),
      db.aggregatedInteropTransfer.getHistoryStats(filter),
      getInteropHistoryCandidates(params.resolution, pointSnapshots),
      ps.getProjects({ select: ['interopConfig'] }),
    ])

  const length = pointSnapshots.length
  const zeros = () => new Array<number>(length).fill(0)
  const blockedSet = new Set(blocked)
  const points: InteropHistoryPoint[] = pointSnapshots.map((point) => ({
    timestamp: point.timestamp,
    snapshot: point.snapshot ?? null,
    isBlocked: point.snapshot !== undefined && blockedSet.has(point.snapshot),
    carriedLanes: 0,
    partialLanes: 0,
  }))

  const byProtocol: Record<string, InteropHistoryProtocolSeries> = {}
  const protocolSeries = (id: string) => {
    byProtocol[id] ??= {
      volume: zeros(),
      transferCount: zeros(),
      timedTransferCount: zeros(),
      durationSum: zeros(),
    }
    return byProtocol[id]
  }
  for (const row of volumes) {
    const i = pointBySnapshot.get(row.timestamp)
    if (i === undefined) continue
    protocolSeries(row.id).volume[i] = row.volume
  }
  for (const row of stats) {
    const i = pointBySnapshot.get(row.timestamp)
    if (i === undefined) continue
    const series = protocolSeries(row.id)
    series.transferCount[i] = row.transferCount
    series.timedTransferCount[i] = row.transfersWithDurationCount
    series.durationSum[i] = row.totalDurationSum
    const point = points[i] as InteropHistoryPoint
    point.carriedLanes += row.carriedLanes
    point.partialLanes += row.partialLanes
  }

  const byChain: Record<string, InteropHistoryChainSeries> = {}
  for (const row of chainVolumes) {
    const i = pointBySnapshot.get(row.timestamp)
    if (i === undefined) continue
    const series = (byChain[row.chain] ??= {
      inflow: zeros(),
      outflow: zeros(),
    })
    series.inflow[i] = row.inflow
    series.outflow[i] = row.outflow
  }

  const from = new Set(params.from)
  const to = new Set(params.to)
  const ids = params.protocolIds ? new Set(params.protocolIds) : undefined
  const inSelection = (
    id: string,
    lane: { srcChain: string; dstChain: string },
  ) =>
    from.has(lane.srcChain) &&
    to.has(lane.dstChain) &&
    (ids === undefined || ids.has(id))

  const projectsById = new Map<string, (typeof projects)[number]>(
    projects.map((p) => [p.id, p]),
  )
  const ranking = Object.fromEntries(
    Object.entries(byProtocol).map(([id, s]) => [id, getRobustTotal(s.volume)]),
  )
  const protocols: InteropHistoryProtocol[] = Object.keys(byProtocol)
    .sort((a, b) => (ranking[b] ?? 0) - (ranking[a] ?? 0))
    .map((id) => {
      const project = projectsById.get(id)
      return {
        id,
        name: project ? (project.interopConfig.name ?? project.name) : id,
        iconUrl: project
          ? manifest.getUrl(`/icons/${project.slug}.png`)
          : undefined,
        isListed: project !== undefined,
      }
    })

  return {
    resolution: params.resolution,
    points,
    protocols,
    byProtocol,
    byChain,
    laneCandidates: candidates.lanes.filter((lane) =>
      inSelection(lane.id, lane),
    ),
    tokenCandidates: candidates.tokens.flatMap((token) => {
      const lanes = token.lanes.map((lane) => ({
        ...lane,
        inSelection: inSelection(token.id, lane),
      }))
      return lanes.some((lane) => lane.inSelection) ? [{ ...token, lanes }] : []
    }),
  }
}

/**
 * A protocol's total with each day capped at 5 times its median day, so one
 * bogus spike does not rank it, and color it, as the largest.
 */
function getRobustTotal(volumes: number[]) {
  const days = volumes.filter((v) => v > 0).sort((a, b) => a - b)
  const median = days[Math.floor(days.length / 2)] ?? 0
  return days.reduce((sum, v) => sum + Math.min(v, 5 * median), 0)
}
