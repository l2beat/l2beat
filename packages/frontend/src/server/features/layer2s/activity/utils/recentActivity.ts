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

/** [timestamp, count, uopsCount] of each period up to the newest block */
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
  return [...points.values()]
    .filter(
      ([period]) =>
        period < newest || recent.until - period >= MIN_ELAPSED[resolution],
    )
    .sort(([a], [b]) => a - b)
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
  if (!own) return { data, liveUntil: undefined }
  const after = data.at(-1)?.[0] ?? 0
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
  return { data: [...data, ...appended], liveUntil: own.until }
}
