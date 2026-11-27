import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { EthereumDaProvider } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { withCoreFeatureRpcMetricsContext } from '../../../tools/coreFeatureRpcMetrics'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'

export interface BlobFeeIndexerDependencies
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  provider: Pick<EthereumDaProvider, 'getBlobFees'>
  /** Blocks fetched at once */
  batchSize: number
}

/**
 * Keeps the blob base fee of every Ethereum block, and its hourly aggregates
 * for charts. Follows the same target as the blob indexer, and no other
 * indexer waits for it: a block's fee is read from here only for charts
 */
export class BlobFeeIndexer extends ManagedChildIndexer {
  constructor(
    private readonly $: BlobFeeIndexerDependencies,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.BLOB_FEE,
        tags: { tag: 'ethereum' },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async update(from: number, to: number): Promise<number> {
    return await withCoreFeatureRpcMetricsContext(
      'dataAvailability.blobFee',
      { daLayer: 'ethereum' },
      async () => {
        const end = Math.min(from + this.$.batchSize - 1, to)
        const fees = await this.$.provider.getBlobFees(from, end)
        const first = fees[0]
        assert(first, 'No fees for the range', { from, to: end })

        await this.$.db.transaction(async () => {
          await this.$.db.blobFee.upsertMany(fees)
          await this.$.db.blobFeeHourly.recomputeFrom(
            UnixTime.toStartOf(first.timestamp, 'hour'),
          )
        })
        this.logger.info('Saved blob fees', {
          from,
          to: end,
          blocks: fees.length,
        })

        return end
      },
    )
  }

  /** The hour of the newest block kept may have held blocks dropped, so it is recomputed too */
  override async invalidate(targetHeight: number): Promise<number> {
    await this.$.db.transaction(async () => {
      const deleted = await this.$.db.blobFee.deleteAfter(targetHeight)
      const newestKept = await this.$.db.blobFee.findByBlockNumber(targetHeight)
      await this.$.db.blobFeeHourly.recomputeFrom(
        newestKept ? UnixTime.toStartOf(newestKept.timestamp, 'hour') : 0,
      )
      if (deleted > 0) {
        this.logger.info('Deleted blob fees', { targetHeight, deleted })
      }
    })
    return targetHeight
  }

  get daLayer() {
    return 'ethereum'
  }
}
