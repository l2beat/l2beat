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
import { LIVE_USUAL_DAYS, toLiveLength } from '~/utils/range/liveRanges'
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
  /** The window's length, read rounded and clamped as `toLiveLength` does */
  seconds: v.number().check(Number.isFinite),
  /** Read from the buffer's start, for a window moved through it */
  whole: v.boolean().optional(),
})
export type ProjectLiveWindowParams = v.infer<typeof ProjectLiveWindowParams>

export interface ProjectLiveStatus {
  /** Whether the chain's blocks are stored as they come */
  available: boolean
  /** Of the newest stored block. Undefined while there is none */
  newest: UnixTime | undefined
  /** Per second, over the minute up to the newest block, while it is recent */
  now: { tps: number; uops: number } | undefined
}

export interface ProjectLiveWindow {
  /** What was read, `to` excluded */
  window: {
    /** Its length */
    seconds: number
    from: UnixTime
    to: UnixTime
    /** Seconds per bucket */
    bucket: number
    /** Where the buckets start: a little before `from`, or with the buffer */
    readFrom: UnixTime
  }
  /** Those with blocks */
  buckets: LiveActivityBucketRecord[]
  /** Of the oldest stored block, before which nothing is known */
  oldest: UnixTime | undefined
  /** The hours the window is in, as they were on the days before */
  usual: UsualHour[]
  /** The whole buffer, in longer buckets */
  overview: { bucket: number; buckets: LiveActivityBucketRecord[] }
  buffer: LiveBuffer
}

const cache = new FrontendInMemoryCache('getProjectLiveActivity')

/** A whole buffer is kept longer: the window's own read has its newest buckets */
const WHOLE_TTL_SECONDS = 30

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
  const seconds = toLiveLength(params.seconds)
  return cache.get(
    {
      key: [
        'project-live-window',
        params.projectId,
        seconds.toString(),
        params.whole ? 'whole' : 'window',
      ],
      ttl: params.whole ? WHOLE_TTL_SECONDS : 2,
    },
    () => readProjectLiveWindow({ ...params, seconds }),
  )
}

async function readProjectLiveStatus(
  id: ProjectId,
): Promise<ProjectLiveStatus> {
  const none = {
    available: false,
    newest: undefined,
    now: undefined,
  }
  if (env.MOCK) return none
  const db = getDb()
  const [latest] = await db.liveActivityBlock.getNewest(id, 1)
  const newest = latest?.timestamp
  if (newest === undefined) return none

  const available = isLiveFresh(newest, UnixTime.now())
  const now = available
    ? await getLastMinuteRates(newest, (from, to) =>
        db.liveActivityBlock.getProjectBuckets(id, from, to, UnixTime.MINUTE),
      )
    : undefined
  return { available, newest, now }
}

async function readProjectLiveWindow({
  projectId,
  seconds,
  whole,
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
    seconds,
    buffer,
    getBlockSeconds(latest.map((b) => b.timestamp)),
    whole,
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
    oldest,
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
