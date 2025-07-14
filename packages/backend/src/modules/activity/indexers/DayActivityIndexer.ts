import { assert } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedChildIndexer } from '../../../tools/uif/ManagedChildIndexer'
import type { DayActivityIndexerDeps } from './types'

export class DayActivityIndexer extends ManagedChildIndexer {
  constructor(private readonly $: DayActivityIndexerDeps) {
    super({
      ...$,
      name: 'activity_day_indexer',
      tags: {
        tag: $.projectId,
        project: $.projectId,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })

    assert(
      this.$.batchSize > this.$.uncertaintyBuffer,
      'Batch size should be bigger than uncertainty buffer',
    )
  }

  override async update(from: number, to: number): Promise<number> {
    // starkex APIs are not stable and can change from the past. With this we make sure to scrape them again
    const fromWithUncertainty = from - this.$.uncertaintyBuffer
    const adjustedFrom =
      fromWithUncertainty < this.$.minHeight
        ? this.$.minHeight
        : fromWithUncertainty

    const fromWithBatchSize = adjustedFrom + this.$.batchSize
    const adjustedTo = fromWithBatchSize < to ? fromWithBatchSize : to

    const counts = await this.$.txsCountService.getTxsCount(
      adjustedFrom,
      adjustedTo,
    )

    await this.$.db.activity.upsertMany(counts)

    return adjustedTo
  }

  override invalidate(targetHeight: number): Promise<number> {
    // no need to delete data as it will be overwritten by new values
    return Promise.resolve(targetHeight)
  }
}
