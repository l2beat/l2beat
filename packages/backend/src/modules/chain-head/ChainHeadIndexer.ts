import type { Logger } from '@l2beat/backend-tools'
import type { ChainBlockRecord, Database } from '@l2beat/database'
import {
  type EVMBlockWithTransactions,
  NotFoundOnRpcError,
} from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Retries, RootIndexer } from '@l2beat/uif'
import range from 'lodash/range'
import { withCoreFeatureRpcMetricsContext } from '../../tools/coreFeatureRpcMetrics'

/** Shorter than most chains take for a few blocks */
const INTERVAL_MS = 10_000
/** Each tick in a row that stores no block waits one more interval, up to a minute */
const MAX_IDLE_TICKS = 5
/** Stored blocks remembered to find where a reorg forked off */
export const REMEMBERED_BLOCKS = 64
/** How long a failing source is left alone at most before it is asked again */
const MAX_RETRY_MS = 60_000
const CLEAN_EVERY = 10 * UnixTime.MINUTE

/** Where a chain's newest blocks come from */
export interface HeadSource {
  /**
   * The newest block the source serves in full. Never a `latest` read
   * through the RPC proxy: it caches that answer until its own index moves
   */
  getLatestBlockNumber(): Promise<number>
  /** Both ends included, oldest first */
  getBlocks(from: number, to: number): Promise<EVMBlockWithTransactions[]>
  getBlockHash(number: number): Promise<string>
}

export interface ChainHeadIndexerDependencies {
  chain: string
  source: HeadSource
  db: Database
  batchSize: number
  /** Seconds */
  keepFor: number
}

type Remembered = Pick<ChainBlockRecord, 'number' | 'hash' | 'timestamp'>

interface Followed {
  height: number
  stored: number
  /** More blocks are waiting, or blocks were dropped: tick again at once */
  again: boolean
}

/**
 * Follows one chain's head for everything that reads blocks this fresh. Its
 * height is the newest block it stored. Each block is stored only as the
 * child of the one stored before it, so the stored blocks stay one chain
 * through reorgs and through nodes that disagree.
 *
 * When the chain moves off the stored blocks, the height drops to the newest
 * one still on it, and the children are invalidated down to there. A child
 * has to delete what it derived above the height it is invalidated to. When
 * no remembered block is on the chain, the height drops to 0.
 *
 * After an outage longer than the blocks are kept, the head picks up at the
 * latest block. A child's `update(from, to)` then spans blocks the head never
 * stored and cannot serve, so the child has to pick up at `to` as well.
 *
 * Only one may run per chain, or both would rewrite its blocks
 */
export class ChainHeadIndexer extends RootIndexer {
  /** The newest stored blocks, oldest first. Read from the database on the first tick */
  private remembered: Remembered[] | undefined
  /** The newest stored blocks in full, for the children that read them next */
  private readonly fetched = new Map<number, EVMBlockWithTransactions>()
  private idleTicks = 0
  private cleanedAt = 0
  private timer: ReturnType<typeof setTimeout> | undefined
  private keepFor: number

  constructor(
    private readonly $: ChainHeadIndexerDependencies,
    logger: Logger,
  ) {
    super(logger.tag({ tag: $.chain, chain: $.chain }), {
      tickRetryStrategy: getHeadRetryStrategy(),
    })
    this.keepFor = $.keepFor
  }

  /** Blocks are kept for as long as the reader that looks furthest back needs, in seconds */
  keepAtLeast(seconds: number) {
    this.keepFor = Math.max(this.keepFor, seconds)
  }

  override initialize() {
    this.requestTick()
    return Promise.resolve(undefined)
  }

  async tick(): Promise<number> {
    return await withCoreFeatureRpcMetricsContext(
      'chainHead',
      { chain: this.$.chain, mode: 'head' },
      async () => {
        // before the blocks are followed: a failure after a reorg was unwound
        // would keep the lowered height from the children
        await this.clean()
        const followed = await this.follow()

        this.idleTicks =
          followed.stored > 0 ? 0 : Math.min(this.idleTicks + 1, MAX_IDLE_TICKS)
        this.scheduleTick(
          followed.again ? 0 : INTERVAL_MS * (this.idleTicks + 1),
        )
        return followed.height
      },
    )
  }

  /** Stores the next batch of blocks up to the latest one */
  async follow(): Promise<Followed> {
    const latest = await this.$.source.getLatestBlockNumber()
    const remembered = await this.getRemembered(latest)
    const tip = remembered.at(-1)

    if (tip === undefined) {
      const [block] = await this.$.source.getBlocks(latest, latest)
      assert(block, 'Latest block missing from the response')
      await this.store([block])
      return { height: block.number, stored: 1, again: false }
    }
    // also a node behind the load balancer answering for an older head
    if (latest <= tip.number) {
      return { height: tip.number, stored: 0, again: false }
    }

    const from = tip.number + 1
    const to = Math.min(from + this.$.batchSize - 1, latest)
    let blocks: EVMBlockWithTransactions[]
    try {
      blocks = await this.$.source.getBlocks(from, to)
    } catch (error) {
      // the source named a block its node behind the load balancer has not got yet
      if (!(error instanceof NotFoundOnRpcError)) throw error
      this.logger.info('Latest block not served yet', { error })
      return { height: tip.number, stored: 0, again: false }
    }
    assert(blocks.length === to - from + 1, 'Blocks missing from the response')

    if (blocks[0].parentHash !== tip.hash) {
      return await this.unwind(remembered)
    }
    if (!isLinked(blocks)) {
      this.logger.info('Fetched blocks are from different forks', { from, to })
      return { height: tip.number, stored: 0, again: false }
    }

    await this.store(blocks)
    return { height: to, stored: blocks.length, again: to < latest }
  }

  /**
   * The chain's blocks, both ends included, oldest first. Only blocks the
   * head has stored can be read, and each comes back as the stored one or
   * not at all, so what a child derives from them is derived from the chain
   * the head follows. A block a node served from another fork would
   * otherwise reach the child unnoticed
   */
  async getBlocks(
    from: number,
    to: number,
  ): Promise<EVMBlockWithTransactions[]> {
    const numbers = range(from, to + 1)
    const fetched = numbers.map((number) => this.fetched.get(number))
    if (fetched.every((block) => block !== undefined)) return fetched

    const [blocks, stored] = await Promise.all([
      withCoreFeatureRpcMetricsContext(
        'chainHead',
        { chain: this.$.chain, mode: 'read' },
        () => this.$.source.getBlocks(from, to),
      ),
      this.$.db.chainBlock.getByNumberRange(this.$.chain, from, to),
    ])
    const storedHashes = new Map(stored.map((b) => [b.number, b.hash]))
    for (const block of blocks) {
      if (storedHashes.get(block.number) !== block.hash) {
        throw new Error('Source served a block the chain head has not stored', {
          cause: {
            chain: this.$.chain,
            number: block.number,
            stored: storedHashes.get(block.number) ?? null,
          },
        })
      }
    }
    return blocks
  }

  private async store(blocks: EVMBlockWithTransactions[]) {
    await this.$.db.chainBlock.upsertMany(
      blocks.map((block) => ({
        chain: this.$.chain,
        number: block.number,
        hash: block.hash,
        parentHash: block.parentHash,
        timestamp: block.timestamp,
      })),
    )
    this.remembered = [
      ...(this.remembered ?? []),
      ...blocks.map(({ number, hash, timestamp }) => ({
        number,
        hash,
        timestamp,
      })),
    ].slice(-REMEMBERED_BLOCKS)
    for (const block of blocks) this.fetched.set(block.number, block)
    const kept = Math.max(2 * this.$.batchSize, REMEMBERED_BLOCKS)
    for (const number of this.fetched.keys()) {
      if (this.fetched.size <= kept) break
      this.fetched.delete(number)
    }
  }

  /**
   * Picks up from the remembered blocks, unless they are older than blocks
   * are kept and the chain has moved on, as after an outage: every block
   * since would be fetched for nobody to read
   */
  private async getRemembered(latest: number): Promise<Remembered[]> {
    if (this.remembered === undefined) {
      this.remembered = await this.$.db.chainBlock.getNewest(
        this.$.chain,
        REMEMBERED_BLOCKS,
      )
    }
    const tip = this.remembered.at(-1)
    if (
      tip !== undefined &&
      latest > tip.number &&
      tip.timestamp < UnixTime.now() - this.keepFor
    ) {
      // deleted before they are forgotten, so a failed delete is tried again
      await this.$.db.chainBlock.deleteByChain(this.$.chain)
      this.logger.info('Stored blocks too old to pick up from, restarting', {
        tip: tip.number,
        latest,
      })
      this.forget([])
    }
    return this.remembered
  }

  /**
   * The next block is not the child of the stored tip. Forgets and deletes
   * the stored blocks the chain no longer has, newest first, so that the next
   * tick fetches what replaced them
   */
  private async unwind(stored: Remembered[]): Promise<Followed> {
    const remembered = [...stored]
    let forkedAt: Remembered | undefined
    while (remembered.length > 0 && forkedAt === undefined) {
      const tip = remembered[remembered.length - 1]
      const hash = await this.$.source.getBlockHash(tip.number)
      if (hash === tip.hash) forkedAt = tip
      else remembered.pop()
    }
    const replaced = stored.length - remembered.length

    // forgotten only once deleted, so a failed delete is tried again next tick
    if (forkedAt === undefined) {
      await this.$.db.chainBlock.deleteByChain(this.$.chain)
      this.logger.warn('Reorg deeper than the remembered blocks, restarting', {
        replaced,
      })
      this.forget([])
      return { height: 0, stored: 0, again: true }
    }
    if (replaced === 0) {
      // the stored tip is still on the chain: the child came from another fork
      this.logger.info('Next block is from a different fork', {
        tip: forkedAt.number,
      })
      return { height: forkedAt.number, stored: 0, again: false }
    }

    await this.$.db.chainBlock.deleteAfter(this.$.chain, forkedAt.number)
    this.logger.info('Deleted reorged blocks', {
      after: forkedAt.number,
      replaced,
    })
    this.forget(remembered)
    return { height: forkedAt.number, stored: 0, again: true }
  }

  private forget(remembered: Remembered[]) {
    this.remembered = remembered
    const tip = remembered.at(-1)?.number ?? -1
    for (const number of this.fetched.keys()) {
      if (number > tip) this.fetched.delete(number)
    }
  }

  private async clean() {
    const now = UnixTime.now()
    if (now - this.cleanedAt < CLEAN_EVERY) return
    const deleted = await this.$.db.chainBlock.deleteBefore(
      this.$.chain,
      now - this.keepFor,
    )
    this.cleanedAt = now
    this.logger.info('Deleted old blocks', { deleted })
  }

  private scheduleTick(ms: number) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.requestTick(), ms)
  }
}

/**
 * Retries without end, as the hourly indexers do, but never waiting longer
 * than a minute: what is read at the head is only worth anything while it
 * keeps up
 */
export function getHeadRetryStrategy() {
  return Retries.exponentialBackOff({
    initialTimeoutMs: 1000,
    maxAttempts: Number.POSITIVE_INFINITY,
    maxTimeoutMs: MAX_RETRY_MS,
  })
}

function isLinked(blocks: EVMBlockWithTransactions[]): boolean {
  for (let i = 1; i < blocks.length; i++) {
    if (blocks[i].parentHash !== blocks[i - 1].hash) return false
  }
  return true
}
