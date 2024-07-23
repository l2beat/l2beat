import { ActivityRecord } from '@l2beat/database/src/activity/entity'
import { ActivityRepository } from '@l2beat/database/src/activity/repository'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { TxsCountProvider } from '../services/TxsCountProvider'

export interface ActivityIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  projectId: ProjectId
  txsCountProvider: TxsCountProvider
  activityRepository: ActivityRepository
  batchSize: number
}

export class ActivityIndexer extends ManagedChildIndexer {
  constructor(private readonly $: ActivityIndexerDeps) {
    const logger = $.logger.tag($.projectId)
    super({ ...$, logger, name: `activity_indexer_${$.projectId}` })
  }

  override async update(from: number, to: number): Promise<number> {
    const fromWithBatchSize = from + this.$.batchSize
    const adjustedTo = fromWithBatchSize < to ? fromWithBatchSize : to

    const counts = await this.$.txsCountProvider.getTxsCount(from, adjustedTo)
    const currentMap = await this.getDatabaseEntries(counts)

    const dataToSave = counts.map(({ timestamp, count, projectId }) => {
      const currentCount = currentMap.get(timestamp.toNumber())
      return {
        timestamp: timestamp,
        count: currentCount ? currentCount + count : count,
        projectId,
      }
    })
    await this.$.activityRepository.addOrUpdateMany(dataToSave)

    return adjustedTo
  }

  async getDatabaseEntries(
    activityRecords: ActivityRecord[],
  ): Promise<Map<number, number>> {
    if (activityRecords.length === 0) return new Map()

    let min = activityRecords[0].timestamp.toNumber()
    let max = min

    for (const record of activityRecords) {
      const timestamp = record.timestamp.toNumber()
      if (timestamp < min) min = timestamp
      if (timestamp > max) max = timestamp
    }

    const currentValues =
      await this.$.activityRepository.getByProjectAndTimeRange(
        this.$.projectId,
        [new UnixTime(min), new UnixTime(max)],
      )
    return new Map(currentValues.map((v) => [v.timestamp.toNumber(), v.count]))
  }

  override invalidate(targetHeight: number): Promise<number> {
    assert(targetHeight === this.safeHeight, 'Invalidating is not allowed')
    return Promise.resolve(targetHeight)
  }
}
