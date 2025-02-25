import type { Logger } from '@l2beat/backend-tools'
import type { AmountRecord, Database } from '@l2beat/database'
import {
  type CirculatingSupplyProvider,
  CoingeckoQueryService,
} from '@l2beat/shared'
import {
  assert,
  type CirculatingSupplyEntry,
  type CoingeckoId,
  UnixTime,
} from '@l2beat/shared-pure'
import { isInteger } from 'lodash'

export interface CirculatingSupplyServiceDependencies {
  readonly circulatingSupplyProvider: CirculatingSupplyProvider
  readonly database: Database
  readonly logger: Logger
}

export class CirculatingSupplyService {
  logger: Logger

  constructor(private readonly $: CirculatingSupplyServiceDependencies) {
    this.logger = this.$.logger.for(this)
  }

  async fetchCirculatingSupplies(
    from: UnixTime,
    to: UnixTime,
    configuration: CirculatingSupplyEntry & { id: string },
  ): Promise<AmountRecord[]> {
    try {
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
    } catch (error) {
      assertLatestHour(from, to, error, configuration.coingeckoId, this.logger)

      const fallbackSupply = await this.getLatestSupplyFromDb(to, configuration)

      return [fallbackSupply]
    }
  }

  private async getLatestSupplyFromDb(
    latestHour: UnixTime,
    configuration: CirculatingSupplyEntry & { id: string },
  ): Promise<AmountRecord> {
    const fallbackSupply = await this.$.database.amount.getLatestAmount(
      configuration.id,
    )

    assert(
      fallbackSupply,
      `No circulating supply found for ${configuration.coingeckoId}`,
    )

    this.logger.warn(
      `${configuration.coingeckoId}: DB fallback triggered: failed to fetch circulating supply from provider`,
      {
        coingeckoId: configuration.coingeckoId,
        latestHour: latestHour.toNumber(),
        fallbackSupply: fallbackSupply.amount,
      },
    )

    return {
      timestamp: latestHour,
      amount: fallbackSupply.amount,
      configId: configuration.id,
    }
  }

  getAdjustedTo(from: number, to: number): UnixTime {
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
  logger: Logger,
) {
  const diff = to.toNumber() - from.toNumber()
  if (diff >= 3600) {
    logger.error(`Timestamps diff too large to perform fallback`, { diff })
    throw error
  }
  assert(
    to.isFull('hour'),
    `Latest hour assert failed for ${coingeckoId} <${from.toNumber()},${to.toNumber()}>`,
  )

  return to
}
