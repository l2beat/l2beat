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
  /** The newest stored block, when the chart reaches it */
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
  const now = UnixTime.now()
  if (
    env.MOCK ||
    !env.CLIENT_SIDE_LIVE_ACTIVITY ||
    !projectId ||
    !endsToday(range, now)
  ) {
    return {
      data: chart.data,
      syncedUntil: chart.syncedUntil,
      liveUntil: undefined,
    }
  }
  const hours = await getChainHours(
    [...new Set([projectId, ProjectId.ETHEREUM])],
    (stored) => getRecentStart(chart.data, stored.get(projectId), resolution),
    now,
  )
  const { data, liveUntil } = appendRecentPoints(
    chart.data,
    hours,
    projectId,
    resolution,
    toRow,
  )
  return { data, syncedUntil: liveUntil ?? chart.syncedUntil, liveUntil }
}

/** A chain's hours: what activity summed, and its stored blocks after them */
export interface ChainHours {
  summed: HourlyActivityRecord[]
  stored: LiveActivityHourRecord[]
}

/**
 * Each chain's stored blocks after the ones activity summed, and its summed
 * hours from where they start. Activity sums a batch and moves past it in
 * one transaction, so all is read in one snapshot, or a batch could count
 * twice or not at all. None when the read fails, as charts do well without
 */
async function getChainHours(
  projectIds: ProjectId[],
  startOf: (
    stored: Map<ProjectId, LiveActivityHourRecord[]>,
  ) => UnixTime | undefined,
  now: UnixTime,
): Promise<Map<ProjectId, ChainHours>> {
  const db = getDb()
  try {
    return await db.transaction(async () => {
      const syncMetadata = await db.syncMetadata.getByFeatureAndIds(
        'activity',
        projectIds,
      )
      const stored = new Map(
        await Promise.all(
          syncMetadata.flatMap(({ id, blockSyncedUntil }) =>
            blockSyncedUntil === null
              ? []
              : [
                  db.liveActivityBlock
                    .getContiguousHoursAfter(ProjectId(id), blockSyncedUntil)
                    .then((hours) => [ProjectId(id), hours] as const),
                ],
          ),
        ),
      )
      const since = startOf(stored)
      if (since === undefined) return new Map()
      const summed = groupBy(
        await db.hourlyActivity.getByProjectsAndTimeRange(projectIds, [
          since,
          now,
        ]),
        (r) => r.projectId,
      )
      return new Map(
        [...stored].map(([id, hours]) => [
          id,
          { summed: summed[id] ?? [], stored: hours },
        ]),
      )
    }, 'repeatable read')
  } catch (error) {
    getLogger().for('getChainHours').warn('Recent activity unreadable', {
      error,
    })
    return new Map()
  }
}

/**
 * Where a chart's recent periods start: after its last summed one, or at the
 * one with the first block activity has not summed, as it summed only part
 * of that period while it catches up, though the chart counts it as whole
 */
function getRecentStart(
  data: ChartRow[],
  stored: LiveActivityHourRecord[] | undefined,
  resolution: ActivityResolution,
): UnixTime | undefined {
  const last = withoutUnsummed(data).at(-1)
  const first = stored?.[0]
  if (!last || !first) return undefined
  return Math.min(
    last[0] + UnixTime.periodToSeconds(resolution),
    UnixTime.toStartOf(first.timestamp, resolution),
  )
}

type ToRow<T> = (
  timestamp: UnixTime,
  own: Counts,
  ethereum: Counts | undefined,
) => T

/**
 * A chart with the project's periods from where recent ones start up to its
 * newest block, and Ethereum's beside the periods whole for both: the period
 * under way is spread over the project's seconds so far, which are not
 * Ethereum's
 */
export function appendRecentPoints<T extends ChartRow>(
  data: T[],
  hours: Map<ProjectId, ChainHours>,
  projectId: ProjectId,
  resolution: ActivityResolution,
  toRow: ToRow<T>,
): { data: T[]; liveUntil: UnixTime | undefined } {
  const own = hours.get(projectId)
  const since = getRecentStart(data, own?.stored, resolution)
  const until = own?.stored.at(-1)?.lastTimestamp
  if (!own || since === undefined || until === undefined) {
    return { data, liveUntil: undefined }
  }
  const appended = toRecentPoints(own, since, until, resolution)
  if (appended.length === 0) return { data, liveUntil: undefined }
  const ethereum = hours.get(ProjectId.ETHEREUM)
  const ethereumUntil = ethereum?.stored.at(-1)?.lastTimestamp
  const step = UnixTime.periodToSeconds(resolution)
  const beside = new Map(
    ethereum && ethereumUntil !== undefined
      ? toRecentPoints(ethereum, since, ethereumUntil, resolution)
          .filter((p) => p.timestamp + step <= Math.min(until, ethereumUntil))
          .map((p) => [p.timestamp, p])
      : [],
  )
  return {
    data: [
      ...data.filter((row) => row[0] < since),
      ...appended.map((p) => toRow(p.timestamp, p, beside.get(p.timestamp))),
    ],
    liveUntil: until,
  }
}

/**
 * Each period from `since` up to the newest block. The stored blocks run on
 * from the summed ones unbroken, so a period with neither had no blocks
 */
function toRecentPoints(
  { summed, stored }: ChainHours,
  since: UnixTime,
  until: UnixTime,
  resolution: ActivityResolution,
): (Counts & { timestamp: UnixTime })[] {
  const periods = new Map<UnixTime, Counts>()
  const add = (hour: UnixTime, count: number, uopsCount: number) => {
    const period = UnixTime.toStartOf(hour, resolution)
    if (period < since) return
    const sum = periods.get(period) ?? { count: 0, uopsCount: 0 }
    periods.set(period, {
      count: sum.count + count,
      uopsCount: sum.uopsCount + uopsCount,
    })
  }
  for (const r of summed) add(r.timestamp, r.count, r.uopsCount ?? r.count)
  for (const h of stored) add(h.timestamp, h.count, h.uopsCount)
  const newest = UnixTime.toStartOf(until, resolution)
  const step = UnixTime.periodToSeconds(resolution)
  const points: (Counts & { timestamp: UnixTime })[] = []
  for (let p = since; p <= newest; p += step) {
    if (p === newest && until - p < MIN_ELAPSED[resolution]) break
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
