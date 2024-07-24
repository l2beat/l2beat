import { ManagedChildIndexer } from '../../../tools/uif/ManagedChildIndexer'
import { ActivityIndexerDeps } from './types'

export class DayActivityIndexer extends ManagedChildIndexer {
  constructor(private readonly $: ActivityIndexerDeps) {
    const logger = $.logger.tag($.projectId)
    super({ ...$, logger, name: `activity_indexer_${$.projectId}` })
  }

  override async update(from: number, to: number): Promise<number> {
    const fromWithBatchSize = from + this.$.batchSize
    const adjustedTo = fromWithBatchSize < to ? fromWithBatchSize : to

    const counts = await this.$.txsCountProvider.getTxsCount(from, adjustedTo)

    await this.$.activityRepository.addOrUpdateMany(counts)

    return adjustedTo
  }

  override invalidate(targetHeight: number): Promise<number> {
    // no need to delete data as it will be overwritten by new values
    return Promise.resolve(targetHeight)
  }
}
