import type { Logger } from '@l2beat/backend-tools'
import type { Database, LiveActivityBlockRecord } from '@l2beat/database'
import type { EVMBlockWithTransactions } from '@l2beat/shared'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  createIndexerId,
  INDEXER_NAMES,
} from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import {
  getHeadRetryStrategy,
  REMEMBERED_BLOCKS,
} from '../../chain-head/ChainHeadIndexer'
import type { ActivityBlock } from '../services/txs/types'
import { LIVE_BLOCKS_KEPT_FOR } from './LiveActivityCleaner'

export interface ChainBlockSource {
  /** Both ends included, oldest first */
  getBlocks(from: number, to: number): Promise<EVMBlockWithTransactions[]>
}

export interface LiveActivityIndexerDependencies
  extends Omit<
    ManagedChildIndexerOptions,
    'name' | 'minHeight' | 'configHash'
  > {
  projectId: ProjectId
  chain: string
  batchSize: number
  /** Of what the counts depend on: blocks stored under another one are deleted */
  configHash: string
  blocks: ChainBlockSource
  /** Counts a block as the activity indexer does, so a stored block can stand in for fetching it */
  count: (block: EVMBlockWithTransactions) => ActivityBlock
  db: Database
}

type Stored = Pick<LiveActivityBlockRecord, 'number' | 'hash' | 'timestamp'>

/**
 * Stores every block of a project's chain once, counted, as soon as the chain
 * head has it. Its parent is the chain head, so its height is a block number
 * and what it stores is from the chain the head follows
 */
export class LiveActivityIndexer extends ManagedChildIndexer {
  /** The newest block stored, when it is known to be the one below the next update */
  private newest: Stored | undefined

  constructor(
    private readonly $: LiveActivityIndexerDependencies,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.LIVE_ACTIVITY,
        tags: { tag: $.projectId, project: $.projectId },
        minHeight: 0,
        updateRetryStrategy: getHeadRetryStrategy(),
        invalidateRetryStrategy: getHeadRetryStrategy(),
      },
      logger,
    )
  }

  /**
   * Deletes the blocks counted under another config. Must finish before
   * anything reads the stored blocks, which is sooner than the indexer
   * itself gets to invalidate them
   */
  async dropBlocksOfAnotherConfig(): Promise<void> {
    const state = await this.$.db.indexerState.findByIndexerId(
      createIndexerId(INDEXER_NAMES.LIVE_ACTIVITY, this.$.projectId),
    )
    if (state === undefined || state.configHash === this.$.configHash) return

    const deleted = await this.$.db.liveActivityBlock.deleteByProject(
      this.$.projectId,
    )
    this.logger.info('Config changed, deleted stored blocks', { deleted })
  }

  override async update(from: number, to: number): Promise<number> {
    const stored = await this.getStoredBelow(from)
    let start = stored ? from : to
    let blocks = await this.getBatch(start, to)
    if (stored && blocks[0].parentHash !== stored.hash) {
      start = await this.dropBlocksOffTheHead(stored, to)
      blocks = await this.getBatch(start, to)
    }

    // a batch may end below `from` after blocks were dropped: UIF takes no
    // height lower than it asked for, so the update goes on up to there
    let end = await this.store(blocks)
    while (end < from) {
      end = await this.store(await this.getBatch(end + 1, to))
    }
    return end
  }

  private getBatch(start: number, to: number) {
    const end = Math.min(start + this.$.batchSize - 1, to)
    return this.$.blocks.getBlocks(start, end)
  }

  /** Returns the number of the last block stored */
  private async store(blocks: EVMBlockWithTransactions[]): Promise<number> {
    await this.$.db.liveActivityBlock.upsertMany(
      blocks.map((block) => {
        const counted = this.$.count(block)
        return {
          projectId: this.$.projectId,
          number: block.number,
          hash: block.hash,
          parentHash: block.parentHash,
          timestamp: block.timestamp,
          count: counted.txsCount,
          uopsCount: counted.uopsCount,
          gasUsed: block.gasUsed,
        }
      }),
    )
    const last = blocks[blocks.length - 1]
    this.newest = {
      number: last.number,
      hash: last.hash,
      timestamp: last.timestamp,
    }
    return last.number
  }

  /** The chain no longer has the blocks above the height: what replaced them comes with the next update */
  override async invalidate(targetHeight: number): Promise<number> {
    const deleted = await this.$.db.liveActivityBlock.deleteByProjectAfter(
      this.$.projectId,
      targetHeight,
    )
    this.newest = undefined
    if (deleted > 0) {
      this.logger.info('Deleted blocks the chain no longer has', {
        after: targetHeight,
        deleted,
      })
    }
    return targetHeight
  }

  /**
   * The stored block right below `from`, when the stored blocks reach up to
   * there and are worth adding to. They are not on the first run, after a
   * reorg past every block the head remembered, or once they are older than
   * the cleaner keeps them, as after an outage: every block since would be
   * fetched for nobody to read. The update then starts at the newest block
   */
  private async getStoredBelow(from: number): Promise<Stored | undefined> {
    if (this.newest === undefined) {
      const [newest] = await this.$.db.liveActivityBlock.getNewest(
        this.$.projectId,
        1,
      )
      this.newest = newest
    }
    const continues =
      this.newest !== undefined &&
      this.newest.number === from - 1 &&
      this.newest.timestamp >= UnixTime.now() - LIVE_BLOCKS_KEPT_FOR
    return continues ? this.newest : undefined
  }

  /**
   * The next block is not the child of the newest stored one, so stored
   * blocks are from a chain the head left. The head lowers its height for
   * that, but a crash between its dropping the blocks and the children
   * hearing of it loses the notice. Deletes the stored blocks above the
   * newest one the head has too, and returns where to store from: the block
   * after it, or `to` when the head has none of the blocks it would remember
   */
  private async dropBlocksOffTheHead(
    newest: Stored,
    to: number,
  ): Promise<number> {
    const from = newest.number - REMEMBERED_BLOCKS
    const [stored, onHead] = await Promise.all([
      this.$.db.liveActivityBlock.getByProjectNumberRange(
        this.$.projectId,
        from,
        newest.number,
      ),
      this.$.db.chainBlock.getByNumberRange(this.$.chain, from, newest.number),
    ])
    const headHashes = new Map(onHead.map((b) => [b.number, b.hash]))
    const agreed = stored
      .reverse()
      .find((block) => headHashes.get(block.number) === block.hash)

    const deleted = await this.$.db.liveActivityBlock.deleteByProjectAfter(
      this.$.projectId,
      agreed?.number ?? 0,
    )
    this.newest = undefined
    this.logger.warn('Deleted stored blocks the chain head does not have', {
      newest: newest.number,
      agreed: agreed?.number,
      deleted,
    })
    return agreed ? agreed.number + 1 : to
  }
}
