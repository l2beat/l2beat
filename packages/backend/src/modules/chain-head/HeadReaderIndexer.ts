import type { Logger } from '@l2beat/backend-tools'
import type {
  ChainBlockRecord,
  ChainHeadCursorRecord,
  Database,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { createIndexerId } from '../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../tools/uif/ManagedChildIndexer'
import type { ChainHeadIndexer } from './ChainHeadIndexer'

const CLEAN_EVERY = 10 * UnixTime.MINUTE
/** Reorgs this deep keep the rows below them. A deeper one starts over */
const READ_HASHES_KEPT = 256

export interface HeadReaderIndexerOptions
  extends Omit<
    ManagedChildIndexerOptions,
    'parents' | 'minHeight' | 'updateRetryStrategy' | 'invalidateRetryStrategy'
  > {
  chain: string
  head: ChainHeadIndexer
  /** Blocks read in one update */
  batchSize: number
  /** Seconds. What was derived from older blocks is deleted */
  keepFor: number
  db: Database
}

/**
 * An indexer that derives rows from a chain's newest blocks, for one chain
 * and one height. It keeps the rows of the last `keepFor` seconds, and they
 * are always from the chain the head follows: its cursor names the block it
 * stopped at, and whatever it derived is deleted and derived again once the
 * head no longer has that block.
 *
 * The cursor is the promise to whoever reads the rows: everything from block
 * `sinceNumber` up to block `number` is there. Rows and cursor change in one
 * transaction, so a reader that takes both in one snapshot never sees more
 * promised than stored.
 *
 * Not for an indexer with several configurations of different heights. Those
 * stay under the clock, and one of these adds the newest blocks on top
 */
export abstract class HeadReaderIndexer extends ManagedChildIndexer {
  private readonly cursorId: string
  /**
   * The hashes of the newest blocks read, by number. After a reorg they
   * prove that the rows kept are of the blocks the head has: the head's block
   * at a height may have been replaced once more by the time it is looked at
   */
  private readonly readHashes = new Map<number, string>()
  /** The head's read epoch as of the last update: it starts at 0 with the process, as the head's does */
  private epoch = 0
  private cleanedAt = 0

  constructor(
    private readonly reader: HeadReaderIndexerOptions,
    logger: Logger,
  ) {
    super(
      {
        ...reader,
        parents: [reader.head],
        minHeight: 0,
        updateRetryStrategy: Indexer.getLiveRetryStrategy(),
        invalidateRetryStrategy: Indexer.getLiveRetryStrategy(),
        // starting over from the blocks the head has can end below the height
        updateMayInvalidate: true,
      },
      logger,
    )
    this.cursorId = createIndexerId(reader.name, reader.tags?.tag)
  }

  /**
   * Derives the rows of the blocks, which are in a row, oldest first, and as
   * the head has stored them. Whatever is read of a block is to be read
   * under the hash given here: these are the blocks checked against the head
   * when the rows are saved. Returns what saves the rows; it runs in a
   * transaction, after the rows of these blocks and above were deleted
   */
  protected abstract read(
    blocks: ChainBlockRecord[],
  ): Promise<() => Promise<void>>
  /** Deletes what was derived from the blocks above the number */
  protected abstract deleteAfter(number: number): Promise<number>
  /** Deletes what was derived from the blocks older than the timestamp */
  protected abstract deleteBefore(timestamp: UnixTime): Promise<number>

  override async update(from: number, to: number): Promise<number> {
    await this.clean()

    const cursor = await this.getCursor()
    const epoch = this.reader.head.readEpoch
    const continues =
      cursor !== undefined &&
      // what was read before may have gaps
      epoch === this.epoch &&
      // behind the height only if the cursor was written by something else
      cursor.number >= from - 1 &&
      cursor.timestamp >= this.oldestKept() &&
      (await this.isOnHead(cursor))
    // Otherwise it is the first run, the rows are too old to add to, or the
    // head left the block the indexer stopped at without lowering its
    // height: it restarted, or the process died between the head dropping
    // blocks and this indexer hearing of it. Nothing tells which rows are
    // still right, so all are derived again from the blocks the head has now
    const start = continues ? from : await this.findOldestKept()
    // a chain with no block fresh enough to keep
    if (start === undefined || start > to) {
      await this.forget()
      return to
    }

    let end = Math.min(start + this.reader.batchSize - 1, to)
    // UIF takes the height right below the update's for neither syncing
    // nor invalidating
    if (end === from - 1) end = from
    const blocks = await this.reader.db.chainBlock.getByNumberRange(
      this.reader.chain,
      start,
      end,
    )
    if (blocks.length !== end - start + 1) {
      throw new Error('Blocks to read are not stored by the chain head', {
        cause: { chain: this.reader.chain, start, end, stored: blocks.length },
      })
    }

    const save = await this.read(blocks)
    if (this.reader.head.readEpoch !== epoch) {
      // Read again, by the next update, as what the head now knows to do.
      // The rows go at once: kept, they would pass for complete after a
      // restart, when the head no longer remembers what proved wrong
      await this.forget()
      throw new Error('What the head told of the blocks proved wrong', {
        cause: { chain: this.reader.chain, start, end },
      })
    }
    const first = blocks[0]
    const last = blocks[blocks.length - 1]
    await this.reader.db.transaction(async () => {
      // The head may have left the blocks while they were read, or the block
      // these are added to before they were fetched. It would say so, and the
      // rows be deleted, but until then they would be promised
      const added = !continues || (await this.isOnHead(cursor))
      if (!added || !(await this.isOnHead(last))) {
        throw new Error('Blocks were replaced while they were read', {
          cause: { chain: this.reader.chain, start, end },
        })
      }
      await this.deleteAfter(continues ? start - 1 : -1)
      await save()
      await this.reader.db.chainHeadCursor.upsert({
        indexerId: this.cursorId,
        chain: this.reader.chain,
        sinceNumber: continues ? cursor.sinceNumber : first.number,
        sinceTimestamp: continues ? cursor.sinceTimestamp : first.timestamp,
        startedAt: continues ? cursor.startedAt : UnixTime.now(),
        number: last.number,
        hash: last.hash,
        timestamp: last.timestamp,
      })
    })
    if (!continues) {
      this.logger.info('Started over from the blocks the chain head has', {
        start,
        previous: cursor?.number,
      })
    }
    this.epoch = epoch
    if (!continues) this.readHashes.clear()
    for (const block of blocks) this.readHashes.set(block.number, block.hash)
    for (const number of this.readHashes.keys()) {
      if (this.readHashes.size <= READ_HASHES_KEPT) break
      this.readHashes.delete(number)
    }
    return end
  }

  /**
   * The chain no longer has the blocks above the height. UIF also calls this
   * with the indexer's own height at every start and after a failed update,
   * when there is nothing to delete
   */
  override async invalidate(targetHeight: number): Promise<number> {
    // In one snapshot: the block at the height and the block the indexer
    // stopped at have to be of the head as it was at one moment, or rows of
    // one fork could be kept under a block of another
    return await this.reader.db.snapshot(() => this.rollBack(targetHeight))
  }

  private async rollBack(targetHeight: number): Promise<number> {
    const cursor = await this.getCursor()
    if (cursor === undefined || cursor.number <= targetHeight) {
      return targetHeight
    }

    const [block] = await this.reader.db.chainBlock.getByNumberRange(
      this.reader.chain,
      targetHeight,
      targetHeight,
    )
    // The rows up to the height stay only when the head's block there is
    // the one they were read under, or the head still has the block the
    // indexer stopped at and so every block before it. Otherwise nothing
    // tells which rows are right: the height may be from before the process
    // started, or the block there was replaced again since the head said so
    const sameChain =
      block !== undefined &&
      (this.readHashes.get(targetHeight) === block.hash ||
        (await this.isOnHead(cursor)))
    if (
      !sameChain ||
      block === undefined ||
      block.number < cursor.sinceNumber
    ) {
      await this.forget()
      return targetHeight
    }

    const deleted = await this.reader.db.transaction(async () => {
      const deleted = await this.deleteAfter(targetHeight)
      await this.reader.db.chainHeadCursor.upsert({
        ...cursor,
        number: block.number,
        hash: block.hash,
        timestamp: block.timestamp,
      })
      return deleted
    })
    for (const number of this.readHashes.keys()) {
      if (number > targetHeight) this.readHashes.delete(number)
    }
    this.logger.info('Deleted what the chain no longer has', {
      after: targetHeight,
      deleted,
    })
    return targetHeight
  }

  private getCursor(): Promise<ChainHeadCursorRecord | undefined> {
    return this.reader.db.chainHeadCursor.findByIndexerId(this.cursorId)
  }

  /** Whether the head has stored this very block, so that it can serve the ones after it */
  private async isOnHead(
    block: Pick<ChainBlockRecord, 'number' | 'hash'>,
  ): Promise<boolean> {
    const [onHead] = await this.reader.db.chainBlock.getByNumberRange(
      this.reader.chain,
      block.number,
      block.number,
    )
    return onHead?.hash === block.hash
  }

  private oldestKept(): UnixTime {
    return UnixTime.now() - this.reader.keepFor
  }

  /** The oldest block worth reading that the head has. None on a chain with no block that fresh */
  private async findOldestKept(): Promise<number | undefined> {
    const oldest = await this.reader.db.chainBlock.findOldestSince(
      this.reader.chain,
      this.oldestKept(),
    )
    return oldest?.number
  }

  private async forget() {
    this.readHashes.clear()
    const deleted = await this.reader.db.transaction(async () => {
      await this.reader.db.chainHeadCursor.deleteByIndexerIds([this.cursorId])
      return await this.deleteAfter(-1)
    })
    if (deleted > 0) {
      this.logger.info('Deleted everything, to start over', { deleted })
    }
  }

  /**
   * Deletes what is older than is kept, and moves the cursor's start up to
   * the oldest block still covered, so that it never promises deleted rows
   */
  private async clean() {
    const now = UnixTime.now()
    if (now - this.cleanedAt < CLEAN_EVERY) return

    const oldestKept = this.oldestKept()
    const [cursor, oldest] = await Promise.all([
      this.getCursor(),
      this.reader.db.chainBlock.findOldestSince(this.reader.chain, oldestKept),
    ])
    const deleted = await this.reader.db.transaction(async () => {
      if (cursor !== undefined && cursor.sinceTimestamp < oldestKept) {
        if (oldest !== undefined && oldest.number <= cursor.number) {
          await this.reader.db.chainHeadCursor.upsert({
            ...cursor,
            sinceNumber: oldest.number,
            sinceTimestamp: oldest.timestamp,
          })
        } else {
          // nothing it covers is kept
          await this.reader.db.chainHeadCursor.deleteByIndexerIds([
            this.cursorId,
          ])
        }
      }
      return await this.deleteBefore(oldestKept)
    })
    this.cleanedAt = now
    this.logger.info('Deleted what is older than kept', { deleted })
  }
}
