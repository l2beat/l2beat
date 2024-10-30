import { Logger } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient2,
  PriceProvider,
  RetryHandler,
} from '@l2beat/shared'
import { Config } from '../config/Config'

export class PriceProviders {
  private readonly priceProvider: PriceProvider
  constructor(private readonly coingeckoQueryService: CoingeckoQueryService) {
    this.priceProvider = new PriceProvider(coingeckoQueryService)
  }

  getPriceProvider() {
    return this.priceProvider
  }
}

export function initPriceProviders(config: Config): PriceProviders {
  const logger = Logger.SILENT

  const coingeckoClient = new CoingeckoClient(
    new HttpClient2(),
    config.coingeckoApiKey,
    RetryHandler.RELIABLE_API(logger),
  )
  const coingeckoQueryService = new CoingeckoQueryService(
    coingeckoClient,
    logger.tag('prices'),
  )

  return new PriceProviders(coingeckoQueryService)
}
