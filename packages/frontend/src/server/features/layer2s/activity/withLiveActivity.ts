import type {
  HourlyActivityRecord,
  LiveActivityHourRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getLogger } from '~/server/utils/logger'
import { type ChartRange, endsToday } from '~/utils/range/range'
import type { ActivityChartData, ActivityChartParams } from './getActivityChart'
import type {
  EthereumActivityChartData,
  EthereumActivityChartParams,
} from './getEthereumActivityChart'
import type { ActivityResolution } from './utils/getActivityResolution'

/** A period this young holds too few blocks for its rate to mean much */
const MIN_ELAPSED: Record<ActivityResolution, number> = {
  hour: 10 * UnixTime.MINUTE,
  day: UnixTime.HOUR,
}

type ChartRow = [timestamp: number, count: number | null, ...(number | null)[]]

interface Counts {
  count: number
  uopsCount: number
}

interface Live {
  /** Where the chart ends: its newest stored block, when it reaches it */
  syncedUntil: UnixTime
  /**
   * Of a single project's newest stored block, when the chart reaches past
   * what activity has summed. A last point after it is a period under way
   */
  liveUntil: UnixTime | undefined
}

/**
 * A project's own chart up to its newest stored block, past what activity
 * has summed, with Ethereum's beside the periods whole for both. Charts of
 * many projects end where all are summed, as some have no blocks stored
 */
export async function withLiveActivity(
  chart: ActivityChartData,
  { filter, range }: ActivityChartParams,
): Promise<ActivityChartData & Live> {
  const only =
    filter.type === 'projects' && filter.projectIds.length === 1
      ? filter.projectIds[0]
      : undefined
  const live = await appendLive(
    chart,
    range,
    chart.resolution,
    only ? ProjectId(only) : undefined,
    (timestamp, own, ethereum) => [
      timestamp,
      own.count,
      ethereum?.count ?? null,
      own.uopsCount,
      ethereum?.uopsCount ?? null,
    ],
  )
  return { ...chart, ...live }
}

/** Ethereum's chart up to its newest stored block, like a project's own */
export async function withLiveEthereumActivity(
  chart: EthereumActivityChartData,
  { range }: EthereumActivityChartParams,
): Promise<EthereumActivityChartData & Live> {
  const live = await appendLive(
    chart,
    range,
    'day',
    ProjectId.ETHEREUM,
    (timestamp, own) => [timestamp, own.count, own.uopsCount],
  )
  return { ...chart, ...live }
}

async function appendLive<T extends ChartRow>(
  chart: { data: T[]; syncedUntil: UnixTime },
  range: ChartRange,
  resolution: ActivityResolution,
  projectId: ProjectId | undefined,
  toRow: ToRow<T>,
): Promise<{ data: T[] } & Live> {
  const last = withoutUnsummed(chart.data).at(-1)
  if (
    env.MOCK ||
    !env.CLIENT_SIDE_LIVE_ACTIVITY ||
    !projectId ||
    !last ||
    !endsToday(range)
  ) {
    return {
      data: chart.data,
      syncedUntil: chart.syncedUntil,
      liveUntil: undefined,
    }
  }
  const recent = await getRecentHours(
    [...new Set([projectId, ProjectId.ETHEREUM])],
    last[0] + UnixTime.periodToSeconds(resolution),
  )
  const { data, liveUntil } = appendRecentPoints(
    chart.data,
    recent,
    projectId,
    resolution,
    toRow,
  )
  return { data, syncedUntil: liveUntil ?? chart.syncedUntil, liveUntil }
}

export interface RecentHours {
  /** By the hour's start: what activity summed, and the stored blocks it has not yet */
  hours: Map<UnixTime, Counts>
  /** Of the newest stored block */
  until: UnixTime
}

/**
 * Each project's hours from `since` up to its newest stored block. Activity
 * sums a batch and moves past it in one transaction, so all is read in one
 * snapshot, or a batch could count twice or not at all. None at all when the
 * read fails, as charts do well without them
 */
async function getRecentHours(
  projectIds: ProjectId[],
  since: UnixTime,
): Promise<Map<ProjectId, RecentHours>> {
  try {
    return await readRecentHours(projectIds, since)
  } catch (error) {
    getLogger().for('getRecentHours').warn('Recent activity unreadable', {
      error,
    })
    return new Map()
  }
}

function readRecentHours(
  projectIds: ProjectId[],
  since: UnixTime,
): Promise<Map<ProjectId, RecentHours>> {
  const db = getDb()
  return db.transaction(async () => {
    const [syncMetadata, summed] = await Promise.all([
      db.syncMetadata.getByFeatureAndIds('activity', projectIds),
      db.hourlyActivity.getByProjectsAndTimeRange(projectIds, [
        since,
        UnixTime.now(),
      ]),
    ])
    const summedByProject = groupBy(summed, (r) => r.projectId)
    const recent = await Promise.all(
      syncMetadata.map(async ({ id, blockSyncedUntil }) => {
        if (blockSyncedUntil === null) return undefined
        const projectId = ProjectId(id)
        const stored = await db.liveActivityBlock.getContiguousHoursAfter(
          projectId,
          blockSyncedUntil,
        )
        const hours = toRecentHours(
          summedByProject[projectId] ?? [],
          stored,
          since,
        )
        return hours && ([projectId, hours] as const)
      }),
    )
    return new Map(recent.filter((r) => r !== undefined))
  }, 'repeatable read')
}

/**
 * A project's hours from `since`, summed and stored. None without stored
 * blocks, as they don't run on from the summed ones
 */
export function toRecentHours(
  summed: HourlyActivityRecord[],
  stored: LiveActivityHourRecord[],
  since: UnixTime,
): RecentHours | undefined {
  const last = stored.at(-1)
  if (!last) return undefined
  const hours = new Map<UnixTime, Counts>()
  const add = (timestamp: UnixTime, count: number, uopsCount: number) => {
    if (timestamp < since) return
    const hour = hours.get(timestamp) ?? { count: 0, uopsCount: 0 }
    hours.set(timestamp, {
      count: hour.count + count,
      uopsCount: hour.uopsCount + uopsCount,
    })
  }
  for (const r of summed) add(r.timestamp, r.count, r.uopsCount ?? r.count)
  for (const h of stored) add(h.timestamp, h.count, h.uopsCount)
  return { hours, until: last.lastTimestamp }
}

type ToRow<T> = (
  timestamp: UnixTime,
  own: Counts,
  ethereum: Counts | undefined,
) => T

/**
 * A chart with the project's periods after its last summed one, up to the
 * newest block, and Ethereum's beside the periods whole for both: the period
 * under way is spread over the project's seconds so far, which are not
 * Ethereum's. The hours are read from the period after the last summed one
 */
export function appendRecentPoints<T extends ChartRow>(
  data: T[],
  recent: Map<ProjectId, RecentHours>,
  projectId: ProjectId,
  resolution: ActivityResolution,
  toRow: ToRow<T>,
): { data: T[]; liveUntil: UnixTime | undefined } {
  const own = recent.get(projectId)
  const summed = withoutUnsummed(data)
  const after = summed.at(-1)?.[0]
  if (!own || after === undefined) return { data, liveUntil: undefined }
  const appended = toRecentPoints(own, resolution, after)
  if (appended.length === 0) return { data, liveUntil: undefined }
  const ethereum = recent.get(ProjectId.ETHEREUM)
  const step = UnixTime.periodToSeconds(resolution)
  const beside = new Map(
    ethereum
      ? toRecentPoints(ethereum, resolution, after)
          .filter(
            (p) => p.timestamp + step <= Math.min(own.until, ethereum.until),
          )
          .map((p) => [p.timestamp, p])
      : [],
  )
  return {
    data: [
      ...summed,
      ...appended.map((p) => toRow(p.timestamp, p, beside.get(p.timestamp))),
    ],
    liveUntil: own.until,
  }
}

/**
 * Each period after `after` up to the newest block. The stored blocks run on
 * from the summed ones unbroken, so a period with neither had no blocks
 */
function toRecentPoints(
  recent: RecentHours,
  resolution: ActivityResolution,
  after: UnixTime,
): (Counts & { timestamp: UnixTime })[] {
  const periods = new Map<UnixTime, Counts>()
  for (const [hour, { count, uopsCount }] of recent.hours) {
    const period = UnixTime.toStartOf(hour, resolution)
    if (period <= after) continue
    const sum = periods.get(period) ?? { count: 0, uopsCount: 0 }
    periods.set(period, {
      count: sum.count + count,
      uopsCount: sum.uopsCount + uopsCount,
    })
  }
  const newest = UnixTime.toStartOf(recent.until, resolution)
  const step = UnixTime.periodToSeconds(resolution)
  const points: (Counts & { timestamp: UnixTime })[] = []
  for (let p = after + step; p <= newest; p += step) {
    if (p === newest && recent.until - p < MIN_ELAPSED[resolution]) break
    points.push({
      timestamp: p,
      ...(periods.get(p) ?? { count: 0, uopsCount: 0 }),
    })
  }
  return points
}

/**
 * A chart up to its last period with a value, without the empty ones after
 * it that activity has not summed yet, whose place recent points take
 */
function withoutUnsummed<T extends ChartRow>(data: T[]): T[] {
  let end = data.length
  while (end > 0 && data[end - 1]?.[1] === null) end--
  return data.slice(0, end)
}
