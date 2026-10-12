import type { Logger } from '@l2beat/backend-tools'
import type { EthereumDaTrackingConfig } from '@l2beat/config'
import type {
  Database,
  LiveBlobBatchRecord,
  LiveBlockRecord,
} from '@l2beat/database'
import type { EthereumBlobBlock, EthereumDaProvider } from '@l2beat/shared'
import {
  assert,
  type ProjectId,
  slotAt,
  type UnixTime,
} from '@l2beat/shared-pure'
import { withCoreFeatureRpcMetricsContext } from '../../../../tools/coreFeatureRpcMetrics'
import { INDEXER_NAMES } from '../../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../tools/uif/ManagedChildIndexer'
import { matchEthereumConfigs } from '../../services/matchEthereumConfigs'
import {
  getLiveRetryStrategy,
  LIVE_METRICS_CONTEXT,
  liveWindowStart,
  nowSeconds,
  secondsSince,
} from './liveBlobs'

/** Blocks whose stored batches are read at once, to keep a window's worth out of memory */
const BLOCKS_PER_READ = 1000

export type LiveBlobsConfig = EthereumDaTrackingConfig & {
  projectId: ProjectId
}

export interface LiveBlobsIndexerDependencies
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  daProvider: EthereumDaProvider
  /** Every Ethereum config, past ones included: each block is told by the ones in force at it */
  configurations: LiveBlobsConfig[]
  batchSize: number
  /** Unix seconds */
  now?: () => number
}

/**
 * Keeps the Ethereum blocks of the last day or so and their blob batches,
 * attributed to projects, for the live blobs view. Writes blocks without
 * gaps, so a slot with no block between the oldest and the newest was missed.
 * Initializes without the network: an initialization that fails is never
 * retried, so the window is cut and the stale blocks dropped in `update`
 */
export class LiveBlobsIndexer extends ManagedChildIndexer {
  private storedReattributed = false

  constructor(
    private readonly $: LiveBlobsIndexerDependencies,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.LIVE_BLOBS,
        tags: { tag: 'ethereum' },
        updateRetryStrategy: getLiveRetryStrategy(),
      },
      logger,
    )
  }

  /**
   * Blocks older than the window are of no use, and fetching them on the way
   * to the head would leave the view showing a day-old chain meanwhile: the
   * batch starts at the window when `from` is older
   */
  override async update(from: number, to: number): Promise<number> {
    return await withCoreFeatureRpcMetricsContext(
      LIVE_METRICS_CONTEXT,
      { daLayer: 'ethereum' },
      async () => {
        if (!this.storedReattributed) {
          await this.reattributeStored(to)
          this.storedReattributed = true
        }

        const windowStart = liveWindowStart(to)
        const start = Math.max(from, windowStart)
        const end = Math.min(start + this.$.batchSize - 1, to)

        const blocks =
          await this.$.daProvider.getBlocksWithBlobBatchesFromReceipts(
            start,
            end,
          )
        await this.assertBuildsOnStored(start, blocks)
        const liveBlocks = blocks.map(toLiveBlock)
        const liveBatches = blocks.flatMap((b) => this.toLiveBatches(b))

        await this.$.db.transaction(async () => {
          // Rows above the safe height may be from a chain since reorganized:
          // upserting by slot would leave the ones no fetched block lands on
          await this.$.db.liveBlock.deleteAfterBlock(start - 1)
          await this.$.db.liveBlobBatch.deleteAfterBlock(start - 1)
          await this.$.db.liveBlock.upsertMany(liveBlocks)
          await this.$.db.liveBlobBatch.upsertMany(liveBatches)
          await this.$.db.liveBlock.deleteBeforeBlock(windowStart)
          await this.$.db.liveBlobBatch.deleteBeforeBlock(windowStart)
        })
        this.logStored(start, end, blocks.at(-1)?.timestamp)

        return end
      },
    )
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await this.$.db.transaction(async () => {
      await this.$.db.liveBlock.deleteAfterBlock(targetHeight)
      await this.$.db.liveBlobBatch.deleteAfterBlock(targetHeight)
    })
    return targetHeight
  }

  /**
   * Keeps an orphaned block out of the table for good. A load-balanced RPC can
   * serve one batch from nodes on both sides of a reorg: the retried update
   * fetches it again. A batch that does not build on the newest stored block
   * keeps failing until the target finds the fork there
   */
  private async assertBuildsOnStored(
    start: number,
    blocks: EthereumBlobBlock[],
  ) {
    const parent = await this.$.db.liveBlock.findByBlockNumber(start - 1)
    let parentHash = parent?.hash
    for (const block of blocks) {
      assert(
        parentHash === undefined || block.parentHash === parentHash,
        `Block ${block.number} does not build on the block before it`,
      )
      parentHash = block.hash
    }
  }

  /**
   * A batch is attributed as it is stored, so after a deploy that changed the
   * configs the stored ones are reattributed in place. Fetching the window
   * again instead would leave the view a day behind the chain until it
   * reached the head
   */
  private async reattributeStored(head: number) {
    const changed: LiveBlobBatchRecord[] = []
    for (
      let from = liveWindowStart(head);
      from <= head;
      from += BLOCKS_PER_READ
    ) {
      const stored = await this.$.db.liveBlobBatch.getByBlockNumberRange(
        from,
        Math.min(from + BLOCKS_PER_READ - 1, head),
      )
      for (const batch of stored) {
        const projectId = this.attribute(batch.blockNumber, batch)
        if (projectId !== batch.projectId) {
          changed.push({ ...batch, projectId })
        }
      }
    }
    if (changed.length > 0) {
      await this.$.db.liveBlobBatch.upsertMany(changed)
    }
    this.logger.info('Reattributed stored batches', { changed: changed.length })
  }

  /** The view can show a block no sooner than it is stored */
  private logStored(from: number, to: number, newest: UnixTime | undefined) {
    const now = (this.$.now ?? nowSeconds)()
    this.logger.info('Stored live blocks', {
      from,
      to,
      delaySeconds: newest && secondsSince(newest, now),
    })
  }

  private toLiveBatches(block: EthereumBlobBlock): LiveBlobBatchRecord[] {
    return block.batches.map((batch) => ({
      slot: slotAt(block.timestamp),
      txIndex: batch.txIndex,
      txHash: batch.txHash,
      blockNumber: block.number,
      from: batch.from,
      to: batch.to,
      blobs: batch.blobs,
      topics: batch.topics,
      projectId: this.attribute(block.number, batch),
    }))
  }

  private attribute(
    blockNumber: number,
    batch: Pick<LiveBlobBatchRecord, 'from' | 'to' | 'topics'>,
  ): ProjectId | undefined {
    const configs = matchEthereumConfigs(this.$.configurations, blockNumber, {
      inbox: batch.to,
      sequencer: batch.from,
      topics: batch.topics,
    })
    return closestMatch(configs, batch.from)?.projectId
  }
}

/**
 * A config naming the sender is a closer match than an inbox open to anyone,
 * whichever comes first: on a shared inbox both claim the batch
 */
function closestMatch(configs: LiveBlobsConfig[], sender: string) {
  return (
    configs.find((c) =>
      c.sequencers?.some((s) => s.toLowerCase() === sender.toLowerCase()),
    ) ?? configs[0]
  )
}

function toLiveBlock(block: EthereumBlobBlock): LiveBlockRecord {
  return {
    slot: slotAt(block.timestamp),
    blockNumber: block.number,
    hash: block.hash,
    timestamp: block.timestamp,
    blobCount: block.batches.reduce((sum, b) => sum + b.blobs, 0),
  }
}
