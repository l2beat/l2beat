import type { Logger } from '@l2beat/backend-tools'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getLogger } from '~/server/utils/logger'
import { SLOT_SECONDS, slotProgressAt } from '~/utils/beaconSlots'
import { createAttribute, getBlobSenders } from './attribute'
import { createBeaconNode } from './beaconNode'
import { getBlobPosters } from './getBlobPosters'
import { createMempool, type MempoolSource } from './mempool'
import { createMockBeaconNode, createMockMempool } from './mockBeaconNode'
import { type PendingBatch, PendingBlobs, type PendingTx } from './pendingBlobs'

/** Slots served back from the head: enough to fill the belt left of the bay */
export const RECENT_SLOTS = 32
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
/**
 * Nobody asked for this long: the mempool is let go. Far shorter than for
 * blocks, as it streams every pending transaction, and what waited before a
 * quiet spell is old news after it
 */
const MEMPOOL_IDLE_AFTER = 60

export const LiveBlobsParams = v.object({
  /** The `version` the page has: the answer waits for a newer one */
  after: v.number().optional(),
})
export type LiveBlobsParams = v.infer<typeof LiveBlobsParams>

/** The recent blocks, as served to the page */
export interface LiveBlobs {
  /**
   * Moves on with every new head and every change to what is pending. In
   * milliseconds of when it changed, so a restarted server does not count
   * from zero again
   */
  version: number
  /** The newest slot the node had at the last poll */
  head: number
  /** Whether the last poll reached the node. If not, the blocks may lag */
  live: boolean
  /** Known blocks of the last `RECENT_SLOTS` slots up to the head, newest first */
  blocks: LiveBlock[]
  window: PostedWindow
  /**
   * Blob transactions in one node's mempool, oldest first. Batches sent
   * privately to builders never show here, only in their block
   */
  pending: PendingBatch[]
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
  /** Lowercase. With the nonce, matches the batch to the one seen pending */
  from: string
  nonce: number
  /** Unix seconds it was first seen pending, if it was */
  pendingSince?: number
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
  if (!feed) {
    const logger = getLogger()
    if (env.MOCK_BEACON) {
      const posterIds = getBlobPosters().then((posters) =>
        posters.map((p) => p.id),
      )
      feed = new LiveBlobsFeed(
        createMockBeaconNode(posterIds),
        logger,
        createMockMempool(posterIds),
      )
    } else {
      const attribute = getBlobSenders().then(createAttribute)
      feed = new LiveBlobsFeed(
        createBeaconNode(attribute),
        logger,
        createMempool(attribute, logger),
      )
    }
  }
  return feed
}

/**
 * Follows Ethereum as it makes blocks, for every visitor at once: each block
 * is fetched and decoded once, however many are watching. It follows only
 * while someone asks, and catches up on the next ask after a quiet spell.
 *
 * The belt's blocks come first; the rest of the hour is backfilled behind
 * them, so the belt does not wait for it.
 *
 * Alongside, it listens to the mempool for blob transactions not yet in a
 * block, and lets each go as the block that includes it comes.
 */
export class LiveBlobsFeed {
  private readonly blocks = new Map<number, LiveBlock>()
  private readonly pending = new PendingBlobs()
  /** Failed tries at each block not fetched yet */
  private readonly tries = new Map<number, number>()
  private head: number | undefined
  private version = 0
  /** The pending set's version when `version` last moved */
  private pendingVersion = 0
  private failures = 0
  private lastAskedAt = 0
  /** The first poll of the current run; unset while nobody asks */
  private warmup: Promise<void> | undefined
  /** Pages waiting for a new version */
  private readonly waiting = new Set<() => void>()
  /** The backfill running now, if any */
  private backfillRun: Promise<void> | undefined
  private timer: ReturnType<typeof setTimeout> | undefined
  private readonly logger: Logger

  constructor(
    private readonly source: BeaconSource,
    logger: Logger,
    private readonly mempool: MempoolSource = NO_MEMPOOL,
    private readonly now = () => Date.now() / 1000,
  ) {
    this.logger = logger.for(this)
  }

  /** The recent blocks, or undefined while the node has never been reached */
  async latest(): Promise<LiveBlobs | undefined> {
    this.lastAskedAt = this.now()
    this.mempool.watch(this.onPendingTx)
    this.warmup ??= this.poll()
    await withTimeout(this.warmup, FIRST_ANSWER_TIMEOUT)
    return this.snapshot()
  }

  /**
   * The recent blocks once the version has passed `after`, or as they are
   * after `LONG_POLL` seconds. Held open, a page hears of a block or a
   * pending batch the moment the server has it, rather than at its next ask
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
      // looked at only once waiting, or a version that moved between the
      // look and the wait would be missed: pages are answered as they wait
      if (this.head === undefined || this.version > after) done()
    })
    // not `latest`, which would wait for a first answer all over again
    return this.snapshot()
  }

  /** Resolves once the backfill running now, if any, is done */
  async backfilled() {
    await this.backfillRun
  }

  stop() {
    clearTimeout(this.timer)
    this.warmup = undefined
    this.mempool.stop()
  }

  private readonly onPendingTx = (tx: PendingTx) => {
    this.pending.seen(tx, this.now())
    this.publish(false)
  }

  private async poll() {
    const wasLive = this.failures === 0
    let changed = false
    try {
      const head = await this.source.headSlot()
      const moved = head !== this.head
      const missing = this.slotsToFetch(head, head - RECENT_SLOTS)
      const fetched = await this.fetchAll([
        ...missing,
        ...(moved ? slotsUnsettled(this.blocks, head) : []),
      ])
      // a block that failed to come with its head, and came on this try
      const filled = missing.some((slot) => this.blocks.has(slot))
      this.head = head
      forgetOld(this.blocks, head)
      forgetOld(this.tries, head)
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
    // not only when the node answers: with it down, the mempool still has to be let go of
    this.tendMempool()
    // the page also shows whether the node is reached, so it hears of that too
    this.publish(changed || wasLive !== (this.failures === 0))
    this.scheduleNext()
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
    return slotsMissing(this.blocks, from, downTo).filter(
      (slot) => (this.tries.get(slot) ?? 0) < BLOCK_TRIES,
    )
  }

  private fetchAll(slots: number[]) {
    return forEachLimited(slots, CONCURRENCY, async (slot) => {
      let block: LiveBlock
      try {
        block = await this.source.block(slot)
      } catch (error) {
        this.tries.set(slot, (this.tries.get(slot) ?? 0) + 1)
        throw error
      }
      this.takeFromPending(block, this.blocks.get(slot))
      this.blocks.set(slot, block)
    })
  }

  /**
   * The block's batches wait no more; each notes since when it waited.
   * `held` is what the slot had before, when it is fetched again: a batch
   * still there keeps what it noted, as it left the pending ones the first
   * time, and one the chain dropped with its block may wait again
   */
  private takeFromPending(block: LiveBlock, held: LiveBlock | undefined) {
    const now = this.now()
    const batches = block.status === 'proposed' ? block.batches : []
    const heldBatches = held?.status === 'proposed' ? held.batches : []
    for (const batch of batches) {
      const since =
        this.pending.included(batch.from, batch.nonce, block.slot, now) ??
        heldBatches.find((b) => isSameBatch(b, batch))?.pendingSince
      if (since !== undefined) batch.pendingSince = since
    }
    for (const batch of heldBatches) {
      if (batches.some((b) => isSameBatch(b, batch))) continue
      this.pending.dropped(batch.from, batch.nonce, block.slot)
    }
  }

  private tendMempool() {
    if (this.now() - this.lastAskedAt > MEMPOOL_IDLE_AFTER) {
      this.mempool.stop()
      this.pending.clear()
    } else {
      this.pending.expire(this.now())
    }
  }

  /** A new version, if the blocks or what is pending changed, for the pages waiting */
  private publish(blocksChanged: boolean) {
    if (!blocksChanged && this.pending.version === this.pendingVersion) return
    this.pendingVersion = this.pending.version
    this.version = Math.max(this.version + 1, Math.round(this.now() * 1000))
    for (const done of [...this.waiting]) done()
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
      version: this.version,
      head: this.head,
      live: this.failures === 0,
      blocks,
      window: postedWindow(this.blocks, this.head),
      pending: this.pending.list(),
    }
  }
}

const NO_MEMPOOL: MempoolSource = { watch: () => {}, stop: () => {} }

/** A sender's nonce names a batch, as in the mempool */
function isSameBatch(a: LiveBatch, b: LiveBatch) {
  return a.from === b.from && a.nonce === b.nonce
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

function forgetOld(bySlot: Map<number, unknown>, head: number) {
  for (const slot of bySlot.keys()) {
    if (slot <= head - WINDOW_SLOTS) bySlot.delete(slot)
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
