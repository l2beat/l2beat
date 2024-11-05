import { AmountRecord } from '@l2beat/database'
import {
  CirculatingSupplyProvider,
  CoingeckoQueryService,
} from '@l2beat/shared'
import { assert, CirculatingSupplyEntry, UnixTime } from '@l2beat/shared-pure'
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
        undefined,
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
    return CoingeckoQueryService.getAdjustedTo(
      new UnixTime(from),
      new UnixTime(to),
    )
  }
}
