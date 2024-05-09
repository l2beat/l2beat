import { assert, Logger } from '@l2beat/backend-tools'

import { CoingeckoQueryService } from '@l2beat/shared'
import { CoingeckoPriceConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { UpdateConfiguration } from '../../../tools/uif/multi/types'
import { PriceRecord } from '../repositories/PriceRepository'

export interface PriceServiceDependencies {
  readonly coingeckoQueryService: CoingeckoQueryService
  logger: Logger
}

export class PriceService {
  constructor(private readonly $: PriceServiceDependencies) {
    this.$.logger = $.logger.for(this)
  }

  async fetchPrices(
    from: UnixTime,
    to: UnixTime,
    configurations: UpdateConfiguration<CoingeckoPriceConfigEntry>[],
  ): Promise<PriceRecord[]> {
    if (configurations.length === 0) {
      return []
    }

    const coingeckoId = configurations[0].properties.coingeckoId
    assert(
      configurations.every((c) => c.properties.coingeckoId === coingeckoId),
      'Configuration error: coingeckoId mismatch',
    )

    const prices = await this.$.coingeckoQueryService.getUsdPriceHistoryHourly(
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
