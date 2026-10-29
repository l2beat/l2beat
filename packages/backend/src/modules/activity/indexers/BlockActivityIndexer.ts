import type { Logger } from '@l2beat/backend-tools'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedChildIndexer } from '../../../tools/uif/ManagedChildIndexer'
import { HOURLY_ACTIVITY_DAYS } from '../utils/hourlyActivity'
import { sumPerPeriod } from '../utils/sumPerPeriod'
import type { BlockActivityIndexerDeps } from './types'

export class BlockActivityIndexer extends ManagedChildIndexer {
  constructor(
    private readonly $: BlockActivityIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: 'activity_block_indexer',
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
    const fromWithBatchSize = from + this.$.batchSize
    const adjustedTo = fromWithBatchSize < to ? fromWithBatchSize : to

    this.logger.info('Fetching blocks', { from, to: adjustedTo })

    const blocks = await this.$.blockSource.getBlocks(from, adjustedTo)
    const latestTimestamp = blocks.at(-1)?.timestamp
    assert(latestTimestamp !== undefined, 'Latest timestamp is undefined')

    const days = sumPerPeriod(blocks, 'day')
    const hourlyCutoff =
      UnixTime.toStartOf(latestTimestamp, 'hour') -
      HOURLY_ACTIVITY_DAYS * UnixTime.DAY

    this.logger.info('Saving records', { count: days.length })

    await this.$.db.transaction(async () => {
      await this.$.db.hourlyActivity.addMany(
        sumPerPeriod(blocks, 'hour').map((hour) => ({
          projectId: this.$.projectId,
          timestamp: hour.timestamp,
          count: hour.count,
          uopsCount: hour.uopsCount,
        })),
      )
      await this.$.db.activity.addMany(
        days.map((day) => ({
          projectId: this.$.projectId,
          ...day,
        })),
      )
      await this.$.db.hourlyActivity.deleteByProjectIdUntil(
        this.$.projectId,
        hourlyCutoff,
      )
      await this.$.db.syncMetadata.updateSyncedUntil(
        'activity',
        [this.$.projectId],
        UnixTime.toEndOf(latestTimestamp, 'hour'),
        adjustedTo,
      )
    })

    return adjustedTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    //find record that includes targetHeight
    const records = await this.$.db.activity.getByProjectIncludingDataPoint(
      this.$.projectId,
      targetHeight + 1,
    )

    if (records.length === 0) {
      return targetHeight
    }

    assert(
      records.length === 1,
      `There should be exactly one record that includes data point (projectId: ${this.$.projectId}, dataPoint: ${targetHeight})`,
    )

    // we need to invalidate all data points from record
    const adjustedTargetHeight = records[0].start - 1

    await this.$.db.transaction(async () => {
      const deletedRows = await this.$.db.activity.deleteByProjectIdFrom(
        this.$.projectId,
        records[0].timestamp,
      )
      const deletedHourlyRows =
        await this.$.db.hourlyActivity.deleteByProjectIdFrom(
          this.$.projectId,
          records[0].timestamp,
        )
      if (deletedRows > 0 || deletedHourlyRows > 0) {
        this.logger.info('Deleted rows', { deletedRows, deletedHourlyRows })
      }
    })

    this.logger.info('Invalidated activity', {
      projectId: this.$.projectId,
      targetHeight,
      adjustedTargetHeight,
      timestamp: records[0].timestamp,
    })

    return Promise.resolve(adjustedTargetHeight)
  }
}
