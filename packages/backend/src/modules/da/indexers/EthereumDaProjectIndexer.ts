import { EthereumDaConfig } from '@l2beat/config'
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

export interface EthereumDaProjectIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  blobsProvider: BlobsProvider
  blockProvider: BlockProvider
  db: Database
  /** The number of blocks/days to process at once. In case of error this is the maximum amount of blocks/days we will need to refetch */
  batchSize: number
  projectId: string
  config: EthereumDaConfig
}

export class EthereumDaProjectIndexer extends ManagedChildIndexer {
  constructor(private readonly $: EthereumDaProjectIndexerDeps) {
    super({
      ...$,
      name: `ethereum_da_project_${$.projectId}_indexer`,
      tags: {
        tag: $.projectId,
        project: $.projectId,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async update(from: number, to: number): Promise<number> {
    const fromWithBatchSize = from + this.$.batchSize
    const adjustedTo = fromWithBatchSize < to ? fromWithBatchSize : to

    this.logger.info('Fetching project blobs', {
      from,
      to: adjustedTo,
    })

    const blobs = await this.$.blobsProvider.getBlobsByAddress(
      from,
      adjustedTo,
      this.$.config.config.inbox,
      this.$.config.config.sequencers,
    )

    // Since we bucket by hour and index by blocks
    // we need to get a reference timestamp since some update range may overlap with the previous hour
    const { timestamp } =
      await this.$.blockProvider.getBlockWithTransactions(from)

    const fillBackSince = new UnixTime(timestamp).toStartOf('hour')

    const presentRecords = await this.$.db.da.getByProjectAndFrom(
      this.$.projectId,
      fillBackSince,
    )

    const presentBlobSizeData: BlobSizeData[] = presentRecords.map(
      (record) => ({
        blockTimestamp: record.timestamp,
        size: record.totalSize,
      }),
    )

    // It will reduce previous aggregate with new blobs
    const records = aggregatePerHour(this.$.projectId, [
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
