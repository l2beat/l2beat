import type { Database } from '@l2beat/database'
import type { BlobData, BlockProvider, DaProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'

export interface DaIndexerDeps extends ManagedChildIndexerOptions {
  daProvider: DaProvider
  blockProvider: BlockProvider
  db: Database
  batchSize: number
}

export abstract class DaIndexer extends ManagedChildIndexer {
  constructor(readonly $: DaIndexerDeps) {
    super({
      ...$,
      tags: {
        tag: 'data-availability',
        ...$.tags,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async update(from: number, to: number): Promise<number> {
    const fromWithBatchSize = from + this.$.batchSize
    const adjustedTo = fromWithBatchSize < to ? fromWithBatchSize : to

    this.logger.info('Fetching blobs', { from, to: adjustedTo })

    const allBlobs = await this.$.daProvider.getBlobs(from, adjustedTo)

    // Since we bucket by hour and index by blocks
    // we need to get a reference timestamp since some update range may overlap with the previous hour
    const { timestamp } =
      await this.$.blockProvider.getBlockWithTransactions(from)

    const fillBackSince = new UnixTime(timestamp).toStartOf('day')

    await this.process(fillBackSince, allBlobs)

    return adjustedTo
  }

  protected abstract process(
    fillBackSince: UnixTime,
    blobs: BlobData[],
  ): Promise<void>
}
