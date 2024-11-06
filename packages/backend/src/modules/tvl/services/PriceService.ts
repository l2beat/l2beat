import { PriceRecord } from '@l2beat/database'
import { CoingeckoQueryService, PriceProvider } from '@l2beat/shared'
import {
  assert,
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { Configuration } from '../../../tools/uif/multi/types'

export interface PriceServiceDependencies {
  readonly priceProvider: PriceProvider
}

export class PriceService {
  constructor(private readonly $: PriceServiceDependencies) {}

  async fetchPrices(
    from: UnixTime,
    to: UnixTime,
    coingeckoId: CoingeckoId,
    configurations: Configuration<CoingeckoPriceConfigEntry>[],
  ): Promise<PriceRecord[]> {
    assert(
      configurations.every((c) => c.properties.coingeckoId === coingeckoId),
      'Configuration error: coingeckoId mismatch',
    )

    const prices = await this.$.priceProvider.getUsdPriceHistoryHourly(
      coingeckoId,
      from,
      to,
      undefined,
    )

    return configurations
      .map((c) =>
        prices
          .filter((p) =>
            p.timestamp.gte(new UnixTime(c.minHeight)) && c.maxHeight
              ? p.timestamp.lte(new UnixTime(c.maxHeight))
              : true,
          )
          .map((p) => ({
            timestamp: p.timestamp,
            priceUsd: p.value,
            configId: c.id,
          })),
      )
      .flat()
  }

  getAdjustedTo(from: number, to: number): UnixTime {
    return CoingeckoQueryService.getAdjustedTo(
      new UnixTime(from),
      new UnixTime(to),
    )
  }
}
