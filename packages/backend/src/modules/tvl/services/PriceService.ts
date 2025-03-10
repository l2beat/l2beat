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
            p.timestamp >= UnixTime(c.minHeight) && c.maxHeight
              ? p.timestamp <= UnixTime(c.maxHeight)
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
      assertLatestHour(from, to, error, coingeckoId, this.logger)

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

    assert(fallbackPrice, `No price not found for ${coingeckoId}`)

    this.logger.warn(
      `${coingeckoId}: DB fallback triggered: failed to fetch price from Coingecko`,
      {
        coingeckoId,
        latestHour: latestHour,
        fallbackPrice: fallbackPrice.priceUsd,
      },
    )

    return {
      timestamp: latestHour,
      value: fallbackPrice.priceUsd,
    }
  }

  calculateAdjustedTo(from: number, to: number): UnixTime {
    return CoingeckoQueryService.calculateAdjustedTo(
      UnixTime(from),
      UnixTime(to),
    )
  }
}

function assertLatestHour(
  from: UnixTime,
  to: UnixTime,
  error: unknown,
  coingeckoId: CoingeckoId,
  logger: Logger,
) {
  const diff = to - from
  if (diff >= 3600) {
    logger.error(`Timestamps diff to large to perform fallback`, { diff })
    throw error
  }
  assert(
    UnixTime.isFull(to, 'hour'),
    `Latest hour assert failed for ${coingeckoId} <${from},${to}>`,
  )

  return to
}
