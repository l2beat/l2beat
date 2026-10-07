import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
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
  PULSE_SLOTS,
  WINDOW_SLOTS,
} from './liveBlobsSlots'
import { createMockLiveBlobsSource } from './mockLiveBlobsSource'

/**
 * How often the head is read while pages wait, in seconds. It is a
 * primary-key lookup, and every read sooner is that much sooner on every
 * screen
 */
const POLL_INTERVAL = 0.25
/**
 * How long a page's ask takes at most when there is nothing new, the wait for
 * the first answer included; within the server's 25 s request timeout
 */
const LONG_POLL = 20
const MAX_RETRY_DELAY = 30
/** Nobody asked for this long: the database is left alone until someone does. A page asks at least every `LONG_POLL` */
const IDLE_AFTER = 3 * LONG_POLL
/** How long the first answer after a quiet spell waits for the rows */
const FIRST_ANSWER_TIMEOUT = 10

export const LiveBlobsParams = v.object({
  /** The newest slot the page has: the answer waits for the head to move off it */
  after: v.number().optional(),
})
export type LiveBlobsParams = v.infer<typeof LiveBlobsParams>

export const PastBlobsParams = v.object({
  /** Which `PAST_PAGE_SLOTS` slots, counted from genesis */
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

/** The recent blocks, as served to the page */
export interface LiveBlobs {
  /** The newest stored slot at the last read */
  head: number
  /**
   * Whether the last read reached the database and found the head no older
   * than the chain allows. If not, the blocks may lag
   */
  live: boolean
  /** Known blocks of the last `BELT_SLOTS` slots up to the head, newest first */
  blocks: LiveBlock[]
  window: PostedWindow
}

export type LiveBlock =
  | {
      slot: number
      status: 'proposed'
      blockNumber: number
      /** In the block's order */
      batches: LiveBatch[]
    }
  | { slot: number; status: 'missed' }

/** The blocks of one page of the hour, for a page looking back through it */
export interface PastBlobs {
  /** Known blocks of the page, newest first */
  blocks: LiveBlock[]
  /**
   * Every slot of the page that is still in the hour is known, and the page
   * ends behind the slots the backend may still rewrite, so looking again
   * would bring nothing more
   */
  complete: boolean
}

/** One blob transaction: a project's batch in a block */
export interface LiveBatch {
  /** Missing when no project claims it */
  projectId?: string
  blobs: number
  /** Where it was sent, lowercase. Says the most about an unattributed batch */
  to: string
  /** For the page to link the transaction to an explorer */
  txHash: string
}

/**
 * Who posted over the stored slots back from the head. Short of
 * `WINDOW_SLOTS` while the backend has not stored a whole day yet
 */
export interface PostedWindow {
  slots: number
  /** Of those slots, the ones that got a block */
  blocks: number
  /**
   * Blobs in each of the last `PULSE_SLOTS` slots, newest first; null where
   * the slot was missed
   */
  blobsPerSlot: (number | null)[]
  /**
   * The oldest of the steps in `Posted.buckets`, counted in `BUCKET_SLOTS`
   * from genesis. Moves on by one as each new step starts
   */
  firstBucket: number
  /** Most blobs first */
  posted: Posted[]
}

export interface Posted {
  /** Missing for the batches no project claims */
  projectId?: string
  blobs: number
  batches: number
  /** Slot of the newest batch */
  lastSlot: number
  /** Blobs that slot brought from the project */
  lastBlobs: number
  /**
   * Blobs in each step from `PostedWindow.firstBucket`, the last
   * being the one under way. Steps are fixed in time, not counted back from
   * the head, so a new block adds to the last step and leaves the rest be
   */
  buckets: number[]
}

/** Where the rows come from: the database, or made up in mock mode */
export interface LiveBlobsSource {
  liveBlock: Pick<
    Database['liveBlock'],
    'findHead' | 'getSlotRange' | 'getBySlotRange'
  >
  liveBlobBatch: Pick<
    Database['liveBlobBatch'],
    'getBySlotRange' | 'getPostedSince' | 'getBucketsSince'
  >
}

let feed: LiveBlobsFeed | undefined

/** The one feed of this server, shared by every visitor */
export function getLiveBlobsFeed(): LiveBlobsFeed {
  feed ??= new LiveBlobsFeed(
    env.MOCK
      ? createMockLiveBlobsSource(
          getBlobPosters().then((posters) => posters.map((p) => p.id)),
        )
      : getDb(),
    getLogger(),
  )
  return feed
}

/**
 * Reads the blocks the backend stores as Ethereum makes them, for every
 * visitor at once: the head is read a few times a second while anyone asks,
 * and the rows behind it once per new head, however many are watching. It
 * keeps nothing but the last snapshot, so reorgs and pruning in the database
 * show up on their own.
 */
export class LiveBlobsFeed {
  private snapshot: LiveBlobs | undefined
  /** The head block the snapshot was read at; another hash is a new head, or the head replaced in its slot */
  private headHash: string | undefined
  private failures = 0
  private lastAskedAt = 0
  /** The first read of the current run; unset while nobody asks */
  private warmup: Promise<void> | undefined
  /** Pages waiting for a new snapshot */
  private readonly waiting = new Set<() => void>()
  private timer: ReturnType<typeof setTimeout> | undefined
  private readonly logger: Logger

  constructor(
    private readonly source: LiveBlobsSource,
    logger: Logger,
    private readonly now = () => Date.now() / 1000,
  ) {
    this.logger = logger.for(this)
  }

  /** The recent blocks, or undefined while no head has ever been read */
  async latest(): Promise<LiveBlobs | undefined> {
    this.lastAskedAt = this.now()
    this.warmup ??= this.poll()
    await withTimeout(this.warmup, FIRST_ANSWER_TIMEOUT)
    return this.snapshot
  }

  /**
   * The recent blocks once the head is not `after` any more, or as they are
   * after `LONG_POLL` seconds. Held open, a page hears of a block the moment
   * the server has it, rather than at its next ask
   */
  async latestAfter({ after }: LiveBlobsParams) {
    const askedAt = this.now()
    await this.latest()
    if (after === undefined) return this.snapshot
    const left = Math.max(0, LONG_POLL - (this.now() - askedAt))
    await new Promise<void>((resolve) => {
      const done = () => {
        clearTimeout(timer)
        this.waiting.delete(done)
        resolve()
      }
      const timer = setTimeout(done, left * 1000)
      this.waiting.add(done)
      // looked at only once waiting, or a head that moved between the look
      // and the wait would be missed: pages are answered as they wait. Any
      // other head, as one moved back has blocks to take off the page
      if (this.snapshot === undefined || this.snapshot.head !== after) done()
    })
    // not `latest`, which would wait for a first answer all over again
    return this.snapshot
  }

  /**
   * One page of the hour, read straight from the database: pages looking
   * back are few, and a complete one is never asked for again
   */
  async past({ page }: PastBlobsParams): Promise<PastBlobs> {
    const first = page * PAST_PAGE_SLOTS
    const last = first + PAST_PAGE_SLOTS - 1
    const [head, stored, blocks, batches] = await Promise.all([
      this.source.liveBlock.findHead(),
      this.source.liveBlock.getSlotRange(),
      this.source.liveBlock.getBySlotRange(first, last),
      this.source.liveBlobBatch.getBySlotRange(first, last),
    ])
    if (!head) return { blocks: [], complete: false }
    return buildPastBlobs({ stored, blocks, batches }, head.slot, first, last)
  }

  stop() {
    clearTimeout(this.timer)
    this.warmup = undefined
  }

  private async poll() {
    const before = this.snapshot
    try {
      await this.read()
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

  private async read() {
    const head = await this.source.liveBlock.findHead()
    if (!head) return
    if (head.hash !== this.headHash) {
      const rows = await readRows(this.source, head.slot)
      this.snapshot = buildLiveBlobs(rows, head.slot, this.now())
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

/**
 * Everything a snapshot at `head` is made of. A block stored between the reads
 * may slip into the sums; the next head read finds it and reads again.
 */
async function readRows(
  source: LiveBlobsSource,
  head: number,
): Promise<LiveBlobsRows> {
  const windowStart = head - WINDOW_SLOTS + 1
  const [stored, inWindow, blocks, batches, posted, buckets] =
    await Promise.all([
      source.liveBlock.getSlotRange(),
      source.liveBlock.getSlotRange(windowStart),
      source.liveBlock.getBySlotRange(head - PULSE_SLOTS + 1, head),
      source.liveBlobBatch.getBySlotRange(head - BELT_SLOTS + 1, head),
      source.liveBlobBatch.getPostedSince(windowStart),
      source.liveBlobBatch.getBucketsSince(windowStart, BUCKET_SLOTS),
    ])
  return { stored, inWindow, blocks, batches, posted, buckets }
}

/** Waits for `promise`, but no longer than `seconds` */
async function withTimeout(promise: Promise<void>, seconds: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<void>((resolve) => {
    timer = setTimeout(resolve, 1000 * seconds)
  })
  await Promise.race([promise, timeout])
  clearTimeout(timer)
}
