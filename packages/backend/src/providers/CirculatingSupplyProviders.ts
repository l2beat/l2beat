import { Logger } from '@l2beat/backend-tools'
import {
  CirculatingSupplyProvider,
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient2,
  RetryHandler,
} from '@l2beat/shared'
import { Config } from '../config/Config'

export class CirculatingSupplyProviders {
  private readonly circulatingSupplyProvider: CirculatingSupplyProvider

  constructor(private readonly coingeckoQueryService: CoingeckoQueryService) {
    this.circulatingSupplyProvider = new CirculatingSupplyProvider(
      coingeckoQueryService,
    )
  }

  getCirculatingSupplyProvider() {
    return this.circulatingSupplyProvider
  }
}

export function initCirculatingSupplyProviders(
  config: Config,
): CirculatingSupplyProviders {
  const logger = Logger.SILENT

  const coingeckoClient = new CoingeckoClient(
    new HttpClient2(),
    config.coingeckoApiKey,
    RetryHandler.RELIABLE_API(logger),
  )
  const coingeckoQueryService = new CoingeckoQueryService(
    coingeckoClient,
    logger.tag('circulatingSupply'),
  )

  return new CirculatingSupplyProviders(coingeckoQueryService)
}
