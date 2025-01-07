import { assert } from '@l2beat/shared-pure'
import { BlockIndexerBase } from './BlockIndexerBase'
import { ActivityIndexerDeps } from './types'

export class BlockActivityIndexer extends BlockIndexerBase {
  constructor($: ActivityIndexerDeps) {
    super($, `activity_block_indexer`)
  }

  override async update(from: number, to: number): Promise<number> {
    //start from the cut-off point
    if (this.$.cutOffPoint && from < this.$.cutOffPoint) {
      assert(
        this.$.cutOffPoint <= to,
        `Cut-off point (${this.$.cutOffPoint}) should be less than or equal to the target height ${to}`,
      )

      this.logger.info('Adjusting to the cut-off point', {
        from,
        cutOffPoint: this.$.cutOffPoint,
      })
      from = this.$.cutOffPoint
    }

    return await this.doUpdate(from, to)
  }

  override async invalidate(targetHeight: number): Promise<number> {
    if (this.$.cutOffPoint && targetHeight < this.$.cutOffPoint) {
      this.logger.info('Adjusting invalidation to cut-off point', {
        targetHeight,
        cutOffPoint: this.$.cutOffPoint,
      })
      await this.doInvalidate(this.$.cutOffPoint)
      return targetHeight
    } else {
      return await this.doInvalidate(targetHeight)
    }
  }
}
