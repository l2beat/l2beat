import type {
  HourlyActivityRecord,
  LiveActivityHourRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { getLogger } from '~/server/utils/logger'
import type { ChartRange } from '~/utils/range/range'
import type { ActivityChartDataPoint } from '../getActivityChart'
import type { ActivityResolution } from './getActivityResolution'

/** A period this young holds too few blocks for its rate to mean much */
const MIN_ELAPSED: Record<ActivityResolution, number> = {
  hour: 10 * UnixTime.MINUTE,
  day: UnixTime.HOUR,
}

/** A range ending this long ago still reaches now, as a page stays open */
const NOW_WITHIN = 6 * UnixTime.HOUR

/**
 * Presets end on the hour 75 minutes back, and a calendar range ending today
 * ends this hour. One ending an earlier day ends a second before midnight,
 * which can be later than a preset's end just after midnight
 */
export function reachesNow(range: ChartRange, now = UnixTime.now()): boolean {
  return range[1] % UnixTime.HOUR === 0 && range[1] >= now - NOW_WITHIN
}

export interface RecentHours {
  /** By the hour's start: what activity summed, and the stored blocks it has not yet */
  hours: Map<UnixTime, { count: number; uopsCount: number }>
  /** Of the newest stored block */
  until: UnixTime
}

/**
 * Each project's hours from `since` up to its newest stored block. Activity
 * sums a batch and moves past it in one transaction, so all is read in one
 * snapshot, or a batch could count twice or not at all. A project whose
 * stored blocks don't run on from the ones summed has none: hours would miss
 * the blocks in between. None at all when the read fails, as charts do well
 * without them, and the table is missing until its migration is deployed
 */
export async function getRecentHours(
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
    const result = new Map<ProjectId, RecentHours>()
    for (const metadata of syncMetadata) {
      if (metadata.blockSyncedUntil === null) continue
      const projectId = ProjectId(metadata.id)
      const stored = await db.liveActivityBlock.getHoursAfter(
        projectId,
        metadata.blockSyncedUntil,
      )
      const recent = toRecentHours(
        summed.filter((r) => r.projectId === projectId),
        stored,
        metadata.blockSyncedUntil,
        since,
      )
      if (recent) result.set(projectId, recent)
    }
    return result
  }, 'repeatable read')
}

export function toRecentHours(
  summed: HourlyActivityRecord[],
  stored: LiveActivityHourRecord[],
  summedUntil: number,
  since: UnixTime,
): RecentHours | undefined {
  const first = stored[0]
  const last = stored.at(-1)
  if (!first || !last) return undefined
  const blocks = stored.reduce((sum, hour) => sum + hour.blocks, 0)
  if (
    first.firstNumber !== summedUntil + 1 ||
    blocks !== last.lastNumber - summedUntil
  ) {
    return undefined
  }

  const hours = new Map<UnixTime, { count: number; uopsCount: number }>()
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

/**
 * [timestamp, count, uopsCount] of each period up to the newest block. The
 * stored blocks run on unbroken, so a period between with none had none
 */
export function toRecentPoints(
  recent: RecentHours,
  resolution: ActivityResolution,
  after: UnixTime,
): [UnixTime, number, number][] {
  const points = new Map<UnixTime, [UnixTime, number, number]>()
  for (const [hour, { count, uopsCount }] of recent.hours) {
    const period = UnixTime.toStartOf(hour, resolution)
    if (period <= after) continue
    const point = points.get(period) ?? [period, 0, 0]
    points.set(period, [period, point[1] + count, point[2] + uopsCount])
  }
  const newest = UnixTime.toStartOf(recent.until, resolution)
  const periods = [...points.keys()]
  if (periods.length === 0) return []
  const step = UnixTime.periodToSeconds(resolution)
  const filled: [UnixTime, number, number][] = []
  for (let p = Math.min(...periods); p <= newest; p += step) {
    if (p === newest && recent.until - p < MIN_ELAPSED[resolution]) break
    filled.push(points.get(p) ?? [p, 0, 0])
  }
  return filled
}

/**
 * A chart up to its last period with a value, without the empty ones after
 * it that activity has not summed yet, whose place recent points take
 */
export function withoutUnsummed<
  T extends [UnixTime, number | null, ...(number | null)[]],
>(data: T[]): T[] {
  let end = data.length
  while (end > 0 && data[end - 1]?.[1] === null) end--
  return data.slice(0, end)
}

/**
 * Whether the first recent point is the period after a chart's last summed
 * one. Otherwise a period activity has not summed would sit between, and the
 * chart would seem synced past it
 */
export function runsOn(
  last: UnixTime,
  first: UnixTime | undefined,
  resolution: ActivityResolution,
): boolean {
  return first === last + UnixTime.periodToSeconds(resolution)
}

/**
 * A project's chart with its periods since the last point, and Ethereum's
 * beside the ones whole for both: the point under way is spread over the
 * project's seconds so far, which are not Ethereum's
 */
export function appendRecentPoints(
  data: ActivityChartDataPoint[],
  recent: Map<ProjectId, RecentHours>,
  projectId: ProjectId,
  resolution: ActivityResolution,
): { data: ActivityChartDataPoint[]; liveUntil: UnixTime | undefined } {
  const own = recent.get(projectId)
  const summed = withoutUnsummed(data)
  const last = summed.at(-1)
  if (!own || !last) return { data, liveUntil: undefined }
  const after = last[0]
  const ethereum = recent.get(ProjectId.ETHEREUM)
  const periodSeconds = UnixTime.periodToSeconds(resolution)
  const ethereumPoints = new Map(
    ethereum
      ? toRecentPoints(ethereum, resolution, after)
          .filter(
            ([period]) =>
              period + periodSeconds <= Math.min(own.until, ethereum.until),
          )
          .map((p) => [p[0], p])
      : [],
  )
  const appended = toRecentPoints(own, resolution, after).map(
    ([timestamp, count, uopsCount]): ActivityChartDataPoint => {
      const beside = ethereumPoints.get(timestamp)
      return [
        timestamp,
        count,
        beside?.[1] ?? null,
        uopsCount,
        beside?.[2] ?? null,
      ]
    },
  )
  if (!runsOn(after, appended[0]?.[0], resolution)) {
    return { data, liveUntil: undefined }
  }
  return { data: [...summed, ...appended], liveUntil: own.until }
}
