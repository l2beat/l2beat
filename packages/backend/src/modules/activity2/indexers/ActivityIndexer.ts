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
}

export class ActivityIndexer extends ManagedChildIndexer {
  constructor(private readonly $: ActivityIndexerDeps) {
    const logger = $.logger.tag($.projectId)
    super({ ...$, logger, name: `activity_indexer_${$.projectId}` })
  }

  override async update(from: number, to: number): Promise<number> {
    const counts = await this.$.txsCountProvider.getTxsCount(from, to)

    await this.$.activityRepository.addOrUpdateMany(
      Array.from(counts).map(([timestamp, count]) => ({
        count,
        timestamp: new UnixTime(timestamp),
        projectId: this.$.projectId,
      })),
    )
    return to
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
