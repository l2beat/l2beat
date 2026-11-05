import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { NotFoundOnRpcError } from '@l2beat/shared'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Clock } from '../../../tools/Clock'

/** One slot, so each update finds about one new block */
const HEAD_REFRESH_MS = 12 * 1000
/**
 * About two hours of blocks. Further behind, the stored counts are catching
 * up and the head would only cost calls
 */
const MAX_HEAD_BLOCKS = 600

export interface HeadBlock {
  number: number
  hash: string
  parentHash: string
  timestamp: UnixTime
  count: number
  uopsCount: number | null
}

export interface HeadBlockSource {
  getLatestBlockNumber(): Promise<number>
  getBlockHash(number: number): Promise<string>
  getBlock(number: number): Promise<HeadBlock>
}

/**
 * Counts the blocks above the last one the stored counts hold, up to the
 * chain's latest, so readers can show activity seconds behind the chain.
 * Those blocks can still be reorged, so they live apart from the stored
 * counts and are rewritten whole on every update. Run one per project: two
 * would overwrite each other's blocks
 */
export class ActivityHeadTracker {
  private blocks: HeadBlock[] = []
  private updating = false

  constructor(
    private readonly $: {
      projectId: ProjectId
      source: HeadBlockSource
      db: Database
    },
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this).tag({ tag: $.projectId })
  }

  start(clock: Clock) {
    clock.every(HEAD_REFRESH_MS, () => void this.updateSafely())
    void this.updateSafely()
  }

  async update(): Promise<void> {
    const counted = await this.getCountedHeight()
    if (counted === undefined) return

    const latest = await this.$.source.getLatestBlockNumber()
    if (latest - counted > MAX_HEAD_BLOCKS) {
      this.blocks = []
      await this.publish()
      return
    }

    this.keepBlocksRunningOnFrom(counted)
    const fetched = await this.fetchBlocks(
      (this.blocks.at(-1)?.number ?? counted) + 1,
      latest,
    )
    if (fetched.length === 0 && !(await this.isNewestStillOnChain())) {
      // The block before it is checked by the parent hash of its replacement
      this.logger.info('Newest block replaced, refetching it', {
        blockNumber: this.blocks.at(-1)?.number,
      })
      this.blocks.pop()
      return
    }
    if (!isChain([...this.blocks.slice(-1), ...fetched])) {
      // A reorg, or nodes behind a load balancer on different forks. The
      // published blocks stay until the next update finds one chain
      this.logger.info('Blocks do not link, refetching', {
        from: this.blocks[0]?.number ?? counted + 1,
        to: latest,
      })
      this.blocks = []
      return
    }
    this.blocks.push(...fetched)
    await this.publish()
  }

  private async updateSafely() {
    // An update that takes longer than a slot must not run twice at once
    if (this.updating) return
    this.updating = true
    try {
      await this.update()
    } catch (error) {
      // Nodes behind a load balancer often lack the newest block for a moment
      if (error instanceof NotFoundOnRpcError) {
        this.logger.info('Head block not found yet', { error })
      } else {
        this.logger.warn('Failed to follow the head', { error })
      }
    } finally {
      this.updating = false
    }
  }

  private async getCountedHeight(): Promise<number | undefined> {
    const record = await this.$.db.syncMetadata.getByFeatureAndId(
      'activity',
      this.$.projectId,
    )
    return record?.blockSyncedUntil ?? undefined
  }

  /**
   * The stored counts move past held blocks as finality advances, and back
   * below them after an invalidation, which would leave a gap
   */
  private keepBlocksRunningOnFrom(counted: number) {
    this.blocks = this.blocks.filter((b) => b.number > counted)
    if (this.blocks[0] && this.blocks[0].number !== counted + 1) {
      this.blocks = []
    }
  }

  /**
   * A reorg can replace the newest block before a block follows it, and
   * only a following block would show it by its parent hash
   */
  private async isNewestStillOnChain(): Promise<boolean> {
    const newest = this.blocks.at(-1)
    if (!newest) return true
    return (await this.$.source.getBlockHash(newest.number)) === newest.hash
  }

  private async fetchBlocks(from: number, to: number): Promise<HeadBlock[]> {
    const numbers: number[] = []
    for (let number = from; number <= to; number++) numbers.push(number)
    return await Promise.all(numbers.map((n) => this.$.source.getBlock(n)))
  }

  private async publish() {
    await this.$.db.activityHeadBlock.replaceForProject(
      this.$.projectId,
      this.blocks,
    )
  }
}

function isChain(blocks: HeadBlock[]): boolean {
  return blocks.every(
    (block, i) => i === 0 || block.parentHash === blocks[i - 1]?.hash,
  )
}
