import { ActivityRepository } from '@l2beat/database/src/activity/repository'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
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
  batchSize?: number
}

export class ActivityIndexer extends ManagedChildIndexer {
  constructor(private readonly $: ActivityIndexerDeps) {
    const logger = $.logger.tag($.projectId)
    super({ ...$, logger, name: `activity_indexer_${$.projectId}` })
  }

  override async update(from: number, to: number): Promise<number> {
    const batchSize = this.$.batchSize ?? 100

    const adjustedTo = from + batchSize < to ? from + batchSize : to
    const counts = await this.$.txsCountProvider.getTxsCount(from, adjustedTo)

    const timestamps = Array.from(counts.keys())

    const currentValues =
      await this.$.activityRepository.getByProjectAndTimeRange(
        this.$.projectId,
        [
          new UnixTime(Math.min(...timestamps)),
          new UnixTime(Math.max(...timestamps)),
        ],
      )
    const currentMap = new Map(
      currentValues.map((v) => [v.timestamp.toNumber(), v.count]),
    )

    const dataToSave = Array.from(counts).map(([timestamp, count]) => {
      const currentCount = currentMap.get(timestamp)
      return {
        timestamp: new UnixTime(timestamp),
        count: currentCount ? currentCount + count : count,
        projectId: this.$.projectId,
      }
    })
    await this.$.activityRepository.addOrUpdateMany(dataToSave)

    return adjustedTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await this.$.activityRepository.deleteAfter(
      new UnixTime(targetHeight),
      this.$.projectId,
    )

    this.logger.info('Deleted activity timestamps after height', {
      targetHeight,
      projectId: this.$.projectId,
    })

    return targetHeight
  }
}
