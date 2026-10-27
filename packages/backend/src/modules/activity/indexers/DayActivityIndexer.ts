import type { Logger } from '@l2beat/backend-tools'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedChildIndexer } from '../../../tools/uif/ManagedChildIndexer'
import { HOURLY_ACTIVITY_DAYS } from '../utils/hourlyActivity'
import type { DayActivityIndexerDeps } from './types'

export class DayActivityIndexer extends ManagedChildIndexer {
  constructor(
    private readonly $: DayActivityIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: 'activity_day_indexer',
        tags: {
          tag: $.projectId,
          project: $.projectId,
        },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )

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

    const { records, hours } = await this.$.txsCountService.getTxsCount(
      adjustedFrom,
      adjustedTo,
    )
    const hourlyCutoff = (adjustedTo - HOURLY_ACTIVITY_DAYS) * UnixTime.DAY

    await this.$.db.transaction(async () => {
      await this.$.db.activity.upsertMany(records)
      if (hours) {
        // addMany adds to stored hours, so days synced again drop theirs first
        await this.$.db.hourlyActivity.deleteByProjectIdFrom(
          this.$.projectId,
          adjustedFrom * UnixTime.DAY,
        )
        await this.$.db.hourlyActivity.addMany(
          hours.filter((hour) => hour.timestamp >= hourlyCutoff),
        )
        await this.$.db.hourlyActivity.deleteByProjectIdUntil(
          this.$.projectId,
          hourlyCutoff,
        )
      }
      await this.$.db.syncMetadata.updateSyncedUntil(
        'activity',
        [this.$.projectId],
        adjustedTo * UnixTime.DAY,
      )
    })

    return adjustedTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // Daily rows are overwritten by new values, but stored hours are added to
    await this.$.db.hourlyActivity.deleteByProjectIdFrom(
      this.$.projectId,
      targetHeight * UnixTime.DAY,
    )
    return targetHeight
  }
}
