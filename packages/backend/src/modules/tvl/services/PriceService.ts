import type { Logger } from '@l2beat/backend-tools'
import type { Database, PriceRecord } from '@l2beat/database'
import {
  CoingeckoQueryService,
  type PriceProvider,
  type QueryResultPoint,
} from '@l2beat/shared'
import {
  assert,
  type CoingeckoId,
  type CoingeckoPriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import type { Configuration } from '../../../tools/uif/multi/types'

export interface PriceServiceDependencies {
  readonly priceProvider: PriceProvider
  readonly database: Database
  readonly logger: Logger
}

export class PriceService {
  logger: Logger

  constructor(private readonly $: PriceServiceDependencies) {
    this.logger = this.$.logger.for(this)
  }

  async getPrices(
    from: UnixTime,
    to: UnixTime,
    coingeckoId: CoingeckoId,
    configurations: Configuration<CoingeckoPriceConfigEntry>[],
  ): Promise<PriceRecord[]> {
    assert(
      configurations.every((c) => c.properties.coingeckoId === coingeckoId),
      'Configuration error: coingeckoId mismatch',
    )

    const prices = await this.fetchPricesWithFallback(
      coingeckoId,
      from,
      to,
      configurations,
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

  async fetchPricesWithFallback(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    configurations: Configuration<CoingeckoPriceConfigEntry>[],
  ): Promise<QueryResultPoint[]> {
    try {
      return await this.$.priceProvider.getUsdPriceHistoryHourly(
        coingeckoId,
        from,
        to,
      )
    } catch (error) {
      assertLatestHour(from, to, error, coingeckoId)

      const priceFromDb = await this.getLatestPriceFromDb(
        to,
        configurations,
        coingeckoId,
      )

      return [priceFromDb]
    }
  }

  private async getLatestPriceFromDb(
    latestHour: UnixTime,
    configurations: Configuration<CoingeckoPriceConfigEntry>[],
    coingeckoId: CoingeckoId,
  ) {
    const fallbackPrice = await this.$.database.price.getLatestPrice(
      configurations.map((c) => c.id),
    )

    assert(
      fallbackPrice,
      `Latest price not found for ${coingeckoId} @ ${latestHour.toNumber()}`,
    )

    this.logger.warn(
      `${coingeckoId}: DB fallback triggered: failed to fetch price from Coingecko`,
      {
        coingeckoId,
        latestHour: latestHour.toNumber(),
        fallbackPrice: JSON.stringify(fallbackPrice),
      },
    )

    return {
      value: fallbackPrice.priceUsd,
      timestamp: fallbackPrice.timestamp,
    }
  }

  calculateAdjustedTo(from: number, to: number): UnixTime {
    return CoingeckoQueryService.calculateAdjustedTo(
      new UnixTime(from),
      new UnixTime(to),
    )
  }
}

function assertLatestHour(
  from: UnixTime,
  to: UnixTime,
  error: unknown,
  coingeckoId: CoingeckoId,
) {
  const diff = to.toNumber() - from.toNumber()
  if (diff >= 3600) throw error
  assert(
    to.isFull('hour'),
    `Latest hour assert failed for ${coingeckoId} <${from.toNumber()},${to.toNumber()}>`,
  )

  return to
}
