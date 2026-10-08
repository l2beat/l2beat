import type { Logger } from '@l2beat/backend-tools'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getLogger } from '~/server/utils/logger'
import { SLOT_SECONDS, slotProgressAt } from '~/utils/beaconSlots'
import { createAttribute, getBlobSenders } from './attribute'
import { createBeaconNode } from './beaconNode'
import { getBlobPosters } from './getBlobPosters'
import { createMockBeaconNode } from './mockBeaconNode'
import { PAST_PAGE_SLOTS, RECENT_SLOTS } from './slots'

/** Slots summed up for who posted: an hour */
export const WINDOW_SLOTS = 300
/** The hour in five-minute steps, for how each project's posting went */
export const BUCKET_SLOTS = 25
/**
 * Slots behind the head fetched again as the head moves on. The chain can
 * still drop its newest blocks for ones built beside them (a reorg): a slot
 * that had a block then has none, and one that was missed may get one
 */
const UNSETTLED_SLOTS = 2
/**
 * Tries at a block before it is left a gap. The node answers for its head, so
 * it is there: a block that keeps failing is that block's trouble, not an
 * outage to back off from for as long as the block is in the window
 */
const BLOCK_TRIES = 3
/** Blocks fetched at once, by the poll and by the backfill each. Each is a few hundred kilobytes */
const CONCURRENCY = 4
/**
 * How often the head is asked for while the block being made has not come.
 * Asking costs a few hundred bytes, and every second asked sooner is a
 * second sooner on every screen
 */
const POLL_INTERVAL = 1
/** Blocks reach the node about a second into their slot at the earliest */
const FIRST_POLL_INTO_SLOT = 1
/**
 * How long a page's ask takes at most when there is nothing new, the wait for
 * the first answer included; within the server's 25 s request timeout
 */
const LONG_POLL = 20
const MAX_RETRY_DELAY = 30
/**
 * Nobody asked for this long: the node is left alone until someone does. As
 * long as the window, so a short quiet spell does not cost a whole backfill
 */
const IDLE_AFTER = WINDOW_SLOTS * SLOT_SECONDS
/** How long the first answer after a quiet spell waits for the belt's blocks */
const FIRST_ANSWER_TIMEOUT = 10

export const LiveBlobsParams = v.object({
  /** The newest slot the page has: the answer waits for the head to move off it */
  after: v.number().optional(),
})
export type LiveBlobsParams = v.infer<typeof LiveBlobsParams>

export const PastBlobsParams = v.object({
  /** Which `PAST_PAGE_SLOTS` slots, counted from genesis */
  page: v.number(),
})
export type PastBlobsParams = v.infer<typeof PastBlobsParams>

/** The recent blocks, as served to the page */
export interface LiveBlobs {
  /** The newest slot the node had at the last poll */
  head: number
  /** Whether the last poll reached the node. If not, the blocks may lag */
  live: boolean
  /** Known blocks of the last `RECENT_SLOTS` slots up to the head, newest first */
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

/** The blocks of one page of the hour, for a page looking back through it */
export interface PastBlobs {
  /** Known blocks of the page, newest first */
  blocks: LiveBlock[]
  /**
   * Every slot of the page that is still in the hour is known, and the page
   * ends at the head or before, so looking again would bring nothing more
   */
  complete: boolean
}

/**
 * Who posted over the slots known back from the head without a gap. Short of
 * `WINDOW_SLOTS` while the feed is still catching up
 */
export interface PostedWindow {
  slots: number
  /** Of those slots, the ones that got a block */
  blocks: number
  /** Blobs in each slot, newest first; null where the slot was missed */
  blobsPerSlot: (number | null)[]
  /**
   * The oldest of the five-minute steps in `Posted.buckets`, counted in
   * `BUCKET_SLOTS` from genesis. Moves on by one as each new step starts
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
   * Blobs in each five-minute step from `PostedWindow.firstBucket`, the last
   * being the one under way. Steps are fixed in time, not counted back from
   * the head, so a new block adds to the last step and leaves the rest be
   */
  buckets: number[]
}

/** Where blocks come from */
export interface BeaconSource {
  headSlot(): Promise<number>
  block(slot: number): Promise<LiveBlock>
}

let feed: LiveBlobsFeed | undefined

/** The one feed of this server, shared by every visitor */
export function getLiveBlobsFeed(): LiveBlobsFeed {
  feed ??= new LiveBlobsFeed(
    env.MOCK
      ? createMockBeaconNode(
          getBlobPosters().then((posters) => posters.map((p) => p.id)),
        )
      : createBeaconNode(getBlobSenders().then(createAttribute)),
    getLogger(),
  )
  return feed
}

/**
 * Follows Ethereum as it makes blocks, for every visitor at once: each block
 * is fetched and decoded once, however many are watching. It follows only
 * while someone asks, and catches up on the next ask after a quiet spell.
 *
 * The belt's blocks come first; the rest of the hour is backfilled behind
 * them, so the belt does not wait for it.
 */
export class LiveBlobsFeed {
  private readonly blocks = new Map<number, LiveBlock>()
  /** Failed tries at each block not fetched yet */
  private readonly tries = new Map<number, number>()
  /**
   * Slots whose block the chain may have dropped and whose fresh look has not
   * come: looked at again on every poll, head moved or not, or a dropped
   * block would be served for as long as it is in the window
   */
  private readonly recheck = new Set<number>()
  private head: number | undefined
  private failures = 0
  private lastAskedAt = 0
  /** The first poll of the current run; unset while nobody asks */
  private warmup: Promise<void> | undefined
  /** Pages waiting for a new head */
  private readonly waiting = new Set<() => void>()
  /** The backfill running now, if any */
  private backfillRun: Promise<void> | undefined
  private timer: ReturnType<typeof setTimeout> | undefined
  private readonly logger: Logger

  constructor(
    private readonly source: BeaconSource,
    logger: Logger,
    private readonly now = () => Date.now() / 1000,
  ) {
    this.logger = logger.for(this)
  }

  /** The recent blocks, or undefined while the node has never been reached */
  async latest(): Promise<LiveBlobs | undefined> {
    this.lastAskedAt = this.now()
    this.warmup ??= this.poll()
    await withTimeout(this.warmup, FIRST_ANSWER_TIMEOUT)
    return this.snapshot()
  }

  /**
   * The recent blocks once the head is not `after` any more, or as they are
   * after `LONG_POLL` seconds. Held open, a page hears of a block the moment
   * the server has it, rather than at its next ask
   */
  async latestAfter({ after }: LiveBlobsParams) {
    const askedAt = this.now()
    await this.latest()
    if (after === undefined) return this.snapshot()
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
      if (this.head === undefined || this.head !== after) done()
    })
    // not `latest`, which would wait for a first answer all over again
    return this.snapshot()
  }

  /**
   * One page of the hour, from what is held: looking back never makes the
   * node fetch, as the hour is backfilled for the numbers anyway
   */
  past({ page }: PastBlobsParams): PastBlobs {
    const first = page * PAST_PAGE_SLOTS
    const last = first + PAST_PAGE_SLOTS - 1
    const blocks: LiveBlock[] = []
    let complete = this.head !== undefined && last <= this.head
    for (let slot = last; slot >= first; slot--) {
      const block = this.blocks.get(slot)
      if (block) blocks.push(block)
      else if (this.head !== undefined && slot > this.head - WINDOW_SLOTS) {
        complete = false
      }
    }
    return { blocks, complete }
  }

  /** Resolves once the backfill running now, if any, is done */
  async backfilled() {
    await this.backfillRun
  }

  stop() {
    clearTimeout(this.timer)
    this.warmup = undefined
  }

  private async poll() {
    const wasLive = this.failures === 0
    let changed = false
    try {
      const head = await this.source.headSlot()
      const moved = head !== this.head
      if (moved) {
        for (const slot of slotsUnsettled(this.blocks, head)) {
          this.recheck.add(slot)
        }
      }
      const missing = this.slotsToFetch(head, head - RECENT_SLOTS)
      const fetched = await this.fetchAll([
        ...missing,
        ...this.worthAsking(this.recheck),
      ])
      // a block that failed to come with its head, and came on this try
      const filled = missing.some((slot) => this.blocks.has(slot))
      this.head = head
      forgetOld(this.blocks, head)
      forgetOld(this.tries, head)
      forgetOld(this.recheck, head)
      this.failures = fetched ? 0 : this.failures + 1
      this.backfill(head)
      changed = moved || filled
    } catch (error) {
      // logged once per outage, not on every retry
      if (this.failures === 0) {
        this.logger.warn('Beacon node unreachable', { error })
      }
      this.failures++
    }
    // the page also shows whether the node is reached, so it hears of that too
    if (changed || wasLive !== (this.failures === 0)) this.answerWaiting()
    this.scheduleNext()
  }

  private answerWaiting() {
    for (const done of [...this.waiting]) done()
  }

  /** Fills in the rest of the window. A gap left by a failure is retried on the next poll */
  private backfill(head: number) {
    this.backfillRun ??= this.fetchAll(
      this.slotsToFetch(head - RECENT_SLOTS, head - WINDOW_SLOTS),
    ).then(() => {
      this.backfillRun = undefined
    })
  }

  /** The slots from `from` down to just above `downTo` still worth asking for, newest first */
  private slotsToFetch(from: number, downTo: number) {
    return this.worthAsking(slotsMissing(this.blocks, from, downTo))
  }

  /** Of `slots`, the ones not given up on */
  private worthAsking(slots: Iterable<number>) {
    return [...slots].filter(
      (slot) => (this.tries.get(slot) ?? 0) < BLOCK_TRIES,
    )
  }

  private fetchAll(slots: number[]) {
    return forEachLimited(slots, CONCURRENCY, async (slot) => {
      try {
        this.blocks.set(slot, await this.source.block(slot))
        this.recheck.delete(slot)
      } catch (error) {
        this.tries.set(slot, (this.tries.get(slot) ?? 0) + 1)
        throw error
      }
    })
  }

  private scheduleNext() {
    if (this.now() - this.lastAskedAt > IDLE_AFTER) {
      this.warmup = undefined
      return
    }
    this.timer = setTimeout(
      () => void this.poll(),
      1000 * nextPollIn(this.blocks, slotProgressAt(this.now()), this.failures),
    )
    // a feed nobody stopped must not keep the process alive
    this.timer.unref()
  }

  private snapshot(): LiveBlobs | undefined {
    if (this.head === undefined) return undefined
    const blocks: LiveBlock[] = []
    for (let slot = this.head; slot > this.head - RECENT_SLOTS; slot--) {
      const block = this.blocks.get(slot)
      if (block) blocks.push(block)
    }
    return {
      head: this.head,
      live: this.failures === 0,
      blocks,
      window: postedWindow(this.blocks, this.head),
    }
  }
}

/** Sums up the blocks back from the head until the first one not known yet */
function postedWindow(
  blocks: Map<number, LiveBlock>,
  head: number,
): PostedWindow {
  const byProject = new Map<string | undefined, Posted>()
  const blobsPerSlot: (number | null)[] = []
  // the step under way and the eleven before it, all inside the window
  const bucketCount = WINDOW_SLOTS / BUCKET_SLOTS
  const firstBucket = Math.floor(head / BUCKET_SLOTS) - bucketCount + 1
  let slots = 0
  let proposed = 0
  for (; slots < WINDOW_SLOTS; slots++) {
    const block = blocks.get(head - slots)
    if (!block) break
    if (block.status === 'missed') {
      blobsPerSlot.push(null)
      continue
    }
    proposed++
    let blobs = 0
    const bucket = Math.floor(block.slot / BUCKET_SLOTS) - firstBucket
    for (const batch of block.batches) {
      // newest first, so the first batch seen is the last one sent
      const posted = byProject.get(batch.projectId) ?? {
        projectId: batch.projectId,
        blobs: 0,
        batches: 0,
        lastSlot: block.slot,
        lastBlobs: 0,
        buckets: Array<number>(bucketCount).fill(0),
      }
      posted.blobs += batch.blobs
      posted.batches++
      if (block.slot === posted.lastSlot) posted.lastBlobs += batch.blobs
      if (bucket >= 0) {
        posted.buckets[bucket] = (posted.buckets[bucket] ?? 0) + batch.blobs
      }
      byProject.set(batch.projectId, posted)
      blobs += batch.blobs
    }
    blobsPerSlot.push(blobs)
  }
  return {
    slots,
    blocks: proposed,
    blobsPerSlot,
    firstBucket,
    posted: [...byProject.values()].sort((a, b) => b.blobs - a.blobs),
  }
}

/** The slots from `from` down to just above `downTo` that have no block yet, newest first */
function slotsMissing(
  blocks: Map<number, LiveBlock>,
  from: number,
  downTo: number,
) {
  const missing: number[] = []
  for (let slot = from; slot > downTo; slot--) {
    if (!blocks.has(slot)) missing.push(slot)
  }
  return missing
}

/** The slots just behind the head whose block the chain may have dropped since, newest first */
function slotsUnsettled(blocks: Map<number, LiveBlock>, head: number) {
  const unsettled: number[] = []
  for (let slot = head - 1; slot >= head - UNSETTLED_SLOTS; slot--) {
    if (blocks.has(slot)) unsettled.push(slot)
  }
  return unsettled
}

/**
 * Lets go of what fell out of the window, and of anything above the head:
 * the chain can move its head back, dropping its newest block for none, and
 * that slot is then fetched afresh when a block fills it
 */
function forgetOld(bySlot: Set<number> | Map<number, unknown>, head: number) {
  for (const slot of bySlot.keys()) {
    if (slot <= head - WINDOW_SLOTS || slot > head) bySlot.delete(slot)
  }
}

/** Seconds until the head is worth asking for again */
function nextPollIn(
  blocks: Map<number, LiveBlock>,
  progress: number,
  failures: number,
) {
  if (failures > 0)
    return Math.min(MAX_RETRY_DELAY, POLL_INTERVAL * 2 ** failures)
  const current = Math.floor(progress)
  if (!blocks.has(current)) return POLL_INTERVAL
  const intoSlot = (progress - current) * SLOT_SECONDS
  return SLOT_SECONDS - intoSlot + FIRST_POLL_INTO_SLOT
}

/**
 * Runs `task` on every item, at most `limit` at once, in order of the items.
 * Says whether all of them succeeded; one failing does not stop the rest.
 */
async function forEachLimited<T>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<void>,
): Promise<boolean> {
  let next = 0
  let succeeded = true
  const worker = async () => {
    while (next < items.length) {
      const item = items[next++] as T
      await task(item).catch(() => {
        succeeded = false
      })
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  )
  return succeeded
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
