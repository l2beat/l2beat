import type { Logger } from '@l2beat/backend-tools'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import range from 'lodash/range'
import sum from 'lodash/sum'
import { ManagedChildIndexer } from '../../../tools/uif/ManagedChildIndexer'
import { HOURLY_ACTIVITY_DAYS } from '../utils/hourlyActivity'
import { getDayHourPeak } from '../utils/peaks'
import type { HourActivityIndexerDeps } from './types'

/**
 * For day sources that count by the hour. Heights are hours since the epoch,
 * so today's day is kept up to date like a block chain's
 */
export class HourActivityIndexer extends ManagedChildIndexer {
  constructor(
    private readonly $: HourActivityIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: 'activity_hour_indexer',
        tags: {
          tag: $.projectId,
          project: $.projectId,
        },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async update(from: number, to: number): Promise<number> {
    // `from - 1` is the first hour not synced. Its day is synced again from
    // its start, so the day stays the sum of its hours from one response
    const start = Math.max(
      UnixTime.toStartOf((from - 1) * UnixTime.HOUR, 'day'),
      this.$.minHeight * UnixTime.HOUR,
    )
    const end = to * UnixTime.HOUR

    const hours = (await this.$.provider.getHourlyCounts(start, end)).map(
      (hour) => ({ projectId: this.$.projectId, ...hour }),
    )
    const days = range(start, end, UnixTime.DAY).map((timestamp) => {
      const inDay = hours.filter(
        (hour) => UnixTime.toStartOf(hour.timestamp, 'day') === timestamp,
      )
      assert(inDay.length > 0, 'Day has no hours')
      return {
        projectId: this.$.projectId,
        timestamp,
        count: sum(inDay.map((hour) => hour.count)),
        uopsCount: sum(inDay.map((hour) => hour.uopsCount)),
        start: timestamp,
        end: timestamp + UnixTime.DAY - 1,
        ...getDayHourPeak(timestamp, inDay),
      }
    })
    const hourlyCutoff = end - HOURLY_ACTIVITY_DAYS * UnixTime.DAY

    await this.$.db.transaction(async () => {
      await this.$.db.activity.upsertMany(days)
      // addMany adds to stored hours, so the hours synced again go first
      await this.$.db.hourlyActivity.deleteByProjectIdFrom(
        this.$.projectId,
        start,
      )
      await this.$.db.hourlyActivity.addMany(
        hours.filter((hour) => hour.timestamp >= hourlyCutoff),
      )
      await this.$.db.hourlyActivity.deleteByProjectIdUntil(
        this.$.projectId,
        hourlyCutoff,
      )
      await this.$.db.syncMetadata.updateSyncedUntil(
        'activity',
        [this.$.projectId],
        end,
      )
    })

    return to
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // Daily rows are overwritten by new values, but stored hours are added to
    await this.$.db.hourlyActivity.deleteByProjectIdFrom(
      this.$.projectId,
      targetHeight * UnixTime.HOUR,
    )
    return targetHeight
  }
}
