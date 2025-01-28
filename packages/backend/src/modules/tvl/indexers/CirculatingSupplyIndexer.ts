import { INDEXER_NAMES, createAmountId } from '@l2beat/backend-shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedChildIndexer } from '../../../tools/uif/ManagedChildIndexer'
import type { CirculatingSupplyIndexerDeps } from './types'

export class CirculatingSupplyIndexer extends ManagedChildIndexer {
  private readonly configurationId: string
  private readonly maxHeight: number | undefined

  constructor(private readonly $: CirculatingSupplyIndexerDeps) {
    super({
      ...$,
      name: INDEXER_NAMES.CIRCULATING_SUPPLY,
      tags: {
        tag: $.configuration.coingeckoId.toString(),
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      configHash: $.minHeight.toString(),
    })
    this.configurationId = createAmountId($.configuration)
    this.maxHeight = this.$.configuration.untilTimestamp?.toNumber()
  }

  async update(from: number, to: number): Promise<number> {
    if (this.maxHeight && from > this.maxHeight) {
      this.logger.info('Skipping update due to maxHeight', {
        from,
        to,
        maxHeight: this.maxHeight,
      })
      return to
    }

    const adjustedTo = this.getAdjustedTo(from, to)

    const amounts =
      await this.$.circulatingSupplyService.fetchCirculatingSupplies(
        new UnixTime(from),
        adjustedTo,
        { ...this.$.configuration, id: this.configurationId },
      )

    this.logger.info('Fetched amounts in range', {
      from,
      to: adjustedTo.toNumber(),
      amounts: amounts.length,
    })

    const optimizedAmounts = amounts.filter((p) =>
      this.$.syncOptimizer.shouldTimestampBeSynced(p.timestamp),
    )
    const nonZeroAmounts = optimizedAmounts.filter((a) => a.amount > 0n)

    await this.$.db.amount.insertMany(nonZeroAmounts)

    this.logger.info('Saved amounts into DB', {
      from,
      to: adjustedTo.toNumber(),
      amounts: nonZeroAmounts.length,
    })

    return adjustedTo.toNumber()
  }

  private getAdjustedTo(from: number, to: number) {
    const adjustedTo = this.$.circulatingSupplyService.getAdjustedTo(from, to)

    return this.maxHeight && this.maxHeight < adjustedTo.toNumber()
      ? new UnixTime(this.maxHeight)
      : adjustedTo
  }

  override async invalidate(targetHeight: number): Promise<number> {
    const deletedRecords = await this.$.db.amount.deleteByConfigAfter(
      this.configurationId,
      new UnixTime(targetHeight),
    )

    if (deletedRecords > 0) {
      this.logger.info('Deleted records', {
        targetHeight,
        deletedRecords,
      })
    }

    return targetHeight
  }
}
