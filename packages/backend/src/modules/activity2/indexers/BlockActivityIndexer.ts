import { ActivityRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { ManagedChildIndexer } from '../../../tools/uif/ManagedChildIndexer'
import { ActivityIndexerDeps } from './types'

export class BlockActivityIndexer extends ManagedChildIndexer {
  constructor(private readonly $: ActivityIndexerDeps) {
    const logger = $.logger.tag($.projectId)
    super({ ...$, logger, name: `activity_indexer_${$.projectId}` })
  }

  override async update(from: number, to: number): Promise<number> {
    const fromWithBatchSize = from + this.$.batchSize
    const adjustedTo = fromWithBatchSize < to ? fromWithBatchSize : to

    const counts = await this.$.txsCountProvider.getTxsCount(from, adjustedTo)
    const currentMap = await this.getDatabaseEntries(counts)

    const dataToSave = counts.map(
      ({ timestamp, count, projectId, start, end }) => {
        const currentRecord = currentMap.get(timestamp.toNumber())
        return {
          projectId,
          timestamp: timestamp,
          count: currentRecord ? currentRecord.count + count : count,
          start: currentRecord ? Math.min(currentRecord.start, start) : start,
          end: currentRecord ? Math.max(currentRecord.end, end) : end,
        }
      },
    )
    await this.$.db.activity.addOrUpdateMany(dataToSave)

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

  override invalidate(targetHeight: number): Promise<number> {
    assert(targetHeight === this.safeHeight, 'Invalidating is not allowed')
    return Promise.resolve(targetHeight)
  }
}
