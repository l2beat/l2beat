import { assert } from '@l2beat/backend-tools'
import { CoingeckoQueryService } from '@l2beat/shared'
import { CirculatingSupplyEntry, UnixTime } from '@l2beat/shared-pure'
import { isInteger } from 'lodash'

import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import {
  AmountRecord,
  AmountRepository,
} from '../repositories/AmountRepository'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { createAmountId } from '../utils/createAmountId'

export interface ChainAmountIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  coingeckoQueryService: CoingeckoQueryService
  amountRepository: AmountRepository
  syncOptimizer: SyncOptimizer
  config: CirculatingSupplyEntry
}

export class CirculatingSupplyIndexer extends ManagedChildIndexer {
  private readonly configId: string

  constructor(private readonly $: ChainAmountIndexerDeps) {
    const logger = $.logger.tag($.config.coingeckoId.toString())
    const name = 'circulating_supply_indexer'
    super({ ...$, name, logger })
    this.configId = createAmountId($.config)
  }

  async update(from: number, to: number): Promise<number> {
    const adjustedFrom = this.$.syncOptimizer.getTimestampToSync(
      new UnixTime(from),
    )
    const adjustedTo = this.getAdjustedTo(adjustedFrom, to)

    const amounts = await this.fetchAndOptimizeCirculatingSupplies(
      adjustedFrom,
      adjustedTo,
    )

    this.logger.info('Fetched amounts in range', {
      from: adjustedFrom.toNumber(),
      to: adjustedTo.toNumber(),
      amounts: amounts.length,
    })

    const nonZeroAmounts = amounts.filter((a) => a.amount > 0n)

    await this.$.amountRepository.addMany(nonZeroAmounts)

    this.logger.info('Saved amounts into DB', {
      amounts: nonZeroAmounts.length,
    })

    return adjustedTo.toNumber()
  }

  private getAdjustedTo(from: UnixTime, to: number): UnixTime {
    const alignedTo = new UnixTime(to).toStartOf('hour')
    assert(from.lte(alignedTo), 'Programmer error: from > to')

    const maxDaysForOneCall = CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL
    return UnixTime.min(alignedTo, from.add(maxDaysForOneCall, 'days'))
  }

  private async fetchAndOptimizeCirculatingSupplies(
    from: UnixTime,
    to: UnixTime,
  ): Promise<AmountRecord[]> {
    const circulatingSupplies =
      await this.$.coingeckoQueryService.getCirculatingSupplies(
        this.$.config.coingeckoId,
        { from, to },
        undefined,
      )

    return circulatingSupplies
      .filter((p) => this.$.syncOptimizer.shouldTimestampBeSynced(p.timestamp))
      .map((circulatingSupply) => {
        assert(isInteger(circulatingSupply.value), 'Should be an integer')
        return {
          configId: this.configId,
          timestamp: circulatingSupply.timestamp,
          amount:
            BigInt(circulatingSupply.value) *
            10n ** BigInt(this.$.config.decimals),
        }
      })
  }

  override async invalidate(targetHeight: number): Promise<number> {
    const deletedRecords = await this.$.amountRepository.deleteByConfigAfter(
      this.configId,
      new UnixTime(targetHeight),
    )

    this.logger.info('Deleted records', {
      targetHeight,
      deletedRecords,
    })

    return targetHeight
  }
}
