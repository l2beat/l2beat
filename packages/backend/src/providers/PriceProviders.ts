import { Logger } from '@l2beat/backend-tools'
import {
  type CoingeckoClient,
  CoingeckoQueryService,
  PriceProvider,
} from '@l2beat/shared'

export class PriceProviders {
  private readonly priceProvider: PriceProvider
  constructor(private readonly coingeckoQueryService: CoingeckoQueryService) {
    this.priceProvider = new PriceProvider(coingeckoQueryService)
  }

  getPriceProvider() {
    return this.priceProvider
  }
}

export function initPriceProviders(
  coingeckoClient: CoingeckoClient,
): PriceProviders {
  const logger = Logger.SILENT
  const coingeckoQueryService = new CoingeckoQueryService(
    coingeckoClient,
    logger.tag({ tag: 'prices' }),
  )

  return new PriceProviders(coingeckoQueryService)
}
