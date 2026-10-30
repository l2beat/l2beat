import type { Logger } from '@l2beat/backend-tools'
import type { Database, LiveSlotRange } from '@l2beat/database'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb, getLiveBlobsDb } from '~/server/database'
import { getLogger } from '~/server/utils/logger'
import {
  buildLiveBlobs,
  buildPastBlobs,
  isLive,
  type LiveBlobsRows,
} from './buildLiveBlobs'
import { getBlobPosters } from './getBlobPosters'
import {
  BELT_SLOTS,
  BUCKET_SLOTS,
  PAST_PAGE_SLOTS,
  PULSE_BUCKET_SLOTS,
  WINDOW_SLOTS,
} from './liveBlobsSlots'
import { createMockLiveBlobsSource } from './mockLiveBlobsSource'

/** Seconds. A cheap primary-key lookup; half of it is the average wait before a stored block is served */
const POLL_INTERVAL = 0.1
/** Must stay within the server's 25 s request timeout */
const LONG_POLL = 20
const MAX_RETRY_DELAY = 30
/** A page asks at least every `LONG_POLL`, so this long without an ask means nobody is watching */
const IDLE_AFTER = 3 * LONG_POLL
const FIRST_ANSWER_TIMEOUT = 10
/** The pool waits for a free connection with no limit, so a stuck read must be cut off */
const READ_TIMEOUT = 5

export const LiveBlobsParams = v.object({
  /** The newest slot the page has: the answer waits for the head to move off it */
  after: v.number().optional(),
})
export type LiveBlobsParams = v.infer<typeof LiveBlobsParams>

export const PastBlobsParams = v.object({
  /** In `PAST_PAGE_SLOTS` from genesis */
  page: v
    .number()
    .check(
      (page) =>
        Number.isInteger(page) &&
        page >= 0 &&
        Number.isSafeInteger((page + 1) * PAST_PAGE_SLOTS),
      'Page must be a whole number of slots from genesis',
    ),
})
export type PastBlobsParams = v.infer<typeof PastBlobsParams>

export interface LiveBlobs {
  head: number
  /** False when the last read failed or found the head older than the chain allows */
  live: boolean
  /** Newest first */
  blocks: LiveBlock[]
  window: PostedWindow
}

export type LiveBlock =
  | {
      slot: number
      status: 'proposed'
      blockNumber: number
      /** Tells apart a block that replaced another in the same slot */
      hash: string
      batches: LiveBatch[]
    }
  | { slot: number; status: 'missed' }

export interface PastBlobs {
  /** Newest first */
  blocks: LiveBlock[]
  /** Every slot still in the day is known and none may be rewritten, so asking again brings nothing new */
  complete: boolean
}

/** One blob transaction */
export interface LiveBatch {
  /** Missing when no project claims it */
  projectId?: string
  blobs: number
  /** Lowercase */
  to: string
  txHash: string
}

export interface PostedWindow {
  /** Short of `WINDOW_SLOTS` while the backend has not stored a whole day yet */
  slots: number
  blocks: number
  newestBlobs: number
  pulse: Pulse
  /** Of `Posted.buckets`, in `BUCKET_SLOTS` from genesis */
  firstBucket: number
  /** Most blobs first */
  posted: Posted[]
}

export interface Posted {
  projectId?: string
  blobs: number
  batches: number
  lastSlot: number
  lastBlobs: number
  /**
   * Steps are fixed in time, not counted back from the head, so a new block
   * adds to the last (under way) step and leaves the rest be
   */
  buckets: number[]
}

export interface Pulse {
  /** In `PULSE_BUCKET_SLOTS` from genesis */
  firstBucket: number
  buckets: { blocks: number; blobs: number }[]
}

/** The database, or made-up rows in mock mode */
export interface LiveBlobsSource {
  liveBlock: Pick<
    Database['liveBlock'],
    'findHead' | 'getSlotRange' | 'getBySlotRange' | 'getBucketsSince'
  >
  liveBlobBatch: Pick<
    Database['liveBlobBatch'],
    'getBySlotRange' | 'getPostedSince' | 'getBucketsSince'
  >
}

let feed: LiveBlobsFeed | undefined

/** Shared by every visitor of this server */
export function getLiveBlobsFeed(): LiveBlobsFeed {
  feed ??= env.MOCK
    ? new LiveBlobsFeed(
        createMockLiveBlobsSource(
          getBlobPosters().then((posters) => posters.map((p) => p.id)),
        ),
        getLogger(),
      )
    : new LiveBlobsFeed(getLiveBlobsDb(), getLogger(), getDb())
  return feed
}

/**
 * Reads for every visitor at once: the head a few times a second while anyone
 * asks, the rows behind it once per new head. Keeping only the last snapshot
 * lets reorgs and pruning show up on their own.
 */
export class LiveBlobsFeed {
  private snapshot: LiveBlobs | undefined
  /** How far back the database reached at the snapshot */
  private stored: LiveSlotRange | undefined
  /** Another hash is a new head, or the head replaced in its slot */
  private headHash: string | undefined
  private failures = 0
  private lastAskedAt = 0
  /** The first read of the current run; unset while nobody asks */
  private warmup: Promise<void> | undefined
  /** A poll after a timed-out read waits on it rather than starting another */
  private reading: Promise<void> | undefined
  private readonly waiting = new Set<() => void>()
  private timer: ReturnType<typeof setTimeout> | undefined
  private readonly logger: Logger

  constructor(
    private readonly source: LiveBlobsSource,
    logger: Logger,
    /** Kept apart from `source`, so pages looking back cannot hold up the polling */
    private readonly pastSource = source,
    private readonly now = () => Date.now() / 1000,
  ) {
    this.logger = logger.for(this)
  }

  /** Undefined while no head has ever been read */
  async latest(): Promise<LiveBlobs | undefined> {
    this.lastAskedAt = this.now()
    this.warmup ??= this.poll()
    await settlesWithin(this.warmup, FIRST_ANSWER_TIMEOUT)
    return this.snapshot
  }

  /**
   * Long poll: answers once the head moves off `after`, or after `LONG_POLL`,
   * so a page hears of a block the moment the server has it
   */
  async latestAfter({ after }: LiveBlobsParams) {
    const askedAt = this.now()
    await this.latest()
    if (this.isBehind(after)) return this.snapshot
    const left = Math.max(0, LONG_POLL - (this.now() - askedAt))
    await new Promise<void>((resolve) => {
      const done = () => {
        clearTimeout(timer)
        this.waiting.delete(done)
        resolve()
      }
      const timer = setTimeout(done, left * 1000)
      this.waiting.add(done)
      // looked at again only once waiting, or a head that moved between the
      // look and the wait would be missed: pages are answered as they wait
      if (this.isBehind(after)) done()
    })
    // not `latest`, which would wait for a first answer all over again
    return this.snapshot
  }

  /** Any other head counts: one that moved back has blocks to take off the page */
  private isBehind(after: number | undefined) {
    return this.snapshot !== undefined && this.snapshot.head !== after
  }

  /** Read straight from the database: pages looking back are few, and a complete one is never asked for again */
  async past({ page }: PastBlobsParams): Promise<PastBlobs> {
    const live = await this.latest()
    if (!live) return { blocks: [], complete: false }
    const stored = this.stored
    const first = page * PAST_PAGE_SLOTS
    const last = first + PAST_PAGE_SLOTS - 1
    const [blocks, batches] = await Promise.all([
      this.pastSource.liveBlock.getBySlotRange(first, last),
      this.pastSource.liveBlobBatch.getBySlotRange(first, last),
    ])
    return buildPastBlobs({ stored, blocks, batches }, live.head, first, last)
  }

  stop() {
    clearTimeout(this.timer)
    this.warmup = undefined
  }

  private async poll() {
    const before = this.snapshot
    try {
      await this.readInTime()
      this.failures = 0
    } catch (error) {
      // logged once per outage, not on every retry
      if (this.failures === 0) {
        this.logger.warn('Live blobs unreadable', { error })
      }
      this.failures++
      if (this.snapshot?.live) this.snapshot = { ...this.snapshot, live: false }
    }
    // replaced only when a page would see a difference
    if (this.snapshot !== before) this.answerWaiting()
    this.scheduleNext()
  }

  /**
   * Fails a read that takes too long, but lets it run on: the next poll waits
   * on it rather than starting another, which could also land after a newer one
   */
  private async readInTime() {
    this.reading ??= this.read().finally(() => {
      this.reading = undefined
    })
    if (!(await settlesWithin(this.reading, READ_TIMEOUT))) {
      throw new Error(`Live blobs read took over ${READ_TIMEOUT} s`)
    }
  }

  private async read() {
    const head = await this.source.liveBlock.findHead()
    if (!head) return
    if (head.hash !== this.headHash) {
      const rows = await readRows(this.source, head.slot)
      this.snapshot = buildLiveBlobs(rows, head.slot, this.now())
      this.stored = rows.stored
      this.headHash = head.hash
      return
    }
    // the head stays put, but the clock does not: it may fall behind it
    if (this.snapshot) {
      const live = isLive(this.snapshot.head, this.now())
      if (live !== this.snapshot.live)
        this.snapshot = { ...this.snapshot, live }
    }
  }

  private answerWaiting() {
    for (const done of [...this.waiting]) done()
  }

  private scheduleNext() {
    if (this.now() - this.lastAskedAt > IDLE_AFTER) {
      this.warmup = undefined
      return
    }
    const delay =
      this.failures > 0
        ? Math.min(MAX_RETRY_DELAY, POLL_INTERVAL * 2 ** this.failures)
        : POLL_INTERVAL
    this.timer = setTimeout(() => void this.poll(), 1000 * delay)
    // a feed nobody stopped must not keep the process alive
    this.timer.unref()
  }
}

/** A block stored between the reads may slip into the sums; the next head read finds it and reads again */
async function readRows(
  source: LiveBlobsSource,
  head: number,
): Promise<LiveBlobsRows> {
  const windowStart = head - WINDOW_SLOTS + 1
  const beltStart = head - BELT_SLOTS + 1
  const [stored, inWindow, blocks, batches, posted, buckets, pulse] =
    await Promise.all([
      source.liveBlock.getSlotRange(),
      source.liveBlock.getSlotRange(windowStart),
      source.liveBlock.getBySlotRange(beltStart, head),
      source.liveBlobBatch.getBySlotRange(beltStart, head),
      source.liveBlobBatch.getPostedSince(windowStart),
      source.liveBlobBatch.getBucketsSince(windowStart, BUCKET_SLOTS),
      source.liveBlock.getBucketsSince(windowStart, PULSE_BUCKET_SLOTS),
    ])
  return { stored, inWindow, blocks, batches, posted, buckets, pulse }
}

/** Waits for `promise`, but no longer than `seconds`. Says whether it settled */
async function settlesWithin(promise: Promise<void>, seconds: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<false>((resolve) => {
    timer = setTimeout(() => resolve(false), 1000 * seconds)
  })
  try {
    return await Promise.race([promise.then(() => true), timeout])
  } finally {
    clearTimeout(timer)
  }
}
