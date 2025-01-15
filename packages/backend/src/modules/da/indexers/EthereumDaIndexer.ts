import { Database } from '@l2beat/database'
import { BlockProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { BlobSizeData, BlobsProvider } from '../providers/DaProvider'
import { aggregatePerHour } from '../utils/aggregatePerDay'

export interface EthereumDaIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  blobsProvider: BlobsProvider
  blockProvider: BlockProvider
  db: Database
  /** The number of blocks/days to process at once. In case of error this is the maximum amount of blocks/days we will need to refetch */
  batchSize: number
  minBlock: number
}

export class EthereumDaIndexer extends ManagedChildIndexer {
  constructor(private readonly $: EthereumDaIndexerDeps) {
    super({
      ...$,
      name: `ethereum_da_indexer`,
      tags: {
        tag: 'ethereum',
        project: 'blobs',
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async update(from: number, to: number): Promise<number> {
    const fromWithBatchSize = from + this.$.batchSize
    const adjustedTo = fromWithBatchSize < to ? fromWithBatchSize : to

    this.logger.info('Fetching blobs', { from, to: adjustedTo })

    // We could optimize this by getting the count only instead of paginating in in the blobscan client
    // since each blob is 128 KiB so 131,072 B
    // ? or maybe not since we need timestamp to bucket data
    const blobs = await this.$.blobsProvider.getBlobs(from, adjustedTo)

    // Since we bucket by hour and index by blocks
    // we need to get a reference timestamp since some update range may overlap with the previous hour
    const { timestamp } =
      await this.$.blockProvider.getBlockWithTransactions(from)

    const fillBackSince = new UnixTime(timestamp).toStartOf('hour')

    const presentRecords = await this.$.db.da.getByProjectAndFrom(
      'ethereum',
      fillBackSince,
    )

    const presentBlobSizeData: BlobSizeData[] = presentRecords.map(
      (record) => ({
        blockTimestamp: record.timestamp,
        size: record.totalSize,
      }),
    )

    // It will reduce previous aggregate with new blobs
    const records = aggregatePerHour('ethereum', [
      ...presentBlobSizeData,
      ...blobs,
    ])

    await this.$.db.da.upsertMany(records)

    return adjustedTo
  }

  override invalidate(targetHeight: number): Promise<number> {
    // TODO: implement
    return Promise.resolve(targetHeight)
  }
}
