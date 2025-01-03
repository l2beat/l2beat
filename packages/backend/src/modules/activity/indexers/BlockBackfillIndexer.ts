import { assert } from '@l2beat/shared-pure'
import { BlockIndexerBase } from './BlockIndexerBase'
import { ActivityIndexerDeps } from './types'

export class BlockBackfillIndexer extends BlockIndexerBase {
  constructor($: ActivityIndexerDeps) {
    super($, `activity_block_backfill_indexer`)
  }

  override async update(from: number, to: number): Promise<number> {
    //check cut-off point
    assert(this.$.cutOffPoint, 'Cut-off point should be defined')

    if (from >= this.$.cutOffPoint - 1) {
      this.logger.info('Backfill completed. Skipping', {
        from,
        cutOffPoint: this.$.cutOffPoint,
      })
      return to
    }

    // pickup where live indexer left off
    const currentBackfillBlock =
      await this.$.db.activity.getProjectBlockNumberBeforeCutOffPoint(
        this.$.projectId,
        this.$.cutOffPoint,
      )
    if (from < currentBackfillBlock) {
      this.logger.info('Adjusting to the current backfill block', {
        from,
        currentBackfillBlock,
      })
      from = currentBackfillBlock
    }

    return await this.doUpdate(from, to)
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // backfill is not invalidated
    return await Promise.resolve(targetHeight)
  }
}
