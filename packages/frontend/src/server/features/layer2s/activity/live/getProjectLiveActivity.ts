import {
  LIVE_BUFFER_SECONDS,
  type LiveActivityBucketRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getLogger } from '~/server/utils/logger'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import {
  getLiveBucketSeconds,
  isLiveFresh,
  LIVE_RANGE_KEYS,
  LIVE_RANGES,
  type LiveRange,
} from './liveRanges'
import {
  getBlockSeconds,
  getLastMinuteRates,
  getLastMinuteStart,
  getLiveBuffer,
  getLiveWindow,
  getUsualRates,
  LAST_MINUTE_BUCKET,
  type LiveBuffer,
  OVERVIEW_BUCKET_SECONDS,
  type UsualHour,
} from './liveWindow'

const USUAL_DAYS = 7
/** Newest blocks the block time is taken from */
const SLOT_SAMPLE = 30

export const ProjectLiveStatusParams = v.object({ projectId: v.string() })

export const ProjectLiveWindowParams = v.object({
  projectId: v.string(),
  range: v.enum(LIVE_RANGE_KEYS),
  /** Where the window ends, excluded. Left out, it follows the newest block */
  to: v.number().optional(),
})
export type ProjectLiveWindowParams = v.infer<typeof ProjectLiveWindowParams>

export interface ProjectLiveStatus {
  /** Whether the chain's blocks are stored as they come */
  available: boolean
  /** Of the newest stored block. Undefined while there is none */
  newest: UnixTime | undefined
  /** Of the oldest stored block, before which nothing is known */
  oldest: UnixTime | undefined
  /** Per second, over the minute up to the newest block, while it is recent */
  now: { tps: number; uops: number } | undefined
}

export interface ProjectLiveWindow {
  /** What was read, `to` excluded */
  window: {
    range: LiveRange
    from: UnixTime
    to: UnixTime
    /** Seconds per bucket */
    bucket: number
    /** Where the buckets start, a little before `from` */
    readFrom: UnixTime
  }
  /** Those with blocks */
  buckets: LiveActivityBucketRecord[]
  /** The hours the window is in, as they were on the days of the last week */
  usual: UsualHour[]
  /** The whole buffer, in longer buckets */
  overview: { bucket: number; buckets: LiveActivityBucketRecord[] }
  /** Undefined while no block is stored */
  buffer: LiveBuffer | undefined
}

const cache = new FrontendInMemoryCache('getProjectLiveActivity')

export function getProjectLiveStatus(
  projectId: string,
): Promise<ProjectLiveStatus> {
  return cache.get({ key: ['project-live-status', projectId], ttl: 2 }, () =>
    readProjectLiveStatus(ProjectId(projectId)),
  )
}

export function getProjectLiveWindow(
  params: ProjectLiveWindowParams,
): Promise<ProjectLiveWindow> {
  return cache.get(
    {
      key: [
        'project-live-window',
        params.projectId,
        params.range,
        params.to?.toString(),
      ],
      ttl: 2,
    },
    () => readProjectLiveWindow(params),
  )
}

async function readProjectLiveStatus(
  id: ProjectId,
): Promise<ProjectLiveStatus> {
  const none = {
    available: false,
    newest: undefined,
    oldest: undefined,
    now: undefined,
  }
  if (env.MOCK) return none
  const db = getDb()
  const [latest] = await db.liveActivityBlock.getNewest(id, 1)
  const newest = latest?.timestamp
  if (newest === undefined) return none

  const available = isLiveFresh(newest, UnixTime.now())
  const [oldest, lastMinute] = await Promise.all([
    db.liveActivityBlock.getOldestTimestamp(id),
    available
      ? db.liveActivityBlock.getProjectBuckets(
          id,
          getLastMinuteStart(newest),
          newest,
          LAST_MINUTE_BUCKET,
        )
      : undefined,
  ])
  return {
    available,
    newest,
    oldest,
    now: lastMinute && getLastMinuteRates(lastMinute, newest),
  }
}

async function readProjectLiveWindow({
  projectId,
  range,
  to,
}: ProjectLiveWindowParams): Promise<ProjectLiveWindow> {
  if (env.MOCK) return emptyWindow(range)
  const db = getDb()
  const id = ProjectId(projectId)
  const [latest, oldest] = await Promise.all([
    db.liveActivityBlock.getNewest(id, SLOT_SAMPLE),
    db.liveActivityBlock.getOldestTimestamp(id),
  ])
  const newest = latest.at(-1)?.timestamp
  if (newest === undefined) return emptyWindow(range)

  const buffer = getLiveBuffer(newest, oldest)
  const window = getLiveWindow(
    range,
    buffer,
    getBlockSeconds(latest.map((b) => b.timestamp)),
    to,
  )
  // from where it is read, as the window following live trails the data
  const firstHour = UnixTime.toStartOf(window.readFrom, 'hour')
  const lastHour = UnixTime.toStartOf(window.to - 1, 'hour')
  const [overview, hours, buckets] = await Promise.all([
    getOverview(id, newest - (newest % OVERVIEW_BUCKET_SECONDS)),
    db.hourlyActivity.getByProjectsAndTimeRange(
      [id],
      [firstHour - USUAL_DAYS * UnixTime.DAY, lastHour - UnixTime.DAY],
    ),
    db.liveActivityBlock.getProjectBuckets(
      id,
      window.readFrom,
      window.to - 1,
      window.bucket,
    ),
  ])

  return {
    window,
    buckets,
    usual: getUsualRates(hours, firstHour, lastHour),
    overview: { bucket: OVERVIEW_BUCKET_SECONDS, buckets: overview },
    buffer,
  }
}

/**
 * The buffer up to `end`. Only whole buckets are in, so it is read once a
 * bucket, not with every window: for a chain of short blocks it is the read
 * that costs most
 */
function getOverview(id: ProjectId, end: UnixTime) {
  return cache.get(
    {
      key: ['project-live-overview', id, end.toString()],
      ttl: OVERVIEW_BUCKET_SECONDS,
    },
    () =>
      getDb().liveActivityBlock.getProjectBuckets(
        id,
        end - LIVE_BUFFER_SECONDS,
        end - 1,
        OVERVIEW_BUCKET_SECONDS,
      ),
  )
}

/**
 * Whether the project's blocks are stored as they come, so its live view has
 * something to show. Undefined with live activity off
 */
export async function getLiveAvailability(
  projectId: ProjectId,
): Promise<'available' | 'unavailable' | undefined> {
  if (!env.CLIENT_SIDE_LIVE_ACTIVITY) return undefined
  if (env.MOCK) return 'unavailable'
  try {
    const [newest] = await getDb().liveActivityBlock.getNewest(projectId, 1)
    return isLiveFresh(newest?.timestamp, UnixTime.now())
      ? 'available'
      : 'unavailable'
  } catch (error) {
    getLogger().for('getLiveAvailability').warn('Live activity unreadable', {
      error,
    })
    return 'unavailable'
  }
}

/** Without stored blocks, as in mock mode */
function emptyWindow(range: LiveRange): ProjectLiveWindow {
  const now = UnixTime.now()
  const from = now - LIVE_RANGES[range].seconds
  return {
    window: {
      range,
      from,
      to: now,
      bucket: getLiveBucketSeconds(range),
      readFrom: from,
    },
    buckets: [],
    usual: [],
    overview: { bucket: OVERVIEW_BUCKET_SECONDS, buckets: [] },
    buffer: undefined,
  }
}
