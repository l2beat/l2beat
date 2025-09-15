import type { ActivityRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedChildIndexer } from '../../../tools/uif/ManagedChildIndexer'
import type { ActivityIndexerDeps } from './types'

export class BlockActivityIndexer extends ManagedChildIndexer {
  constructor(private readonly $: ActivityIndexerDeps) {
    super({
      ...$,
      name: 'activity_block_indexer',
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

    this.logger.info('Fetching blocks', { from, to: adjustedTo })

    const { records, latestTimestamp } =
      await this.$.txsCountService.getTxsCount(from, adjustedTo)
    const currentMap = await this.getDatabaseEntries(records)

    const dataToSave = records.map(
      ({
        timestamp,
        projectId,
        count: countValue,
        uopsCount: uopsCountValue,
        start,
        end,
      }) => {
        const currentRecord = currentMap.get(timestamp)
        const count = (currentRecord?.count ?? 0) + countValue
        const uopsCount =
          uopsCountValue !== null
            ? (currentRecord?.uopsCount ?? 0) + uopsCountValue
            : (currentRecord?.uopsCount ?? null)

        return {
          projectId,
          timestamp: timestamp,
          count,
          uopsCount,
          start: currentRecord ? Math.min(currentRecord.start, start) : start,
          end: currentRecord ? Math.max(currentRecord.end, end) : end,
        }
      },
    )

    this.logger.info('Saving records', { count: dataToSave.length })

    await this.$.db.transaction(async () => {
      await this.$.db.activity.upsertMany(dataToSave)
      await this.$.db.syncMetadata.updateSyncedUntil(
        'activity',
        [this.$.projectId],
        UnixTime.toEndOf(latestTimestamp, 'hour'),
        adjustedTo,
      )
    })

    return adjustedTo
  }

  async getDatabaseEntries(
    activityRecords: ActivityRecord[],
  ): Promise<Map<number, ActivityRecord>> {
    if (activityRecords.length === 0) return new Map()

    let min = activityRecords[0].timestamp
    let max = min

    for (const record of activityRecords) {
      const timestamp = record.timestamp
      if (timestamp < min) min = timestamp
      if (timestamp > max) max = timestamp
    }

    const currentValues = await this.$.db.activity.getByProjectAndTimeRange(
      this.$.projectId,
      [UnixTime(min), UnixTime(max)],
    )
    return new Map(currentValues.map((v) => [v.timestamp, v]))
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

    const deletedRows = await this.$.db.activity.deleteByProjectIdFrom(
      this.$.projectId,
      records[0].timestamp,
    )

    if (deletedRows > 0) {
      this.$.logger.info('Deleted rows', { deletedRows })
    }

    this.$.logger.info('Invalidated activity', {
      projectId: this.$.projectId,
      targetHeight,
      adjustedTargetHeight,
      timestamp: records[0].timestamp,
    })

    return Promise.resolve(adjustedTargetHeight)
  }
}
