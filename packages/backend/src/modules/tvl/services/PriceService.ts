import { Logger } from '@l2beat/backend-tools'
import { Database, PriceRecord } from '@l2beat/database'
import {
  CoingeckoQueryService,
  PriceProvider,
  QueryResultPoint,
} from '@l2beat/shared'
import {
  assert,
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { Configuration } from '../../../tools/uif/multi/types'

export interface PriceServiceDependencies {
  readonly priceProvider: PriceProvider
  readonly database: Database
  readonly logger: Logger
}

export class PriceService {
  constructor(private readonly $: PriceServiceDependencies) {}

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
      assertLatestHour(coingeckoId, from, to, error)

      const fallback = await this.getLatestPriceFromDb(
        coingeckoId,
        from,
        to,
        configurations,
      )

      this.$.logger.error(
        'DB fallback triggered: failed to fetch price from Coingecko',
        {
          coingeckoId,
          from,
          to,
        },
      )

      return [
        {
          value: fallback.priceUsd,
          timestamp: fallback.timestamp,
          deltaMs: 0, // unnecessary in this case
        },
      ]
    }
  }

  private async getLatestPriceFromDb(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    configurations: Configuration<CoingeckoPriceConfigEntry>[],
  ) {
    const records = await this.$.database.price.getByConfigIdsInRange(
      configurations.map((c) => c.id),
      from,
      to,
    )

    const fallback = records.find((r) => r.timestamp.equals(to))

    assert(fallback, `DB fallback failed: ${coingeckoId}`)
    return fallback
  }

  calculateAdjustedTo(from: number, to: number): UnixTime {
    return CoingeckoQueryService.calculateAdjustedTo(
      new UnixTime(from),
      new UnixTime(to),
    )
  }
}

function assertLatestHour(
  coingeckoId: CoingeckoId,
  from: UnixTime,
  to: UnixTime,
  error: unknown,
) {
  const diff = to.toNumber() - from.toNumber()
  if (diff >= 3600) throw error
  assert(to.isFull('hour'), `DB fallback failed: ${coingeckoId}`)
}
