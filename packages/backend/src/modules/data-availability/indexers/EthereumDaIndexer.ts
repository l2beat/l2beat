import type { Database } from '@l2beat/database'
import type { BlobSizeData, BlockProvider, DaProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { aggregatePerDay } from '../utils/aggregatePerDay'

export interface EthereumDaIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  daProvider: DaProvider
  blockProvider: BlockProvider
  db: Database
  /** The number of blocks/days to process at once. In case of error this is the maximum amount of blocks/days we will need to refetch */
  batchSize: number
  selector: string
}

export class EthereumDaIndexer extends ManagedChildIndexer {
  constructor(private readonly $: EthereumDaIndexerDeps) {
    super({
      ...$,
      name: `ethereum_da_indexer`,
      tags: {
        tag: 'data-availability',
        project: $.selector,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async update(from: number, to: number): Promise<number> {
    const fromWithBatchSize = from + this.$.batchSize
    const adjustedTo = fromWithBatchSize < to ? fromWithBatchSize : to

    this.logger.info('Fetching blobs', { from, to: adjustedTo })

    const blobs = await this.$.daProvider.getBlobs(from, adjustedTo)

    // Since we bucket by hour and index by blocks
    // we need to get a reference timestamp since some update range may overlap with the previous hour
    const { timestamp } =
      await this.$.blockProvider.getBlockWithTransactions(from)

    const fillBackSince = new UnixTime(timestamp).toStartOf('day')

    const presentRecords =
      await this.$.db.dataAvailability.getByProjectIdAndFrom(
        this.$.selector,
        fillBackSince,
      )

    const presentBlobSizeData: BlobSizeData[] = presentRecords.map(
      (record) => ({
        blockTimestamp: record.timestamp,
        size: record.totalSize,
      }),
    )

    // It will reduce previous aggregate with new blobs
    const records = aggregatePerDay(this.$.selector, [
      ...presentBlobSizeData,
      ...blobs,
    ])

    await this.$.db.dataAvailability.upsertMany(records)

    return adjustedTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    const { timestamp } =
      await this.$.blockProvider.getBlockWithTransactions(targetHeight)

    const fillBackSince = new UnixTime(timestamp).toStartOf('day')

    await this.$.db.dataAvailability.deleteByProjectFrom(
      this.$.selector,
      fillBackSince,
    )

    return targetHeight
  }
}
