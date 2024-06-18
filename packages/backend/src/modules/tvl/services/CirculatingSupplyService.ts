import { assert } from '@l2beat/backend-tools'

import { CoingeckoQueryService } from '@l2beat/shared'
import { CirculatingSupplyEntry, UnixTime } from '@l2beat/shared-pure'
import { isInteger } from 'lodash'
import { AmountRecord } from '../repositories/AmountRepository'
import { createAmountId } from '../utils/createAmountId'

export interface CirculatingSupplyServiceDependencies {
  readonly coingeckoQueryService: CoingeckoQueryService
}

export class CirculatingSupplyService {
  constructor(private readonly $: CirculatingSupplyServiceDependencies) {}

  async fetchCirculatingSupplies(
    from: UnixTime,
    to: UnixTime,
    configuration: CirculatingSupplyEntry,
  ): Promise<AmountRecord[]> {
    const circulatingSupplies =
      await this.$.coingeckoQueryService.getCirculatingSupplies(
        configuration.coingeckoId,
        { from, to },
        undefined,
      )

    return circulatingSupplies.map((circulatingSupply) => {
      assert(isInteger(circulatingSupply.value), 'Should be an integer')
      return {
        configId: createAmountId(configuration),
        timestamp: circulatingSupply.timestamp,
        amount:
          BigInt(circulatingSupply.value) *
          10n ** BigInt(configuration.decimals),
      }
    })
  }

  getAdjustedTo(from: number, to: number): UnixTime {
    return CoingeckoQueryService.getAdjustedTo(
      new UnixTime(from),
      new UnixTime(to),
    )
  }
}
