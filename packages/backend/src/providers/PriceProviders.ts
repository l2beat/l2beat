import { Logger } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient2,
  PriceProvider,
  RetryHandler,
} from '@l2beat/shared'
import { TvlConfig } from '../config/Config'

export class PriceProviders {
  constructor(private readonly coingeckoQueryService: CoingeckoQueryService) {}

  getPriceProvider() {
    return new PriceProvider(this.coingeckoQueryService)
  }
}

export function initPriceProviders(config: TvlConfig): PriceProviders {
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
