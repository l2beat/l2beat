import { CirculatingSupplyEntry, UnixTime } from '@l2beat/shared-pure'

import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { DEFAULT_RETRY_FOR_TVL } from '../../../tools/uif/defaultRetryForTvl'
import { AmountRepository } from '../repositories/AmountRepository'
import { CirculatingSupplyService } from '../services/CirculatingSupplyService'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { createAmountId } from '../utils/createAmountId'

export interface ChainAmountIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  circulatingSupplyService: CirculatingSupplyService
  amountRepository: AmountRepository
  syncOptimizer: SyncOptimizer
  configuration: CirculatingSupplyEntry
}

export class CirculatingSupplyIndexer extends ManagedChildIndexer {
  private readonly configurationId: string

  constructor(private readonly $: ChainAmountIndexerDeps) {
    const logger = $.logger.tag($.configuration.coingeckoId.toString())
    const name = 'circulating_supply_indexer'
    super({ ...$, name, logger, updateRetryStrategy: DEFAULT_RETRY_FOR_TVL })
    this.configurationId = createAmountId($.configuration)
  }

  async update(from: number, to: number): Promise<number> {
    const adjustedTo = this.$.circulatingSupplyService.getAdjustedTo(from, to)

    const amounts =
      await this.$.circulatingSupplyService.fetchCirculatingSupplies(
        new UnixTime(from),
        adjustedTo,
        this.$.configuration,
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

    await this.$.amountRepository.addMany(nonZeroAmounts)

    this.logger.info('Saved amounts into DB', {
      from,
      to: adjustedTo.toNumber(),
      amounts: nonZeroAmounts.length,
    })

    return adjustedTo.toNumber()
  }

  override async invalidate(targetHeight: number): Promise<number> {
    const deletedRecords = await this.$.amountRepository.deleteByConfigAfter(
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
