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
import { createAmountId } from '../utils/createAmountId'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export interface ChainAmountIndexerDeps extends ManagedChildIndexerOptions {
  coingeckoQueryService: CoingeckoQueryService
  amountRepository: AmountRepository
  syncOptimizer: SyncOptimizer
  config: CirculatingSupplyEntry
}

export class CirculatingSupplyIndexer extends ManagedChildIndexer {
  readonly indexerId: string
  private readonly configId: string

  constructor(private readonly $: ChainAmountIndexerDeps) {
    super($)
    this.indexerId = $.id
    this.configId = createAmountId($.config)
  }

  async update(_from: number, _to: number): Promise<number> {
    const from = this.$.syncOptimizer.getTimestampToSync(new UnixTime(_from))
    const to = this.getAdjustedTo(from, _to)

    const amounts = await this.fetchAndOptimizeCirculatingSupplies(from, to)
    const nonZeroAmounts = amounts.filter((a) => a.amount > 0n)

    await this.$.amountRepository.addMany(nonZeroAmounts)

    return to.toNumber()
  }

  private getAdjustedTo(from: UnixTime, _to: number): UnixTime {
    const to = new UnixTime(_to).toStartOf('hour')
    assert(from.lte(to), 'Programmer error: from > to')

    const maxDaysForOneCall = CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL
    return UnixTime.min(to, from.add(maxDaysForOneCall, 'days'))
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
    await this.$.amountRepository.deleteByConfigInTimeRange(
      this.configId,
      this.$.config.sinceTimestamp,
      new UnixTime(targetHeight),
    )

    return targetHeight
  }
}
