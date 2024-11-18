import { ActivityRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedChildIndexer } from '../../../tools/uif/ManagedChildIndexer'
import { ActivityIndexerDeps } from './types'

export class BlockActivityIndexer extends ManagedChildIndexer {
  constructor(private readonly $: ActivityIndexerDeps) {
    super({
      ...$,
      name: `activity_block_indexer`,
      tag: $.projectId,
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async update(from: number, to: number): Promise<number> {
    const fromWithBatchSize = from + this.$.batchSize
    const adjustedTo = fromWithBatchSize < to ? fromWithBatchSize : to

    this.logger.info('Fetching blocks', { from, to: adjustedTo })

    const counts = await this.$.txsCountService.getTxsCount(from, adjustedTo)
    const currentMap = await this.getDatabaseEntries(counts)

    const dataToSave = counts.map(
      ({
        timestamp,
        projectId,
        count: countValue,
        uopsCount: uopsCountValue,
        start,
        end,
      }) => {
        const currentRecord = currentMap.get(timestamp.toNumber())
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

    await this.$.db.activity.upsertMany(dataToSave)

    return adjustedTo
  }

  async getDatabaseEntries(
    activityRecords: ActivityRecord[],
  ): Promise<Map<number, ActivityRecord>> {
    if (activityRecords.length === 0) return new Map()

    let min = activityRecords[0].timestamp.toNumber()
    let max = min

    for (const record of activityRecords) {
      const timestamp = record.timestamp.toNumber()
      if (timestamp < min) min = timestamp
      if (timestamp > max) max = timestamp
    }

    const currentValues = await this.$.db.activity.getByProjectAndTimeRange(
      this.$.projectId,
      [new UnixTime(min), new UnixTime(max)],
    )
    return new Map(currentValues.map((v) => [v.timestamp.toNumber(), v]))
  }

  override async invalidate(targetHeight: number): Promise<number> {
    //find record that includes targetHeight
    const records = await this.$.db.activity.getByProjectIncludingDataPoint(
      this.$.projectId,
      targetHeight + 1,
    )
    if (records.length === 0) return targetHeight

    this.assertInvalidationCausedByRestart(records, targetHeight)

    const deletedRows = await this.$.db.activity.deleteByProjectIdFrom(
      this.$.projectId,
      records[0].timestamp,
    )

    assert(
      deletedRows === records.length,
      `Incorrect amount of records deleted: ${deletedRows} != ${records.length}`,
    )
    this.logger.info('Deleted rows', { deletedRows })

    // we need to invalidate all data points from record
    const adjustedTargetHeight = records[0].start - 1
    return Promise.resolve(adjustedTargetHeight)
  }

  private assertInvalidationCausedByRestart(
    records: ActivityRecord[],
    targetHeight: number,
  ) {
    if (records.length > 2) {
      this.logger.warn(`Invalidation error`, {
        records: records.length,
        safeHeight: this.safeHeight,
        targetHeight,
      })
      throw new Error('Invalidation used only for restart protection')
    }
  }
}
