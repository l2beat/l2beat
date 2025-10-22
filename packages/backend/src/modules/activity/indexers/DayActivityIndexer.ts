import { assert, UnixTime } from '@l2beat/shared-pure'
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

  // FROM and TO are actually days passed since unix epoch, not timestamps cause its using DayTargetIndexer as parent
  override async update(from: number, to: number): Promise<number> {
    // starkex APIs are not stable and can change from the past. With this we make sure to scrape them again
    const fromWithUncertainty = from - this.$.uncertaintyBuffer - 1
    const adjustedFrom = Math.max(this.$.minHeight, fromWithUncertainty)

    const fromWithBatchSize = adjustedFrom + this.$.batchSize
    const adjustedTo = Math.min(fromWithBatchSize, to)

    const { records } = await this.$.txsCountService.getTxsCount(
      adjustedFrom,
      adjustedTo,
    )

    await this.$.db.transaction(async () => {
      await this.$.db.activity.upsertMany(records)
      await this.$.db.syncMetadata.updateSyncedUntil(
        'activity',
        [this.$.projectId],
        adjustedTo * UnixTime.DAY,
      )
    })

    return adjustedTo
  }

  override invalidate(targetHeight: number): Promise<number> {
    // no need to delete data as it will be overwritten by new values
    return Promise.resolve(targetHeight)
  }
}
