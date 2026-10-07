import type { Logger } from '@l2beat/backend-tools'
import type { EthereumDaTrackingConfig } from '@l2beat/config'
import type {
  Database,
  LiveBlobBatchRecord,
  LiveBlockRecord,
} from '@l2beat/database'
import type {
  EthereumBlobBlock,
  EthereumDaProvider,
  IRpcClient,
} from '@l2beat/shared'
import { assert, type ProjectId, slotAt, UnixTime } from '@l2beat/shared-pure'
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
  secondsSince,
} from './liveBlobs'

export type LiveBlobsConfig = EthereumDaTrackingConfig & {
  projectId: ProjectId
}

export interface LiveBlobsIndexerDependencies
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  daProvider: EthereumDaProvider
  rpc: IRpcClient
  /** Every Ethereum config, past ones included: each block is told by the ones in force at it */
  configurations: LiveBlobsConfig[]
  batchSize: number
  /** Unix seconds */
  now?: () => number
}

/**
 * Keeps the Ethereum blocks of the last day or so and their blob batches,
 * attributed to projects, for the live blobs view. Writes blocks without
 * gaps, so a slot with no block between the oldest and the newest was missed
 */
export class LiveBlobsIndexer extends ManagedChildIndexer {
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
   * to the head would leave the view showing a day-old chain meanwhile
   */
  override async initialize() {
    const state = await super.initialize()
    const windowStart = liveWindowStart(await this.$.rpc.getLatestBlockNumber())
    if (state.safeHeight >= windowStart - 1) return state

    await this.$.db.transaction(async () => {
      await this.$.db.liveBlock.deleteAll()
      await this.$.db.liveBlobBatch.deleteAll()
    })
    this.logger.info('Stored blocks older than the window, starting over', {
      safeHeight: state.safeHeight,
      windowStart,
    })
    return { ...state, safeHeight: windowStart - 1 }
  }

  override async update(from: number, to: number): Promise<number> {
    return await withCoreFeatureRpcMetricsContext(
      LIVE_METRICS_CONTEXT,
      { daLayer: 'ethereum' },
      async () => {
        const windowStart = liveWindowStart(to)
        const start = Math.max(from, windowStart)
        const end = Math.min(start + this.$.batchSize - 1, to)

        const blocks = await this.$.daProvider.getBlocksWithBlobBatches(
          start,
          end,
        )
        await this.assertBuildsOnStored(start, blocks)
        const liveBlocks = blocks.map(toLiveBlock)
        const liveBatches = blocks.flatMap((b) => this.toLiveBatches(b))

        await this.$.db.transaction(async () => {
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
    const [parent] = await this.$.db.liveBlock.getByBlockNumberRange(
      start - 1,
      start - 1,
    )
    let parentHash = parent?.hash
    for (const block of blocks) {
      assert(
        parentHash === undefined || block.parentHash === parentHash,
        `Block ${block.number} does not build on the block before it`,
      )
      parentHash = block.hash
    }
  }

  /** The view can show a block no sooner than it is stored */
  private logStored(from: number, to: number, newest: UnixTime | undefined) {
    const now = (this.$.now ?? UnixTime.now)()
    this.logger.info('Stored live blocks', {
      from,
      to,
      delaySeconds: newest && secondsSince(newest, now),
    })
  }

  private toLiveBatches(block: EthereumBlobBlock): LiveBlobBatchRecord[] {
    return block.batches.map((batch) => {
      const config = closestMatch(
        matchEthereumConfigs(this.$.configurations, block.number, {
          inbox: batch.to,
          sequencer: batch.from,
          topics: batch.topics,
        }),
        batch.from,
      )
      return {
        slot: slotAt(block.timestamp),
        txIndex: batch.txIndex,
        txHash: batch.txHash,
        blockNumber: block.number,
        from: batch.from,
        to: batch.to,
        blobs: batch.blobs,
        projectId: config?.projectId,
      }
    })
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
