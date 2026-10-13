import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import type {
  InteropTransferTimeAveragesParams,
  InteropTransferTimeParams,
  InteropTransferTimeRoutesParams,
} from './types'
import { getAggregatedInteropSnapshotTimestamp } from './utils/getAggregatedInteropTimestamp'
import { getInteropChains } from './utils/getInteropChains'

/** Raw transfers are kept for 7 days, so this is all the history there is. */
const DAYS = 7

export interface InteropTransferTimePoint {
  median: number
  p90: number
  count: number
}

export interface InteropTransferTimeSeries {
  /** Interop project id. */
  id: string
  label: string
  /** Aligned with `days`; null where the protocol had no transfers that day. */
  points: (InteropTransferTimePoint | null)[]
}

export interface InteropTransferTimeData {
  /** Start of each UTC day; the last one is today, still in progress. */
  days: number[]
  /** Busiest protocol first. */
  series: InteropTransferTimeSeries[]
}

export interface InteropTransferTimeRoute {
  srcChain: string
  dstChain: string
  count: number
}

export async function getInteropTransferTime({
  srcChain,
  dstChain,
}: InteropTransferTimeParams): Promise<InteropTransferTimeData> {
  const days = getDays(UnixTime.now())
  if (env.MOCK) return getMockInteropTransferTime(days)

  const interopProjects = await ps.getProjects({ select: ['interopConfig'] })
  const projects = interopProjects
    .filter((project) => project.interopConfig.transfersTimeMode !== 'unknown')
    // A plugin goes to the first project listing it: parents before their
    // subgroups, so e.g. LayerZero is not split off into USDT0.
    .toSorted(
      (a, b) =>
        Number(!!a.interopConfig.subgroupId) -
        Number(!!b.interopConfig.subgroupId),
    )

  const records = await getDb().interopTransfer.getDailyDurationPercentiles({
    srcChain,
    dstChain,
    from: days[0] ?? 0,
    groups: projects.map((project) => ({
      id: project.id,
      plugins: getPluginsOnRoute(project, srcChain, dstChain),
    })),
  })

  const names = new Map<string, string>(
    projects.map((project) => [project.id, getName(project)]),
  )
  const dayIndex = new Map(days.map((day, i) => [day, i]))
  const byId = new Map<string, InteropTransferTimeSeries>()
  for (const record of records) {
    const index = dayIndex.get(record.day)
    if (index === undefined) continue
    let series = byId.get(record.series)
    if (!series) {
      series = {
        id: record.series,
        label: names.get(record.series) ?? record.series,
        points: days.map(() => null),
      }
      byId.set(record.series, series)
    }
    series.points[index] = {
      median: record.medianDuration,
      p90: record.p90Duration,
      count: record.count,
    }
  }

  return {
    days,
    series: [...byId.values()].sort(
      (a, b) => transferCount(b) - transferCount(a),
    ),
  }
}

export interface InteropTransferTimeAveragePoint {
  average: number
  count: number
}

export interface InteropTransferTimeAveragesData {
  /** Daily snapshot times; each point covers the 24 hours before it. */
  timestamps: number[]
  /** Busiest protocol first; points aligned with `timestamps`. */
  series: {
    id: string
    label: string
    points: (InteropTransferTimeAveragePoint | null)[]
  }[]
}

/**
 * Daily average transfer time per protocol from the hourly aggregates, which
 * keep only sums, so no median. History goes back to when a protocol was
 * first aggregated, not just the 7 days of raw transfers.
 */
export async function getInteropTransferTimeAverages({
  srcChain,
  dstChain,
  range,
}: InteropTransferTimeAveragesParams): Promise<InteropTransferTimeAveragesData> {
  if (env.MOCK) return getMockInteropTransferTimeAverages(range[1])

  const snapshot = await getAggregatedInteropSnapshotTimestamp()
  if (snapshot === undefined) return { timestamps: [], series: [] }

  const interopProjects = await ps.getProjects({ select: ['interopConfig'] })
  // Subgroups are also counted in their parent, as in the flows section.
  const projects = interopProjects.filter(
    (project) =>
      project.interopConfig.transfersTimeMode !== 'unknown' &&
      !project.interopConfig.subgroupId,
  )
  const names = new Map<string, string>(
    projects.map((project) => [project.id, getName(project)]),
  )

  const records = await getDb().aggregatedInteropTransfer.getDailyDurationSums({
    srcChain,
    dstChain,
    from: range[0] ?? 0,
    to: Math.min(range[1], snapshot),
  })

  const timestamps = [...new Set(records.map((r) => r.timestamp))].sort(
    (a, b) => a - b,
  )
  const index = new Map(timestamps.map((timestamp, i) => [timestamp, i]))
  const byId = new Map<
    string,
    InteropTransferTimeAveragesData['series'][number]
  >()
  for (const record of records) {
    const label = names.get(record.id)
    const i = index.get(record.timestamp)
    if (!label || i === undefined || record.transfersWithDurationCount === 0) {
      continue
    }
    let series = byId.get(record.id)
    if (!series) {
      series = { id: record.id, label, points: timestamps.map(() => null) }
      byId.set(record.id, series)
    }
    series.points[i] = {
      average: record.totalDurationSum / record.transfersWithDurationCount,
      count: record.transfersWithDurationCount,
    }
  }

  const total = (points: (InteropTransferTimeAveragePoint | null)[]) =>
    points.reduce((sum, point) => sum + (point?.count ?? 0), 0)
  return {
    timestamps,
    series: [...byId.values()].sort(
      (a, b) => total(b.points) - total(a.points),
    ),
  }
}

/** Routes to or from `chain` that had timed transfers in the window. */
export async function getInteropTransferTimeRoutes({
  chain,
}: InteropTransferTimeRoutesParams): Promise<InteropTransferTimeRoute[]> {
  const [from] = getDays(UnixTime.now())
  if (env.MOCK) {
    return [
      { srcChain: 'ethereum', dstChain: chain, count: 100 },
      { srcChain: chain, dstChain: 'ethereum', count: 80 },
    ]
  }

  const enabled = new Set(getInteropChains().map((c) => c.id))
  const routes = await getDb().interopTransfer.getDurationRoutes({
    chain,
    from: from ?? 0,
  })
  return routes
    .filter((r) => enabled.has(r.srcChain) && enabled.has(r.dstChain))
    .sort((a, b) => b.count - a.count)
}

function getDays(now: UnixTime): number[] {
  const today = UnixTime.toStartOf(now, 'day')
  return Array.from(
    { length: DAYS },
    (_, i) => today - (DAYS - 1 - i) * UnixTime.DAY,
  )
}

/** A plugin entry pinned to a chain (canonical bridges) only counts on routes touching it. */
function getPluginsOnRoute(
  project: Project<'interopConfig'>,
  srcChain: string,
  dstChain: string,
): string[] {
  const plugins = project.interopConfig.plugins
    .filter(
      (plugin) =>
        !plugin.chain || plugin.chain === srcChain || plugin.chain === dstChain,
    )
    .map((plugin) => plugin.plugin)
  return [...new Set(plugins)]
}

function getName(project: Project<'interopConfig'>): string {
  return project.interopConfig.name ?? project.name
}

function transferCount(series: InteropTransferTimeSeries): number {
  return series.points.reduce((sum, point) => sum + (point?.count ?? 0), 0)
}

function getMockInteropTransferTime(days: number[]): InteropTransferTimeData {
  const point = (median: number, count: number) => ({
    median,
    p90: median * 3,
    count,
  })
  return {
    days,
    series: [
      {
        id: 'gnosis',
        label: 'Gnosis Bridge',
        points: days.map((_, i) => (i === 3 ? null : point(30 + i * 5, 40))),
      },
      {
        id: 'relay',
        label: 'Relay',
        points: days.map((_, i) => (i % 3 === 0 ? null : point(6, 12))),
      },
      {
        id: 'ccip',
        label: 'Chainlink CCIP',
        points: days.map((_, i) => point(900 + i * 20, i === 6 ? 2 : 5)),
      },
    ],
  }
}

function getMockInteropTransferTimeAverages(
  end: number,
): InteropTransferTimeAveragesData {
  const timestamps = Array.from(
    { length: 90 },
    (_, i) => UnixTime.toStartOf(end, 'day') - (89 - i) * UnixTime.DAY,
  )
  return {
    timestamps,
    series: [
      {
        id: 'gnosis',
        label: 'Gnosis Bridge',
        points: timestamps.map((_, i) => ({
          average: i < 80 ? 960 : 33,
          count: 50,
        })),
      },
      {
        id: 'relay',
        label: 'Relay',
        points: timestamps.map((_, i) =>
          i % 5 === 0 ? null : { average: 6 + (i % 7), count: 20 },
        ),
      },
    ],
  }
}
