import {
  LIVE_BUFFER_SECONDS,
  type LiveActivityBucketRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { TRPCError } from '@trpc/server'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getLogger } from '~/server/utils/logger'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import {
  LIVE_RANGE_KEYS,
  LIVE_USUAL_DAYS,
  type LiveRange,
} from '~/utils/range/liveRanges'
import {
  getBlockSeconds,
  getLastMinuteRates,
  getLiveBuffer,
  getLiveWindow,
  getUsualRates,
  isLiveFresh,
  type LiveBuffer,
  OVERVIEW_BUCKET_SECONDS,
  type UsualHour,
} from './liveWindow'

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
  /** The hours the window is in, as they were on the days before */
  usual: UsualHour[]
  /** The whole buffer, in longer buckets */
  overview: { bucket: number; buckets: LiveActivityBucketRecord[] }
  buffer: LiveBuffer
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
  const [oldest, now] = await Promise.all([
    db.liveActivityBlock.getOldestTimestamp(id),
    available
      ? getLastMinuteRates(newest, (from, to) =>
          db.liveActivityBlock.getProjectBuckets(id, from, to, UnixTime.MINUTE),
        )
      : undefined,
  ])
  return { available, newest, oldest, now }
}

async function readProjectLiveWindow({
  projectId,
  range,
  to,
}: ProjectLiveWindowParams): Promise<ProjectLiveWindow> {
  // not found without stored blocks: the status says so first, and the
  // client leaves the live view on it
  if (env.MOCK) throw new TRPCError({ code: 'NOT_FOUND' })
  const db = getDb()
  const id = ProjectId(projectId)
  const [latest, oldest] = await Promise.all([
    db.liveActivityBlock.getNewest(id, SLOT_SAMPLE),
    db.liveActivityBlock.getOldestTimestamp(id),
  ])
  const newest = latest.at(-1)?.timestamp
  if (newest === undefined) throw new TRPCError({ code: 'NOT_FOUND' })

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
      [firstHour - LIVE_USUAL_DAYS * UnixTime.DAY, lastHour - UnixTime.DAY],
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
