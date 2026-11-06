import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { NotFoundOnRpcError } from '@l2beat/shared'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../../tools/TimeLoop'
import type { ActivityBlock } from '../services/txs/types'
import { LIVE_BLOCKS_KEPT_FOR } from './LiveActivityCleaner'

/** Shorter than most chains take for a few blocks */
const INTERVAL_MS = 10_000
/** Each run in a row that finds no new block waits one more interval, up to a minute */
const MAX_IDLE_SKIPS = 5
/** Stored blocks remembered to find where a reorg forked off */
const REMEMBERED_BLOCKS = 64

/** A counted block with the hashes that place it in the chain */
export interface LinkedBlock extends ActivityBlock {
  hash: string
  parentHash: string
  gasUsed: number
}

export interface BlockFetcher {
  getLatestBlockNumber(): Promise<number>
  /** Both ends included, oldest first */
  getBlocks(from: number, to: number): Promise<LinkedBlock[]>
}

type StoredTip = Pick<LinkedBlock, 'number' | 'hash' | 'timestamp'>

/**
 * Stores every block of a project's chain once, as soon as the RPC has it. A
 * block is stored only as the child of the block stored before it, so the
 * stored blocks stay one chain through reorgs and through nodes that disagree.
 * Only one may run per project, or both would rewrite its blocks
 */
export class HeadFollower extends TimeLoop {
  /** The newest stored blocks, oldest first. Read from the database on the first run */
  private remembered: StoredTip[] | undefined
  private idleRuns = 0
  private skips = 0

  constructor(
    private readonly $: {
      projectId: ProjectId
      batchSize: number
      fetcher: BlockFetcher
      db: Database
    },
    protected logger: Logger,
  ) {
    super({ intervalMs: INTERVAL_MS })
    this.logger = logger
      .for(this)
      .tag({ tag: $.projectId, project: $.projectId })
  }

  async run(): Promise<void> {
    if (this.skips > 0) {
      this.skips--
      return
    }
    try {
      const stored = await this.follow()
      this.idleRuns =
        stored > 0 ? 0 : Math.min(this.idleRuns + 1, MAX_IDLE_SKIPS)
      this.skips = this.idleRuns
    } catch (error) {
      // the RPC named a block its node behind the load balancer has not got yet
      if (!(error instanceof NotFoundOnRpcError)) throw error
      this.logger.info('Latest block not served yet', { error })
    }
  }

  /** Stores the blocks up to the latest one and returns how many it stored */
  async follow(): Promise<number> {
    const latest = await this.$.fetcher.getLatestBlockNumber()
    const remembered = await this.getRemembered()
    let next = (remembered.at(-1)?.number ?? latest - 1) + 1
    let stored = 0

    while (next <= latest) {
      const last = Math.min(next + this.$.batchSize - 1, latest)
      const blocks = await this.$.fetcher.getBlocks(next, last)
      const tip = this.remembered?.at(-1)
      if (tip && blocks[0]?.parentHash !== tip.hash) {
        await this.unwind()
        return stored
      }
      if (!isLinked(blocks)) {
        this.logger.info('Fetched blocks are from different forks', {
          from: next,
          to: last,
        })
        return stored
      }

      await this.$.db.liveActivityBlock.upsertMany(
        blocks.map((block) => ({
          projectId: this.$.projectId,
          number: block.number,
          hash: block.hash,
          parentHash: block.parentHash,
          timestamp: block.timestamp,
          count: block.txsCount,
          uopsCount: block.uopsCount,
          gasUsed: block.gasUsed,
        })),
      )
      this.remembered = [...(this.remembered ?? []), ...blocks].slice(
        -REMEMBERED_BLOCKS,
      )
      stored += blocks.length
      next = last + 1
    }
    return stored
  }

  /**
   * Picks up from the stored blocks, unless they are older than the cleaner
   * keeps them: every block since would be fetched for nobody to read
   */
  private async getRemembered(): Promise<StoredTip[]> {
    if (this.remembered === undefined) {
      const stored = await this.$.db.liveActivityBlock.getNewest(
        this.$.projectId,
        REMEMBERED_BLOCKS,
      )
      const newest = stored.at(-1)
      const fresh =
        newest !== undefined &&
        newest.timestamp >= UnixTime.now() - LIVE_BLOCKS_KEPT_FOR
      this.remembered = fresh ? stored : []
    }
    return this.remembered
  }

  /**
   * The next block is not the child of the stored tip. Forgets and deletes
   * the stored blocks the chain no longer has, newest first, so that the next
   * run fetches what replaced them
   */
  private async unwind() {
    const remembered = [...(this.remembered ?? [])]
    let forkedAt: StoredTip | undefined
    while (remembered.length > 0 && forkedAt === undefined) {
      const tip = remembered[remembered.length - 1]
      const [current] = await this.$.fetcher.getBlocks(tip.number, tip.number)
      if (current?.hash === tip.hash) forkedAt = tip
      else remembered.pop()
    }
    const replaced = (this.remembered?.length ?? 0) - remembered.length

    // forgotten only once deleted, so a failed delete is tried again next run
    if (forkedAt === undefined) {
      await this.$.db.liveActivityBlock.deleteByProject(this.$.projectId)
      this.logger.warn('Reorg deeper than the remembered blocks, restarting', {
        replaced,
      })
    } else if (replaced > 0) {
      await this.$.db.liveActivityBlock.deleteByProjectAfter(
        this.$.projectId,
        forkedAt.number,
      )
      this.logger.info('Deleted reorged blocks', {
        after: forkedAt.number,
        replaced,
      })
    } else {
      // the stored tip is still on the chain: the child came from another fork
      this.logger.info('Next block is from a different fork', {
        tip: forkedAt.number,
      })
    }
    this.remembered = remembered
  }
}

function isLinked(blocks: LinkedBlock[]): boolean {
  for (let i = 1; i < blocks.length; i++) {
    if (blocks[i].parentHash !== blocks[i - 1].hash) return false
  }
  return true
}
