import type { LiveActivityBucketRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import {
  LIVE_BUCKET_SECONDS,
  LIVE_BUFFER_SECONDS,
  LIVE_RANGES,
  type LiveActivityPoint,
  type LiveRange,
} from './liveRanges'
import {
  getBlockSeconds,
  getLastMinuteRates,
  getLastMinuteStart,
  getLiveWindow,
  getUsualRates,
  LAST_MINUTE_BUCKET,
} from './liveWindow'

const OVERVIEW_BUCKET_SECONDS = 60
const USUAL_DAYS = 7
/** Newest blocks the block time is taken from */
const SLOT_SAMPLE = 30

export const ProjectLiveActivityParams = v.object({
  projectId: v.string(),
  range: v.enum(['5m', '15m', '1h', '4h']),
  /** Where the window ends. Left out, it follows the newest block */
  to: v.number().optional(),
})
export type ProjectLiveActivityParams = v.infer<
  typeof ProjectLiveActivityParams
>

export interface ProjectLiveActivity {
  /** Of the newest stored block. Undefined while there is none */
  newest: UnixTime | undefined
  /** Of the oldest stored block, before which nothing is known */
  oldest: UnixTime | undefined
  /** The whole buffer, a minute a point */
  overview: LiveActivityPoint[]
  detail: {
    from: UnixTime
    to: UnixTime
    /** Seconds per point */
    bucket: number
    /** Where the points start, a little before `from` */
    readFrom: UnixTime
    points: LiveActivityPoint[]
  }
  /** Per second, over the minute up to the newest block */
  now: { tps: number; uops: number } | undefined
  /** Per second, in the hour the window ends in, on the days of the last week */
  usual: { tps: number; uops: number } | undefined
}

const cache = new FrontendInMemoryCache('getProjectLiveActivity')

export function getProjectLiveActivity(
  params: ProjectLiveActivityParams,
): Promise<ProjectLiveActivity> {
  return cache.get(
    {
      key: [
        'project-live-activity',
        params.projectId,
        params.range,
        params.to?.toString(),
      ],
      ttl: 2,
    },
    () => readProjectLiveActivity(params),
  )
}

async function readProjectLiveActivity({
  projectId,
  range,
  to,
}: ProjectLiveActivityParams): Promise<ProjectLiveActivity> {
  const now = UnixTime.now()
  if (env.MOCK) return emptyActivity(now, range)
  const db = getDb()
  const id = ProjectId(projectId)
  const latest = await db.liveActivityBlock.getNewest(id, SLOT_SAMPLE)
  const newest = latest.at(-1)?.timestamp
  if (newest === undefined) return emptyActivity(now, range)

  const window = getLiveWindow(
    range,
    newest,
    getBlockSeconds(latest.map((b) => b.timestamp)),
    to,
  )
  const hour = UnixTime.toStartOf(window.to, 'hour')
  const [oldest, lastMinute, overview, hours, detail] = await Promise.all([
    db.liveActivityBlock.getOldestTimestamp(id),
    db.liveActivityBlock.getProjectBuckets(
      id,
      getLastMinuteStart(newest),
      newest,
      LAST_MINUTE_BUCKET,
    ),
    db.liveActivityBlock.getProjectBuckets(
      id,
      newest - LIVE_BUFFER_SECONDS,
      newest - (newest % OVERVIEW_BUCKET_SECONDS) - 1,
      OVERVIEW_BUCKET_SECONDS,
    ),
    db.hourlyActivity.getByProjectsAndTimeRange(
      [id],
      [hour - USUAL_DAYS * UnixTime.DAY, hour - UnixTime.DAY],
    ),
    db.liveActivityBlock.getProjectBuckets(
      id,
      window.readFrom,
      window.to,
      window.bucket,
    ),
  ])

  return {
    newest,
    oldest,
    overview: overview.map(toPoint),
    detail: { ...window, points: detail.map(toPoint) },
    now: getLastMinuteRates(lastMinute, newest),
    usual: getUsualRates(hours, hour),
  }
}

function toPoint(bucket: LiveActivityBucketRecord): LiveActivityPoint {
  return [
    bucket.timestamp,
    bucket.count,
    bucket.uopsCount,
    bucket.blocks,
    bucket.gasUsed,
  ]
}

/** Mock mode has no stored blocks */
function emptyActivity(now: UnixTime, range: LiveRange): ProjectLiveActivity {
  return {
    newest: undefined,
    oldest: undefined,
    overview: [],
    detail: {
      from: now - LIVE_RANGES[range] + 1,
      to: now,
      bucket: LIVE_BUCKET_SECONDS[range],
      readFrom: now - LIVE_RANGES[range] + 1,
      points: [],
    },
    now: undefined,
    usual: undefined,
  }
}
