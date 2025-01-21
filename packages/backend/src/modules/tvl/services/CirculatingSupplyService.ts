import type { AmountRecord } from '@l2beat/database'
import {
  type CirculatingSupplyProvider,
  CoingeckoQueryService,
} from '@l2beat/shared'
import {
  assert,
  type CirculatingSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { isInteger } from 'lodash'

export interface CirculatingSupplyServiceDependencies {
  readonly circulatingSupplyProvider: CirculatingSupplyProvider
}

export class CirculatingSupplyService {
  constructor(private readonly $: CirculatingSupplyServiceDependencies) {}

  async fetchCirculatingSupplies(
    from: UnixTime,
    to: UnixTime,
    configuration: CirculatingSupplyEntry & { id: string },
  ): Promise<AmountRecord[]> {
    const circulatingSupplies =
      await this.$.circulatingSupplyProvider.getCirculatingSupplies(
        configuration.coingeckoId,
        { from, to },
      )

    return circulatingSupplies.map((circulatingSupply) => {
      assert(isInteger(circulatingSupply.value), 'Should be an integer')
      return {
        configId: configuration.id,
        timestamp: circulatingSupply.timestamp,
        amount:
          BigInt(circulatingSupply.value) *
          10n ** BigInt(configuration.decimals),
      }
    })
  }

  getAdjustedTo(from: number, to: number): UnixTime {
    return CoingeckoQueryService.calculateAdjustedTo(
      new UnixTime(from),
      new UnixTime(to),
    )
  }
}
